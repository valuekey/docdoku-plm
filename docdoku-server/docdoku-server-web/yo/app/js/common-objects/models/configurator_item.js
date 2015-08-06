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
        this.model = new Backbone.Model();

        this.construct = function () {
            this.resetValues();
            this.config_item.components.length > 0 ? this.visitedAssemblies += this.config_item.amount : this.visitedInstances += this.config_item.amount;
            this.map[config_item.path] = this;
            var self = this;
            _.each(this.config_item.attributes, function (attribute) {
                if (attribute.type === 'NUMBER') {
                    attributesValues[attribute.name] = parseFloat(attribute.value);
                }
            });
            _.each(this.config_item.components, function (component) {
                var child = self.createNode(component, self);
                self.children[component.path] = child;
                child.construct();
                _.each(self.getAttributes(), function (attribute) {
                    self.addChildValues(child, attribute);
                });
            });
            _.each(this.getSubstitutes(), function (substitute) {
                substitute.construct();
            });
        };

        this.swap = function (newChild, oldChild) {
            var parent = this.getParent();
            var substitutes = this.getSubstitutes();
            var toChild = substitutes[newChild.path] || this.createNode(newChild, parent).construct();
            var toOrphan = parent.getChildren()[oldChild.path];
            debugger;
            this.model.set(this.values);
            return this;
        }
        ;

        this.addChildValues = function (child, attribute) {
            this.values[attribute] += (child.values[attribute] * this.config_item.amount);
            this.visitedAssemblies += child.visitedAssemblies * this.config_item.amount;
            this.visitedInstances += child.visitedInstances * this.config_item.amount;
        };

        this.createNode = function (config_item, parent) {
            return this.map[config_item.path] || new Configurator_item(config_item, this.map, this.attributes, parent);
        };

        this.notify = function () {
            if (this.listener) {
                this.listener();
            }
            return this;
        };

        this.resetValues = function() {
            this.values = {};
            this.visitedAssemblies = 0;
            this.visitedInstances = 0;
        };
    };


    return Configurator_item;
});
