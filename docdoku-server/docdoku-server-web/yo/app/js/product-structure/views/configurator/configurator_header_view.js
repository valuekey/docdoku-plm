/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/blocker.html'
    ], function (Backbone, Mustache, template) {

        'use strict';

        var ConfiguratorHeaderView = Backbone.View.extend({

            events: {
                'click #addAttribute': 'addAttribute',
                'click .removeAttribute': 'removeAttribute'
            },

            initialize: function() {
                this.attributes = [];
            },
            render: function() {
                this.$el.append(Mustache.render(template, {i18n: App.config.i18n}));
                return this;
            },

            addAttribute: function(attribute) {
                if(this.attributes.indexOf(attribute) === -1) {
                    this.attributes.push(attribute);
                    this.trigger('attributes:change');
                }
            },

            removeAttribute: function(attribute) {
                var index = -1;
                if((index = this.attributes.indexOf(attribute)) !== -1) {
                    this.attributes.splice(index,1);
                    this.trigger('attributes:change');
                }
            }
        });

        return ConfiguratorHeaderView;
    });
