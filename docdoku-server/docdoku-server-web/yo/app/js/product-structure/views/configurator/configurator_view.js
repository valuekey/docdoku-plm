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
                //TODO kelto: just for prototype should move that.
                var FullCollection = ComponentModule.Collection.extend({
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
                //TODO kelto: just for prototype should move that.
                var BaselineCollection = ComponentModule.Collection.extend({
                    url: function () {
                        var path = this.path;

                        var url = this.urlBase() + '/filter?configSpec=' + App.config.configSpec + '&depth=1';

                        if (path) {
                            url += '&path=' + path;
                        }

                        if (App.config.linkType) {
                            url += '&linkType=' + App.config.linkType;
                        }

                        url += '&diverge=false';


                        return url;
                    }
                });
                //this is the collection of the configurator, to display the substitutes
                // Should not be touched only for display
                this.collection = new FullCollection([], { isRoot: true });
                this.collection.fetch({reset: true});
                // The collection of the baseline, this is dynamic.
                var baselineTempCollection = new BaselineCollection([], { isRoot: true });
                baselineTempCollection.fetch();
                //TODO kelto: should have an array of baselineTemp.
                this.baselineTemp = {
                    parts: baselineTempCollection,
                    substitutes: [],
                    optionals: [],
                    calculations: this.calculations};
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
                this.configuratorHeader = new ConfiguratorHeaderView({collection: this.calculations});
                this.configuratorHeader.baselineTemp = this.baselineTemp;
                this.configuratorHeader.render();
                return this;
            },

            renderContent: function() {
                this.configuratorContent = new ConfiguratorContentView({el: this.partContainer,collection: this.collection});
                this.configuratorContent.calculations = this.calculations;
                this.configuratorContent.baselineTemp = this.baselineTemp;
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
