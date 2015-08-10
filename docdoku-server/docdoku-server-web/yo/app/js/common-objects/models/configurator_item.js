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
        this.substitutes = [];
        this.config_item = config_item;
        this.values = {};
        this.attributesValues = {};
        this.map = map;
        this.attributes = attributes;
        this.parent = parent;
        this.reference = this;
        this.visitedAssemblies = 0;
        this.visitedInstances = 0;
        this.model = new Backbone.Model();

        this.construct = function () {
            this.resetValues();
            this.config_item.components.length > 0 ? this.visitedAssemblies += this.config_item.amount : this.visitedInstances += this.config_item.amount;
            this.map[config_item.path] = this;
            var self = this;
            //TODO kelto: should do that in constructor
            _.each(this.config_item.attributes, function (attribute) {
                if (attribute.type === 'NUMBER') {
                    self.attributesValues[attribute.name] = parseFloat(attribute.value);
                }
            });
            _.each(this.attributes.models, function(attribute) {
                self.values[attribute.get('name')] = (self.attributesValues[attribute.get('name')] || 0 ) * self.config_item.amount;
            });
            _.each(this.config_item.components, function (component) {
                var child = self.createNode(component, self);
                self.children[component.path] = child;
                child.construct();
                _.each(self.attributes.models, function (attribute) {
                    self.addChildValues(child, attribute.get('name'));
                });
            });
            //should always set the model before the substitutes: the reference should be fully initialized to be use.
            this.model.set(this.values);
            _.each(this.substitutes, function (substitute) {
                substitute.construct();
            });

            return this;
        };



        this.swap = function (toChild, toOrphan) {

            //TODO kelto: should we update the substitutes ?
            //this.substitutes[oldChild.path] = toOrphan;
            //delete this.substitutes[newChild.path];

            //TODO kelto: should we update the children ?
            //this.parent.children[newChild.path] = toChild;
            //delete this.parent.children[oldChild.path];

            var oldValue = toOrphan.values;
            this.parent.sumUpdate(toChild,oldValue);

            return this;
        };

        this.sumUpdate = function(child,oldValue) {
            var self = this;
            var old = _.clone(this.values);
            _.each(this.attributes.models, function(attribute) {
                self.values[attribute.get('name')] -= oldValue[attribute.get('name')];
                self.values[attribute.get('name')] += child.values[attribute.get('name')];
            });
            if(parent) {
                parent.sumUpdate(this,old);
            }
            this.model.set(this.values);
        };

        this.addChildValues = function (child, attribute) {
            this.values[attribute] += (child.values[attribute] * this.config_item.amount);
            this.visitedAssemblies += child.visitedAssemblies * this.config_item.amount;
            this.visitedInstances += child.visitedInstances * this.config_item.amount;
        };

        this.createNode = function (config_item, parent) {
            return this.map[config_item.path] || new Configurator_item(config_item, this.map, this.attributes, parent);
        };


        this.resetValues = function() {
            this.values = {};
            this.visitedAssemblies = 0;
            this.visitedInstances = 0;
        };


        this.getSubstitute = function(substitute) {
            if(!this.map[substitute.path]) {
                this.map[substitute.path] = new Configurator_item(substitute,this.map,this.attributes,this.parent).construct();
                this.substitutes.push(this.map[substitute.path]);
            }

            this.map[substitute.path].reference = this;

            return this.map[substitute.path];
        };

        this.unset = function(attribute) {
            this.attributes.remove(attribute);
            this.model.unset(attribute);
        }
    };


    return Configurator_item;
});
