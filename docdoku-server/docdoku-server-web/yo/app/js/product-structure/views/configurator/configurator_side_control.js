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

            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.attributes = [];
                this.attributeViews = {};
            },

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                this.bindDom().initAttributeViews();
                this.listenTo(this.collection,'add',this.addCalculation);
                this.listenTo(this.collection,'remove',this.removeCalculation);
                return this;
            },

            bindDom: function() {
                this.listAttributes = this.$('#control-list-attributes');
                return this;
            },

            initAttributeViews: function() {
                _.each(this.collection.models, function(calculation) {
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
                this.collection.remove(attribute.cid);
                //might have to remove the view from the attribute
            },

            remove: function() {
                _.each(this.attributeViews, function(attributeView) {
                    attributeView.remove();
                });
                Backbone.View.prototype.remove.apply(this,arguments);
            }
        });

        return ConfiguratorSideControl;
    });
