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
            },

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                this.bindDom().initAttributeViews();
                this.listenTo(this.baselineTemp.calculations,'add',this.addCalculation);
                this.listenTo(this.baselineTemp.calculations,'remove',this.removeCalculation);

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

            addCalculation: function(calculation) {
                //useful to store it ?
                this.attributes.push(calculation);
                var attributeView = new ConfiguratorAttributeItemView({model: calculation}).render();
                this.attributeViews[calculation.cid] = attributeView;
                this.listAttributes.append(attributeView.$el);
                this.listenTo(attributeView,'remove',this.onRemovedView);
            },
            removeCalculation: function(calculation) {
                this.attributeViews[calculation.cid].remove();
            },

            updateAttribute: function (attribute) {
                var view = this.attributeViews[attribute.name];
                if(view) {
                    view.updateValue(attribute.value);
                }
            },

            onRemovedView: function(attribute) {
                this.baselineTemp.calculations.remove(attribute.cid);
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
                    self.listOptionals.append('<li>'+option.get('number')+'</li>');
                });
                _.each(this.baselineTemp.substitutes,function(option, second) {
                    self.listSubstitutes.append('<li class="substitutes"><i>'+second+'</i> > '+option.get('number')+'</li>');
                });
            },

            onSubstituteClick: function(e) {
                delete this.baselineTemp.substitutes[$(e.target).find('i').text()];
                this.trigger('substitutes:update');
            }
        });

        return ConfiguratorSideControl;
    });
