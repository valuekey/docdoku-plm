/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_attribute_item.html',
    ], function (Backbone, Mustache, template) {

        'use strict';

        //TODO kelto: should rename to match calculation
        var ConfiguratorAttributeItem = Backbone.View.extend({

            tagName: 'li',

            events: {
                'click .attribute-remove': 'onRemove'
            },

            render: function () {
                //TODO kelto: bind values change to updateValue
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n, model: this.model}));
                this.bindDOM();
                return this;
            },

            bindDOM: function () {
                this.attributeValue = this.$('.attribute-value');
                this.attributeName = this.$('.attribute-name');
                return this;
            },

            updateValue: function (value) {
                // TODO kelto: this method is called on each operation
                // should only be called at the end

                this.attributeValue.text(value);
            },


            onRemove: function() {
                this.trigger('onRemove',this.model.name);
            },

            remove: function() {
                this.trigger('remove',this.model);
                Backbone.View.prototype.remove.apply(this,arguments);
                //Trigger a remove event to notify the Parent then unbind.
                this.unbind();
                return this;
            }
        });

        return ConfiguratorAttributeItem;
    });
