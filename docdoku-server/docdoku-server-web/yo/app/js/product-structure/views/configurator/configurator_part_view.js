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
                _.bindAll(this);
            },

            render: function() {
                //TODO kelto: is selected should not be set to true. Get it this info from the model
                this.isSelected = true;

                this.$el.html(Mustache.render(template, {model: this.model.getConfigItem(), i18n: App.config.i18n}));
                this.bindDom().bindEvents().renderAttributes();

                return this;
            },

            bindDom: function() {
                this.partListAttributes = this.$('#part-attributes-list');
                return this;
            },

            bindEvents: function() {
                debugger;
                this.listenTo(this.model,'change:values',this.renderAttributes);

                this.listenTo(this.model,'change:reference',this.renderAttributes);
                //this.model.setListener(this.updateContent);
                return this;
            },

            setSubstitute: function() {
                this.isSubstitute = true;
                this.$el.toggleClass('inactive',true);

                return this;
            },

            //TODO kelto: should create a view which will be removed when the calculation is destroyed.
            renderAttributes: function() {
                this.partListAttributes.empty();
                var self = this;
                _.each(this.model.getValues(),function(value, name) {
                    var html = '<li>'+name+' : '+ value;
                    if(self.model.getReference()) {
                        debugger;
                        var diff = value - self.model.getReference().getValues()[name];
                        html+= '<span style="color: ';
                        if(diff < 0) {
                            html += 'red"> ( '+diff;
                        } else {
                            html += 'green"> ( + '+diff;
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
                var self = this;
                //TODO kelto: no need for an extra class ! substitute are separate from ref by a div container
                this.$el.toggleClass('inactive',false);

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
            }
        });

        return ConfiguratorPartView;
    });

