/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator.html',
        'views/configurator/configurator_header_view',
        'views/configurator/configurator_content_view',
        'views/configurator/configurator_side_control',
        'common-objects/models/calculation',
        'models/component_module'
    ], function (Backbone, Mustache, template, ConfiguratorHeaderView, ConfiguratorContentView, ConfiguratorSideControl, Calculation,ComponentModule) {

        'use strict';

        var ConfiguratorView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                var Calculations = Backbone.Collection.extend({
                    model: Calculation
                });
                this.calculations = new Calculations();
                var Special = ComponentModule.Collection.extend({
                    url: function () {
                        var path = this.path;

                        var url = this.urlBase() + '/filter?configSpec=' + App.config.configSpec + '&depth=1';

                        if (path) {
                            url += '&path=' + path;
                        }

                        if (App.config.linkType) {
                            url += '&linkType=' + App.config.linkType;
                        }

                        url += '&diverge=true';


                        return url;
                    }
                });
                this.collection = new Special([], { isRoot: true });
                this.collection.fetch({reset: true});
                this.bindDOM()
                    .renderHeader()
                    .renderContent({collection: this.collection})
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
                this.configuratorContent = new ConfiguratorContentView({el: this.partContainer,collection: this.collection});
                this.configuratorContent.calculations = this.calculations;
                this.configuratorContent.render();
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
