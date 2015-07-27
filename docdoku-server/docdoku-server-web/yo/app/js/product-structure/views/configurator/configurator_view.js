/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator.html',
        'views/configurator/configurator_header_view',
        'views/configurator/configurator_content_view',
        'views/configurator/configurator_side_control',
        'common-objects/models/calculation'
    ], function (Backbone, Mustache, template, ConfiguratorHeaderView, ConfiguratorContentView, ConfiguratorSideControl, Calculation) {

        'use strict';

        var ConfiguratorView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                var Calculations = Backbone.Collection.extend({
                    model: Calculation
                });
                this.calculations = new Calculations();
                this.bindDOM()
                    .renderHeader()
                    .renderContent()
                    .renderSideControl();

                return this;
            },

            bindDOM: function() {
                this.partContainer = this.$('#part_container');
                this.sideControl = this.$('#configurator-side-control');
                return this;
            },

            renderHeader: function() {
                this.configuratorHeader = new ConfiguratorHeaderView({collection: this.calculations}).render();
                return this;
            },

            renderContent: function() {
                this.configuratorContent = new ConfiguratorContentView({el: this.partContainer,collection: this.calculations}).render();
                return this;
            },

            renderSideControl: function() {
                this.sideControlView = new ConfiguratorSideControl({el: this.sideControl,collection: this.calculations}).render();
                return this;
            },

            updateContent: function(part) {
                this.configuratorContent.displayPart(part);
            }
        });

        return ConfiguratorView;
    });
