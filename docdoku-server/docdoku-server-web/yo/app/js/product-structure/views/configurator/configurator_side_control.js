/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_side_control.html',
        'views/configurator/configurator_attribute_item'
    ], function (Backbone, Mustache, template, ConfiguratorAttributeItemView) {

        'use strict';

        var ConfiguratorSideControl = Backbone.View.extend({

            events: {
                'click .substitutes': 'onSubstituteClick'
            },

            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.attributes = [];
                this.attributeViews = {};
                _.bindAll(this);
            },

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                this.bindDom().initAttributeViews();
                this.listenTo(this.model.model,'change',this.updateAttributesViews);
                this.listenTo(this.model.attributes,'add',this.addAttributes);
                this.listenTo(this.model.attributes,'remove',this.removeAttribute);

                return this;
            },

            bindDom: function() {
                this.listAttributes = this.$('#control-list-attributes');
                this.listOptionals = this.$('#control-list-optionals');
                this.listSubstitutes = this.$('#control-list-substitutes');
                return this;
            },


            initAttributeViews: function() {

                _.each(this.baselineTemp.calculations.models, function(calculation) {
                    var attributeView = new ConfiguratorAttributeItemView({model: calculation}).render();
                    this.attributeViews[calculation.cid] = attributeView;
                    this.listAttributes.append(attributeView.el);
                });


                return this;
            },

            updateAttributesViews: function() {
                var self = this;
                _.each(this.model.model.changedAttributes(),function(value,attribute) {
                    if(self.model.model.has(attribute,value) ) {
                        var attributeView = self.attributeViews[attribute] ||new ConfiguratorAttributeItemView({model: {name: attribute, value: value}}).render();
                        attributeView.updateValue(value);
                        self.attributeViews[attribute] = attributeView;
                        self.listAttributes.append(attributeView.el);
                        self.listenTo(attributeView,'onRemove',self.onRemovedView)
                    } else {
                        self.attributeViews[attribute].remove();
                        delete self.attributeViews[attribute]
                    }
                });

            },

            removeAttribute: function(attribute) {
                //this.attributeViews[attribute].remove();
            },

            updateAttribute: function (attribute) {
                var view = this.attributeViews[attribute.name];
                if(view) {
                    view.updateValue(attribute.value);
                }
            },

            onRemovedView: function(attribute) {
                this.model.unset(attribute);
                //this.baselineTemp.calculations.remove(attribute.cid);
                //might have to remove the view from the attribute
            },

            remove: function() {
                _.each(this.attributeViews, function(attributeView) {
                    attributeView.remove();
                });
                Backbone.View.prototype.remove.apply(this,arguments);
            },

            updateOptionals: function() {
                this.renderConfig();
            },

            updateSubstitutes: function() {
                this.renderConfig();
            },

            renderConfig: function() {
                this.listOptionals.empty();
                this.listSubstitutes.empty();
                var self = this;
                _.each(this.baselineTemp.optionals,function(option) {
                    self.listOptionals.append('<li>'+option+'</li>');
                });
                _.each(this.baselineTemp.substitutes,function(option, second) {
                    self.listSubstitutes.append('<li class="substitutes"><i>'+second+'</i> > '+option+'</li>');
                });
            },

            onSubstituteClick: function(e) {

                delete this.baselineTemp.substitutes[$(e.target).find('i').text()];
                this.trigger('substitutes:update');

            }
        });

        return ConfiguratorSideControl;
    });
