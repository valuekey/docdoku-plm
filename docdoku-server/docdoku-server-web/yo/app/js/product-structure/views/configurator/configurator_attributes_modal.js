/*global _,define,App,$*/
define([
    'backbone',
    'mustache',
    'text!templates/configurator/configurator_attributes_modal.html'
], function (Backbone, Mustache, template) {

    'use strict';

    var ConfiguratorAttributesModal = Backbone.View.extend({

        events: {
            'hidden #configurator_attributes_modal': 'onHidden'
        },

        initialize: function () {
            this.constructor.__super__.initialize.apply(this,arguments);
            _.bindAll(this);
        },

        render: function () {
            this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
            this.bindDOM();
            return this;
        },

        bindDOM: function() {
            this.modal = this.$modal= this.$('#configurator_attributes_modal');
            return this;
        },

        onHidden: function() {
            this.remove();
        },

        openModal: function() {
            this.modal.modal('show');
        },

        closeModal: function() {
            this.modal.modal('hide');
        }
    });

    return ConfiguratorAttributesModal;

});
