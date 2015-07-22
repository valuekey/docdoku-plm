/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_part.html'
    ], function (Backbone, Mustache, template) {

        'use strict';

        var ConfiguratorPartView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));

                return this;
            }
        });

        return ConfiguratorPartView;
    });

