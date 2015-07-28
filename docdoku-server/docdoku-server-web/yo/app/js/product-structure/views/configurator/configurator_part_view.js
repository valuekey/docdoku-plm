/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_part.html'
    ], function (Backbone, Mustache, template) {

        'use strict';

        var ConfiguratorPartView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                this.partListAttributes = this.$('#part-attributes-list');
                return this;
            },

            setSubstitute: function(reference) {
                //this.$('.well').css('display','inline-block');
                this.$('.well').css('margin-left','0').css('width','100%');
                this.$el.css('display','inline-block');
                this.$el.css('margin-left','50px');
                this.$el.css('width','20%');
                this.attributes = {};
                this.modelAttributes = {};
                var refAttributes = {};
                var self = this;
                _.each(this.model.attributes, function(attribute) {
                    self.modelAttributes[attribute.name] = attribute.value;
                });

                _.each(reference.get('attributes'), function(attribute) {
                    refAttributes[attribute.name] = attribute.value;
                })

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

            //TODO kelto: set Reference and set Substitute can be refactored
            setReference: function() {
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
            }
        });

        return ConfiguratorPartView;
    });

