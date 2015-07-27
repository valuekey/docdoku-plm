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
                'click .attribute-remove': 'remove'
            },

            render: function () {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n, calculation: this.model}));
                this.bindDOM().bindEvents();
                return this;
            },

            bindDOM: function () {
                this.attributeValue = this.$('.attribute-value');
                this.attributeName = this.$('.attribute-name');
                return this;
            },

            updateValue: function (calculation) {
                // TODO kelto: this method is called on each operation
                // should only be called at the end
                this.attributeValue.text(calculation.getFinalResult());
            },

            updateName: function(calculation) {
                this.attributeName.text(calculation.getAttributeName());
            },

            bindEvents: function() {
                this.listenTo(this.model,'change:attributeName',this.updateName);
                this.listenTo(this.model,'change:result',this.updateValue);
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
