/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_attribute_item.html',
    ], function (Backbone, Mustache, template, ConfiguratorPartView) {

        'use strict';

        var ConfiguratorAttributeItem = Backbone.View.extend({

            tagName: 'li',

            events: {
                'click .attribute-remove': 'remove'
            },

            render: function () {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n, attribute: this.model}));
                this.bindDOM();
                return this;
            },

            bindDOM: function () {
                this.attributeValue = this.$('.attribute-value');
            },

            updateValue: function (value) {
                this.attributeValue.text(value);
            },

            remove: function() {
                Backbone.View.prototype.remove.apply(this,arguments);
                //Trigger a remove event to notify the Parent then unbind.
                this.trigger('remove',this.model);
                this.unbind();
            }
        });

        return ConfiguratorAttributeItem;
    });
