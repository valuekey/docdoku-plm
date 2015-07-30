/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_part.html',
        'models/component_module'
    ], function (Backbone, Mustache, template, Component) {

        'use strict';

        var ConfiguratorPartView = Backbone.View.extend({

            className: 'configurator-part',
            events: {
                'click': 'onClick'
            },
            render: function() {
                this.isSelected = true;
                if(!(this.model instanceof Backbone.Model)) {
                    this.model = new Component.Model(this.model);
                }
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                this.bindDom().bindEvents();
                return this;
            },

            bindDom: function() {
                this.partListAttributes = this.$('#part-attributes-list');
                return this;
            },

            bindEvents: function() {
                this.listenTo(this.collection,'remove',this.updateAttributes);
                //change is trigger on adding, so no need to listenTo add.
                this.listenTo(this.collection,'change',this.updateAttributes);
                return this;
            },

            updateAttributes: function(calculation) {
                // TODO kelto: should just add or remove a new view instead of rendering everything
                //split it in two function remove and add.
                this.partListAttributes.empty();
                if(this.isSubstitute) {
                    this.setSubstitute();
                } else {
                    this.setReference();
                }
            },

            setSubstitute: function(reference) {
                if(reference) {
                    this.reference = reference;
                }

                this.isSubstitute = true;
                this.$el.toggleClass('inactive');
                this.attributes = {};
                this.modelAttributes = {};
                var refAttributes = {};
                var self = this;
                _.each(this.model.get('attributes'), function(attribute) {
                    debugger;
                    self.modelAttributes[attribute.name] = attribute.value;
                });

                _.each(this.reference.get('attributes'), function(attribute) {
                    refAttributes[attribute.name] = attribute.value;
                });

                //TODO kelto: #refactorCalculation
                _.each(this.collection.models, function(calculation) {
                    var attributeName = calculation.getAttributeName();
                    if(self.modelAttributes[attributeName] === undefined) {
                        self.attributes[attributeName] = 0;
                    } else {
                        self.attributes[attributeName] = self.modelAttributes[attributeName] - refAttributes[attributeName];
                    }
                });
                this.renderAttributes();
                return this;
            },

            //TODO kelto: should create a view which will be removed when the calculation is destroyed.
            renderAttributes: function() {
                var self = this;
                _.each(this.attributes,function(value, name) {
                    self.partListAttributes.append('<li>'+name+' : '+value+'</li>');
                });
            },

            toggleClass: function() {
                this.$el.toggleClass('inactive',500);
            },

            //TODO kelto: set Reference and set Substitute can be refactored
            setReference: function() {
                // TODO kelto: isSubstitute should be passed in the constructor and used for the constructor.
                this.isSubstitute = false;
                this.modelAttributes = {};
                this.attributes = {};
                var self = this;
                _.each(this.model.get('attributes'), function(attribute, test) {
                    self.modelAttributes[attribute.name] = attribute.value;
                });
                _.each(this.collection.models, function(calculation) {
                    var attributeName = calculation.getAttributeName();
                    if(self.modelAttributes[attributeName] === undefined) {
                        self.attributes[attributeName] = 0;
                    } else {
                        self.attributes[attributeName] = self.modelAttributes[attributeName];
                    }
                });
                this.renderAttributes();
            },

            onClick: function(e) {
                debugger;
                if(this.model.isOptional()) {
                    if(this.isSelected) {
                        this.isSelected = false;
                        this.$el.fadeTo('fast',0.33);
                    } else {
                        this.isSelected = true;
                        this.$el.fadeTo('fast',1);
                    }

                }
                this.trigger('part-view:click',this);
            }
        });

        return ConfiguratorPartView;
    });

