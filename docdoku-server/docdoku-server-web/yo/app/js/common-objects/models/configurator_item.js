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
        this.orphans = {};
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
            //TODO kelto: could refactor that with calculate
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
            _.each(this.orphans, function(orphan) {
                orphan.construct();
            });

            return this;
        };

        this.calculate = function() {
            this.resetValues();
            this.config_item.components.length > 0 ? this.visitedAssemblies += this.config_item.amount : this.visitedInstances += this.config_item.amount;
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
            _.each(this.children, function (child) {
                child.calculate();
                _.each(self.attributes.models, function (attribute) {
                    self.addChildValues(child, attribute.get('name'));
                });
            });

            //should always set the model before the substitutes: the reference should be fully initialized to be use.
            this.model.set(this.values);
            _.each(this.substitutes, function (substitute) {
                substitute.calculate();
            });
            _.each(this.orphans, function(orphan) {
                orphan.calculate();
            });

            return this;
        };

        // TODO kelto: Should define if this function use the reference or the substitutes
        this.swap = function (toChild, toOrphan) {

            var childPath = toChild.config_item.path;
            var orphanPath = toOrphan.config_item.path;

            this.substitutes[orphanPath] = toOrphan;
            delete this.substitutes[childPath];


            this.parent.children[childPath] = toChild;
            delete this.parent.children[orphanPath];
            toChild.reference = toChild;
            _.each(this.substitutes, function(substitute) {
                substitute.reference = toChild;
            });
            var emptySubstitutes = toChild.substitutes;
            toChild.substitutes = toOrphan.substitutes;
            toOrphan.substitutes = emptySubstitutes;

            this.parent.sumUpdate(toChild.values,toOrphan.values);

            return this;
        };

        this.undoSubstitute = function(pathRef, pathSubstitute) {
            this.map[pathSubstitute].swap(this.map[pathRef],this.map[pathSubstitute]);
        };

        this.setOptional = function() {
            delete this.parent.children[this.config_item.path];
            this.parent.orphans[this.config_item.path] = this;
            this.parent.sumUpdate({},this.values);
        };

        this.unsetOptional = function() {
            this.parent.children[this.config_item.path] = this;
            this.parent.sumUpdate(this.values,{});
        };

        this.sumUpdate = function(newValues,oldValue) {
            var self = this;
            var old = _.clone(this.values);
            _.each(this.attributes.models, function(attribute) {
                self.values[attribute.get('name')] -= oldValue[attribute.get('name')] || 0;
                self.values[attribute.get('name')] += newValues[attribute.get('name')] || 0;
            });
            if(parent) {
                parent.sumUpdate(this.values,old);
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
                this.substitutes[substitute.path] = this.map[substitute.path];
                this.map[substitute.path].reference = this;
            }

            return this.map[substitute.path];
        };

        this.unset = function(attribute,operator) {
            if(!operator) {
                this.attributes.remove(attribute);
            } else {
                this.attributes.removeOperator(attribute,operator);
            }
        };

        this.getPartLinks = function(array) {
            array.unshift({
                name: this.config_item.name,
                number: this.config_item.number,
                referenceDescription: this.config_item.partUsageLinkReferenceDescription
            });
            if(this.parent) {
                this.parent.getPartLinks(array);
            }
        };
    };


    return Configurator_item;
});
