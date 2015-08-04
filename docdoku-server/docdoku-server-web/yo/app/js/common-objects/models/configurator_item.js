/*global _,define*/
define([
    'backbone',
    'mustache',
    'text!common-objects/templates/udf/user_defined_function.html',
    'common-objects/collections/configuration_items',
    'common-objects/collections/baselines',
    'common-objects/views/udf/calculation',
    'common-objects/models/calculation'
], function (Backbone, Mustache, template,ConfigurationItemCollection,Baselines, CalculationView, Calculation) {

    'use strict';

    // TODO kelto: it might be better to use a backbone model to use the default events implementation
    // or use a better observer pattern
    var Configurator_item = function(config_item,map, attributes, parent) {

        this.children = {};
        this.substitutes = {};
        this.config_item = config_item;
        this.attributesValues = {};
        this.values = {};
        this.map = map;
        this.attributes = attributes;
        this.parent = parent;
        this.listener = null;
        this.reference = null;
        this.visitedAssemblies = 0;
        this.visitedInstances = 0;

        this.construct = function() {
            this.resetValues();
            this.config_item.components.length > 0 ? this.visitedAssemblies+= this.config_item.amount : this.visitedInstances+=this.config_item.amount;
            this.map[config_item.path] = this;
            var self = this;
            _.each(this.config_item.attributes, function(attribute) {
                if(attribute.type === 'NUMBER') {
                    self.attributesValues[attribute.name] = parseFloat(attribute.value);
                }
            });
            _.each(this.attributes, function(attribute) {
                self.values[attribute] = (self.attributesValues[attribute] || 0 ) * self.config_item.amount;
            });
            _.each(this.config_item.components, function(component) {
                var child = new Configurator_item(component,self.map,self.attributes,self);
                self.children[component.path] = child;
                child.construct();
                _.each(self.attributes, function(attribute) {
                   self.addChildValues(child,attribute);
                });
            });
            _.each(this.substitutes, function(substitute) {
                substitute.construct();
            });
            return this.notify();
        };

        this.addChildValues = function(child,attribute) {
            this.values[attribute] += (child.values[attribute]* this.config_item.amount);
            this.visitedAssemblies += child.visitedAssemblies * this.config_item.amount;
            this.visitedInstances += child.visitedInstances * this.config_item.amount;
        }

        this.onSwap = function(newChild, oldChild) {
            var toOrphan = this.parent.children[oldChild.path];
            var toChild = this.substitutes[newChild.path] || new Configurator_item(newChild,this.map,this.attributes,this.parent).construct();
            this.parent.substitutes[oldChild.path] = toOrphan;
            delete this.parent.substitutes[newChild.path];
            this.parent.children[newChild.path] = toChild;
            delete this.parent.children[oldChild.path];

            var oldValue = toOrphan.values;
            this.sumUpdate(toChild,oldValue);

        };

        this.sumUpdate = function(child,oldValue) {
            var self = this;
            var old = _.clone(this.values);
            _.each(this.attributes, function(attribute) {
                self.values[attribute] -= oldValue[attribute];
                self.values[attribute] += child.values[attribute];
            });
            if(parent) {
                parent.sumUpdate(this,old);
            }
            return this.notify();
        };

        this.getSubstitute = function(substitute) {
            this.substitutes[substitute.path] = this.substitutes[substitute.path] || new Configurator_item(substitute,this.map,this.attributes,this);
            this.substitutes[substitute.path].reference = this;
            return this.substitutes[substitute.path];
        };

        this.setListener = function(callback) {
            this.listener = callback;
            return this;
        };

        this.resetValues = function() {
            this.values = {};
            this.visitedInstances = 0;
            this.visitedAssemblies = 0;
        };

        this.notify = function () {
            if(this.listener) {
                this.listener();
            }
            return this;
        };
    };

    return Configurator_item;
});
