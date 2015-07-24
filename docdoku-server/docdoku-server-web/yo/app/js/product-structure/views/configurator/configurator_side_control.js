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
                this.bindDom();
                this.addAttribute({name: 'attribute-1', value: '20'});
                this.addAttribute({name: 'attribute-2', value: '50'});
                this.addAttribute({name: 'attribute-3', value: '0.5'});
                return this;
            },

            bindDom: function() {
                this.listAttributes = this.$('#control-list-attributes');
            },

            addAttribute: function(attribute) {
                //useful to store it ?
                this.attributes.push(attribute);
                var attributeView = new ConfiguratorAttributeItemView({model: attribute}).render();
                this.attributeViews[attribute.name] = attributeView;
                this.listAttributes.append(attributeView.$el);
                this.listenTo(attributeView,'remove',this.onRemovedView);
            },

            updateAttribute: function (attribute) {
                var view = this.attributeViews[attribute.name];
                if(view) {
                    view.updateValue(attribute.value);
                }
            },

            onRemovedView: function(attribute) {
                this.trigger('attribute:remove',attribute);
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
