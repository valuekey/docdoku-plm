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

            initialize: function() {
                _.bindAll(this);
                this.item = this.options.item;
                this.listenTo(this.model,'change', this.renderValues);
                var name = this.model.get('name');
                this.listenTo(this.item.model,'change:'+name,this.renderValues);
            },

            render: function () {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n, name: this.model.get('name')}));
                this.bindDOM().renderValues();
                return this;
            },

            bindDOM: function () {
                this.attributeValues = this.$('.attribute-values');
                this.attributeName = this.$('.attribute-name');
                return this;
            },

            renderValues: function() {
                this.attributeValues.empty();
                var self = this;
                var val = this.item.model.get(this.model.get('name'));
                _.each(this.model.get('operators'), function(operator) {
                    switch (operator) {
                        case 'SUM':
                            self.attributeValues.append('<span> SUM: '+ val);
                            break;
                        case 'AVG':
                            val = val / (self.item.visitedAssemblies + self.item.visitedInstances);
                            self.attributeValues.append('<span> Average: '+ val);
                    }
                    self.attributeValues.append('</span>');
                });
            },

            updateValue: function (value) {
                // TODO kelto: this method is called on each operation
                // should only be called at the end

                //this.attributeValue.text(value);
                this.model.value = value;
                this.renderValues()
            },


            onRemove: function() {
                this.item.unset(this.model.get('name'));
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
