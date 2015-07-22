/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_side_control.html'
    ], function (Backbone, Mustache, template) {

        'use strict';

        var ConfiguratorSideControl = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                return this;
            }
        });

        return ConfiguratorSideControl;
    });
