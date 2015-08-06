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
    var Configurator_item = Backbone.Model.extend({

        /*

    this.attributesValues = {};

    this.visitedAssemblies = 0;
    this.visitedInstances = 0;
    */
        initialize: function() {
            this.constructor.__super__.initialize.apply(this,arguments);
            _.bindAll(this);
            this.set('children',{});
            this.set('substitutes',{});
            this.parseAttributes();
        },

        parseAttributes: function() {
            var attributesValues = {};
            _.each(this.getConfigItem().attributes, function(attribute) {
                if(attribute.type === 'NUMBER') {
                    attributesValues[attribute.name] = parseFloat(attribute.value);
                }
            });
            this.set('attributesValues',attributesValues,{silent: true});
        },

        addAttribute: function(attribute) {
            this.get('attributes').push(attribute);
            this.trigger('add:attributes',attribute);
        },

        removeAttribute: function(attribute) {
            //TODO kelto: should change the way we store attributes as array of object (name and operator)
            var array = this.get('attributes');
            array.splice(array.indexOf(attribute));
            this.trigger('remove:attributes',attribute);
        },

        getAttributesValues: function() {
            return this.get('attributesValues');
        },

        getChildren: function() {
            return this.get('children');
        },

        addChildren: function(config_item) {
            this.getChildren()[config_item.path] = createNode(config_item,this);
            this.trigger('children:change');
        },

        createNode: function(config_item,parent) {
            return this.getMap()[config_item.path] || new Configurator_item(
                {
                    config_item: config_item,
                    map: this.getMap(),
                    attributes: this.getAttributes(),
                    parent: parent
                });
        },

        getAttributes: function() {
            return this.get('attributes');
        },

        getMap: function() {
            return this.get('map');
        },

        getReference: function() {
            return this.get('reference');
        },

        setReference: function(reference) {
            /*
            if(this.getReference()) {
                this.stopListening(this.getReference());
            }
            this.listenTo(reference,'change:values',this.onChangeReference);
            */
            return this.set('reference',reference);
        },

        bindReference: function(reference) {
            this.setReference(reference);
            this.listenTo(reference,'change:values',this.onChangeReference);
        },

        unBindReference: function() {
            this.stopListening(this.getReference());
            this.set('reference',null);
        },

        onChangeReference: function() {
            debugger;
            this.trigger('change:reference');
        },

        getSubstitutes: function() {
            return this.get('substitutes');
        },

        getValues: function() {
            return this.get('values');
        },

        setValues: function(values) {
            return this.set('values',values);
        },

        getVisitedAssemblies: function() {
            return this.get('visitedAssemblies');
        },

        setVisitedAssemblies: function(value) {
            return this.set('visitedAssemblies',value);
        },
        getVisitedInstances: function() {
            return this.get('visitedInstances');
        },

        setVisitedInstances: function(value) {
            return this.set('visitedInstances',value);
        },

        getConfigItem: function() {
            return this.get('config_item');
        },

        getParent: function() {
            return this.get('parent');
        },

        setParent: function(parent) {
            return this.set('parent',parent);
        },

        /******************* BUSINESS LOGIC *********************/

        construct: function() {
            var values = {};
            //reset values but don't trigger the change, only at the end of construct
            this.set('values',values,{silent: true});
            var visitedInstances = 0;
            var visitedAssemblies = 0;
            var config_item = this.getConfigItem();
            config_item.components.length > 0 ? visitedAssemblies+= config_item.amount : visitedInstances+= config_item.amount;
            this.getMap()[config_item.path] = this;
            var self = this;

            _.each(this.getAttributes(), function(attribute) {
                values[attribute] = (self.getAttributesValues()[attribute] || 0 ) * config_item.amount;
            });
            _.each(config_item.components, function(component) {
                var child = self.createNode(component,self);
                self.getChildren()[component.path] = child;
                child.construct();
                _.each(self.getAttributes(), function(attribute) {
                    values[attribute] += (child.getValues()[attribute]* config_item.amount);
                    visitedAssemblies += child.getVisitedAssemblies() * config_item.amount;
                    visitedInstances += child.getVisitedInstances() * config_item.amount;
                });
            });
            _.each(this.getSubstitutes(), function(substitute) {
                substitute.construct();
            });
            this.setVisitedAssemblies(visitedAssemblies);
            this.setVisitedInstances(visitedInstances);
            this.trigger('change:values',values);
            return this;
        },

        swap : function(newChild, oldChild) {
            var parent = this.getParent();
            var substitutes = this.getSubstitutes();
            var toChild = substitutes[newChild.path] || this.createNode(newChild,parent).construct();
            var toOrphan = parent.getChildren()[oldChild.path];

            substitutes[oldChild.path] = toOrphan;
            parent.getChildren()[newChild.path] = toChild;

            delete parent.getSubstitutes()[newChild.path];
            delete parent.getChildren()[oldChild.path];

            _.each(substitutes,function(substitute) {
                substitute.unBindReference().bindReference(toChild);
            });

            toChild.unBindReference();
            var oldValue = toOrphan.getValues();
            this.sumUpdate(toChild,oldValue);

        },

        sumUpdate : function(child,oldValue) {
            var self = this;
            var old = _.clone(this.getValues());
            _.each(this.attributes, function(attribute) {
                self.getValues()[attribute] -= oldValue[attribute];
                self.getValues()[attribute] += child.getValues()[attribute];
            });
            if(this.getParent()) {
                this.getParent().sumUpdate(this,old);
            }
            return this;
        },


        createSubstitute : function(substitute) {
            this.getSubstitutes()[substitute.path] = this.getSubstitutes()[substitute.path] || this.createNode(substitute,this.parent);
            this.getSubstitutes()[substitute.path].bindReference(this);
            return this.getSubstitutes()[substitute.path];
        }
    });

    return Configurator_item;
});
