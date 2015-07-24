/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_header.html',
        'common-objects/views/udf/user_defined_function'
    ], function (Backbone, Mustache, template, UserDefinedFunctionView) {

        'use strict';

        var ConfiguratorHeaderView = Backbone.View.extend({

            events: {
                'click .add-attribute': 'addAttribute',
                'click .remove-attribute': 'removeAttribute',
                'click .attributes-modal': 'openAttributesModal'
            },

            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.attributes = [];
                this.subViews = [];
            },
            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                return this;
            },

            bindDOM: function () {
                this.addAttributeBtn = this.$('.add-attribute');
                this.removeAttributeBtn = this.$('.remove-attribute');
            },

            addAttribute: function(attribute) {
                debugger;
                if(this.attributes.indexOf(attribute) === -1) {
                    this.attributes.push(attribute);
                    this.trigger('attributes:add',attribute);
                }
            },

            removeAttribute: function(attribute) {
                var index = -1;
                if((index = this.attributes.indexOf(attribute)) !== -1) {
                    this.attributes.splice(index,1);
                    this.trigger('attributes:change');
                }
            },

            openAttributesModal: function() {
                debugger;

                var modal = new UserDefinedFunctionView({configurator: true});
                modal.render();
                document.body.appendChild(modal.el);
                modal.openModal();
            },

            remove: function() {
                // remove all subViews and then call for the remove
                _.invoke(this.subViews, 'remove');
                Backbone.View.prototype.remove.call(this);
            }
        });

        return ConfiguratorHeaderView;
    });
