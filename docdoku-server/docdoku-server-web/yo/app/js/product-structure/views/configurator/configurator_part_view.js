/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_part.html',
        'views/configurator/configurator_attribute_item'
    ], function (Backbone, Mustache, template, AttributeItem) {

        'use strict';

        var ConfiguratorPartView = Backbone.View.extend({

            className: 'configurator-part',
            events: {
                'click': 'onClick'
            },
            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.isSubstitute = this.options.isSubstitute;
                this.isSelected = this.options.isSelected === undefined ? true : this.options.isSelected;
                _.bindAll(this);
            },

            render: function() {
                //TODO kelto: is selected should not be set to true. Get it this info from the model
                this.$el.html(Mustache.render(template, {model: this.model.config_item, i18n: App.config.i18n}));
                this.bindDom().bindEvents().activateOptional().renderAttributes().activateTooltip();

                return this;
            },

            bindDom: function() {
                this.partListAttributes = this.$('#part-attributes-list');
                return this;
            },

            bindEvents: function() {

                this.listenTo(this.model.model,'change',this.renderAttributes);
                this.listenTo(this.model.attributes,'add',this.renderAttributes);
                this.listenTo(this.model.attributes,'remove',this.renderAttributes);
                return this;
            },

            activateTooltip: function() {
                this.$('[data-toggle="tooltip"]').tooltip();
                return this;
            },

            activateOptional: function() {
                this.$el.toggleClass('configurator_fade',!this.isSelected);

                return this;
            },

            setSubstitute: function() {
                this.isSubstitute = true;
                this.$el.toggleClass('inactive',true);

                return this;
            },

            //TODO kelto:should called this only on creation and use a add function to be bound to the attributes:add event
            renderAttributes: function() {
                //this.partListAttributes.empty();
                var self = this;
                var listElement = [];
                this.model.attributes.each(function(attribute) {
                    var attributeView = new AttributeItem({model: attribute,item: self.model, displayRef: true}).render();
                    listElement.push(attributeView.el);
                });
                _.each(this.model.attributes.models,function(attribute) {

                    /*
                    var name = attribute.get('name');
                    var html = '<li>'+name+' : '+ self.model.model.get(name);
                    if(self.model.reference) {
                        var diff = self.model.model.get(name) - self.model.reference.model.get(name);
                        html+= '<span style="color: ';
                        if(diff < 0) {
                            html += 'red"> ( '+diff;
                        } else {
                            html += 'green"> ( + '+diff;
                        }
                        html += ' ) </span>';
                    }

                    html+= '</li>';
                    listElement.push(html);
                    */
                });
                if(listElement.length) {
                    this.partListAttributes.html(listElement);
                } else {
                    this.partListAttributes.html('<div>No calculation available</div>');
                }
                return this;
            },

            toggleClass: function() {
                this.$el.toggleClass('inactive',500);
            },

            //TODO kelto: set Reference and set Substitute can be refactored
            setReference: function() {
                // TODO kelto: isSubstitute should be passed in the constructor and used for the constructor.
                this.isSubstitute = false;
                var self = this;
                //TODO kelto: no need for an extra class ! substitute are separate from ref by a div container
                this.$el.toggleClass('inactive',false);

            },

            onClick: function(e) {
                if(!this.isSubstitute && this.model.config_item.optional) {
                    this.trigger('part-view:optionalToggle',this);
                } else {
                    this.trigger('part-view:substituteToggle',this);
                }
            },

            removeOptional: function() {
                this.isSelected = true;
                this.$el.fadeTo('fast',1);
            }
        });

        return ConfiguratorPartView;
    });

