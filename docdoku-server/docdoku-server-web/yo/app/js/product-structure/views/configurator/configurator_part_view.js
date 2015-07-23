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
            },

            setSubstitute: function() {
                //this.$('.well').css('display','inline-block');
                this.$('.well').css('margin-left','0').css('width','100%');
                this.$el.css('display','inline-block');
                this.$el.css('margin-left','50px');
                this.$el.css('width','20%');

            }
        });

        return ConfiguratorPartView;
    });

