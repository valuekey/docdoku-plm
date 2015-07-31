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
            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.isSubstitute = this.options.isSubstitute;
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
                //But the change should be triggered on the calculation level, not rendering everything.
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
                this.$el.toggleClass('inactive',true);
                this.attributes = {};
                this.modelAttributes = {};
                var refAttributes = {};
                var self = this;

                this.calculateAttribute();
                this.renderAttributes();
                return this;
            },

            //TODO kelto: should create a view which will be removed when the calculation is destroyed.
            renderAttributes: function() {
                this.partListAttributes.empty();
                var self = this;
                _.each(this.attributes,function(value, name) {
                    var html = '<li>'+name+' : '+(self.modelAttributes[name] || 0 );
                    if(self.isSubstitute) {
                        html+= '<span style="color: ';
                        if(value < 0) {
                            html += 'red"> ( '+value;
                        } else {
                            html += 'green"> ( + '+value;
                        }
                        html += ' ) </span>';
                    }

                    html+= '</li>';
                    self.partListAttributes.append(html);
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
                //TODO kelto: no need for an extra class ! substitute are separate from ref by a div container
                this.$el.toggleClass('inactive',false);
                this.calculateAttribute();
                this.renderAttributes();
            },

            onClick: function(e) {
                if(!this.isSubstitute && this.model.isOptional()) {
                    if(this.isSelected) {
                        this.isSelected = false;
                        this.$el.fadeTo('fast',0.33);
                    } else {
                        this.isSelected = true;
                        this.$el.fadeTo('fast',1);
                    }
                    this.trigger('part-view:optionalToggle',this);
                } else {
                    this.trigger('part-view:substituteToggle',this);
                }
            },

            removeOptional: function() {
                this.isSelected = true;
                this.$el.fadeTo('fast',1);
            },

            calculateAttribute: function() {

                this.attributes = {};
                this.modelAttributes = {};
                var refAttributes = {};
                var self = this;

                //should filter non number attributes
                _.each(this.model.get('attributes'), function(attribute, test) {
                    self.modelAttributes[attribute.name] = attribute.value;
                });

                //instead of getting everything again and again, could get a reference from the view.
                if(this.isSubstitute) {
                    _.each(this.reference.get('attributes'), function(attribute) {
                        refAttributes[attribute.name] = attribute.value;
                    });
                }
                _.each(this.collection.models, function(calculation) {
                    var attributeName = calculation.getAttributeName();
                    self.attributes[attributeName] = self.modelAttributes[attributeName] || 0;
                    if(self.isSubstitute) {
                        self.attributes[attributeName] -= refAttributes[attributeName] || 0;
                    }
                });

            }
        });

        return ConfiguratorPartView;
    });

