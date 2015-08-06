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
        'models/component_module',
        'common-objects/models/configurator_item'
    ], function (Backbone, Mustache, template, ConfiguratorHeaderView, ConfiguratorContentView, ConfiguratorSideControl, Calculation,ComponentModule, ConfiguratorItem) {

        'use strict';

        var ConfiguratorView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                var Calculations = Backbone.Collection.extend({
                    model: Calculation,

                    updateCalculations: function(attributes, updateNumber) {
                        _.each(this.models, function(calculation) {
                            var diff = attributes[calculation.getAttributeName()] || 0;
                            calculation.update(diff,updateNumber);
                        });
                    }
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
                debugger;
                this.collection.fetch({reset: true});

                // The collection of the baseline, this is dynamic.
                this.baselineTempCollection = new BaselineCollection([], { isRoot: true });
                var self = this;
                this.baselineTempCollection.fetch({reset: true}).success(function() {
                    self.configItem = new ConfiguratorItem({
                        config_item:self.baselineTempCollection.first().attributes,
                    map: {},
                        attributes:[],
                        parent:null
                }).construct();
                    //TODO kelto: should have an array of baselineTemp.
                    self.baselineTemp = {
                        parts: self.baselineTempCollection,
                        substitutes: {},
                        optionals: [],
                        calculations: self.calculations
                    };
                    self.bindDOM()
                        .renderHeader()
                        .renderContent()
                        .renderSideControl();
                    self.trigger('rendered');

                });
                return this;

            },

            bindDOM: function() {
                this.partContainer = this.$('#part_container');
                this.sideControl = this.$('#configurator-side-control');
                return this;
            },

            renderHeader: function() {
                this.configuratorHeader = new ConfiguratorHeaderView({model: this.configItem});
                this.configuratorHeader.baselineTemp = this.baselineTemp;
                this.configuratorHeader.render();
                return this;
            },

            renderContent: function() {
                this.configuratorContent = new ConfiguratorContentView({el: this.partContainer,collection: this.collection, model: this.configItem});
                this.configuratorContent.baselineTemp = this.baselineTemp;
                this.configuratorContent.render();
                this.listenTo(this.configuratorContent,'optionals:update',this.updateOptionals);
                this.listenTo(this.configuratorContent,'substitutes:update',this.updateSubstitutes);
                return this;
            },

            renderSideControl: function() {
                this.sideControlView = new ConfiguratorSideControl({el: this.sideControl, model: this.configItem});
                this.sideControlView.baselineTemp = this.baselineTemp;
                this.sideControlView.render();
                return this;
            },

            updateContent: function(part) {
                // TODO kelto: this function should be called only when the configurator is ready
                if(this.configItem) {
                    this.configuratorContent.displayPart(part);
                }
            },

            updateSubstitutes: function() {
                this.sideControlView.updateSubstitutes();
            },

            updateOptionals: function() {
                this.sideControlView.updateOptionals();
            }
        });

        return ConfiguratorView;
    });
