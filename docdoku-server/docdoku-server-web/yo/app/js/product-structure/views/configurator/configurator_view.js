/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator.html',
        'views/configurator/configurator_header_view',
        'views/configurator/configurator_content_view',
        'views/configurator/configurator_side_control'
    ], function (Backbone, Mustache, template, ConfiguratorHeaderView, ConfiguratorContentView, ConfiguratorSideControl) {

        'use strict';

        var ConfiguratorView = Backbone.View.extend({

            render: function() {
                this.$el.html(Mustache.render(template, {model: this.model, i18n: App.config.i18n}));
                this.bindDOM().renderHeader().renderContent().renderSideControl();

                return this;
            },

            bindDOM: function() {
                this.partContainer = this.$('#part_container');
                this.sideControl = this.$('#configurator-side-control');
                return this;
            },

            renderHeader: function() {
                this.configuratorHeader = new ConfiguratorHeaderView().render();
                return this;
            },

            renderContent: function() {
                this.configuratorContent = new ConfiguratorContentView({el: this.partContainer}).render();
                this.listenTo(this.configuratorHeader,'attribute:add',this.configuratorContent.addAttribute);
                return this;
            },

            renderSideControl: function() {
                this.sideControlView = new ConfiguratorSideControl({el: this.sideControl}).render();
                //this.listenTo(this.sideControlView,'attribute:remove',this.removeAttribute);
                return this;
            },

            updateContent: function(part) {
                this.configuratorContent.displayPart(part);
            }
        });

        return ConfiguratorView;
    });
