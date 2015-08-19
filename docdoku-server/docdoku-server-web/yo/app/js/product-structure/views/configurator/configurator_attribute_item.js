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
                var self = this;
                var name = this.model.get('name');
                var ref = this.item.reference.getValue(name);
                var listHtml = [];
                _.each(this.model.get('operators'), function(operator) {
                    var html = $('<div></div>');

                    var result = self.item.getResult(operator,name);
                    html.append(operator + ': ' + result);
                    if(self.options.displayRef) {
                        html.append(self.renderDifference(result, self.item.reference.getResult(operator,name)));
                    }
                    listHtml.push(html);
                });
                this.attributeValues.html(listHtml);
            },

            renderDifference: function(result, referenceResult) {
                var difference = result - referenceResult;
                var signClassName = difference >= 0 ? 'positive-difference' : 'negative-difference';
                return '<span class="'+signClassName+'"> (<span class="difference">'+Math.abs(difference).toFixed(2)+'</span>)</span>';
            },

            onRemove: function() {
                this.item.unset(this.model.get('name'));
            },

            //TODO kelto: usefull to override ?
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
