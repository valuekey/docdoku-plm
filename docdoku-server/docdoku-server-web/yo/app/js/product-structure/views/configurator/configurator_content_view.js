/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_content.html',
        'views/configurator/configurator_part_view'
    ], function (Backbone, Mustache, template, ConfiguratorPartView) {

        'use strict';

        var ConfiguratorContentView = Backbone.View.extend({

            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.partSubstitutesView = [];
                this.attributes = [];
            },

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                this.bindDOM();
                return this;
            },

            addAttribute: function (attribute) {
                this.attributes.push(attribute);
            },

            removeAttribute: function(attribute) {
                this.attributes = this.attributes.filter(function(attr) {
                    return attr.name !== attribute.name;
                });
            },

            bindDOM: function() {
                this.partReference = this.$('#part-reference');
                this.partSubstitutes = this.$('#part-substitutes');
            },

            displayPart: function (part) {
                this.clearSubstitutes();
                this.referencePartView = new ConfiguratorPartView({model: part}).render();
                this.partReference.html(this.referencePartView.$el);
                var substitutes = part.getSubstituteIds();
                var self = this;
                _.each(substitutes,function(substitute){
                    var substituteView = new ConfiguratorPartView({model: substitute}).render();
                    self.partSubstitutesView.push(substituteView);
                    self.partSubstitutes.append(substituteView.$el);
                    substituteView.setSubstitute();
                });

            },

            clearSubstitutes: function() {
                _.each(this.partSubstitutesView, function(substituteView) {
                    substituteView.remove();
                });
                this.partSubstitutesView.length = 0;
            }
        });

        return ConfiguratorContentView;
    });
