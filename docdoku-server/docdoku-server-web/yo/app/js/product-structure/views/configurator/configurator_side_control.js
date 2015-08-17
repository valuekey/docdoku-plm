/*global define,App*/
define(
    [
        'backbone',
        'mustache',
        'text!templates/configurator/configurator_side_control.html',
        'views/configurator/configurator_attribute_item',
        'text!common-objects/templates/path/path.html',
        'text!templates/configurator/configurator_link.html'
    ], function (Backbone, Mustache, template, ConfiguratorAttributeItemView, pathTemplate,linkTemplate) {

        'use strict';

        var ConfiguratorSideControl = Backbone.View.extend({

            events: {
                'click .substitutes': 'onSubstituteClick',
                'click #create_baseline': 'create_baseline'
            },

            initialize: function() {
                this.constructor.__super__.initialize.apply(this,arguments);
                this.attributes = [];
                this.attributeViews = {};
                _.bindAll(this);
            },

            render: function() {
                this.$el.html(Mustache.render(template, {i18n: App.config.i18n}));
                this.bindDom().renderConfig();

                this.listenTo(this.model.attributes,'add',this.addAttribute);
                this.listenTo(this.model.attributes,'remove',this.removeAttribute);

                return this;
            },

            bindDom: function() {
                this.listAttributes = this.$('#control-list-attributes');
                this.listOptionals = this.$('#control-list-optionals');
                this.listSubstitutes = this.$('#control-list-substitutes');
                this.$baselineName = this.$('#inputBaselineName');
                this.$baselineDescription = this.$('#inputBaselineDescription');
                return this;
            },

            addAttribute: function(attribute) {

                var attributeView =new ConfiguratorAttributeItemView({model: attribute, item: this.model}).render();
                this.attributeViews[attribute.get('name')] = attributeView;
                this.listAttributes.append(attributeView.el);
                this.listenTo(attributeView,'onRemove',this.onRemovedView);
            },

            removeAttribute: function(attribute) {
                this.attributeViews[attribute.get('name')].remove();
                delete this.attributeViews[attribute.get('name')];
            },

            onRemovedView: function(attribute) {
                this.model.unset(attribute);
            },

            remove: function() {
                _.each(this.attributeViews, function(attributeView) {
                    attributeView.remove();
                });
                Backbone.View.prototype.remove.apply(this,arguments);
            },

            updateOptionals: function() {
               this.updateConfigList(this.baselineTemp.optionals,this.listOptionals,this.removeOptional);
            },

            updateSubstitutes: function() {
                this.updateConfigList(this.baselineTemp.substitutes,this.listSubstitutes,this.onSubstituteClick);
            },

            updateConfigList: function(baselineList, html, onRemoveCallback) {
                var self = this;
                var list = [];
                _.each(baselineList,function(option,ref) {
                    var optional = self.model.map[option];
                    var partLinks = [];
                    optional.getPartLinks(partLinks);

                    var template = $(Mustache.render(linkTemplate, {number: optional.config_item.number}));
                    self.addPopover(template.next(), partLinks);
                    template.first().click({option: option, ref: ref},onRemoveCallback);
                    list.push(template);
                });
                html.html(list);
            },

            renderConfig: function() {
                this.updateSubstitutes();
                this.updateOptionals();

            },

            addPopover: function(node,partLinks) {
                var popoverTemplate = $(Mustache.render(pathTemplate, {
                    i18n: App.config.i18n,
                    partLinks:partLinks
                }));
                popoverTemplate.find('i.fa-long-arrow-right').last().remove();
                node.popover({
                    title: '<b> Links </b>',
                    html: true,
                    content: popoverTemplate,
                    trigger: 'manual',
                    placement: 'left',
                    container: '#configurator_container',
                }).click(function (e) {
                    node.popover('show');
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            },

            onSubstituteClick: function(e) {
                var pathRef = e.data.ref;
                var pathSub = this.baselineTemp.substitutes[pathRef];
                this.model.undoSubstitute(pathRef,pathSub);
                delete this.baselineTemp.substitutes[pathRef];
                this.trigger('substitutes:update');

            },

            removeOptional: function(e) {
                this.model.map[e.data.option].unsetOptional();
                this.baselineTemp.optionals.splice(_.indexOf(this.baselineTemp.optionals, e.data.option));
                this.trigger('optionals:update');
            },

            create_baseline: function() {
                var url = App.config.contextPath + '/api/workspaces/' + App.config.workspaceId + '/products';
                var data = {
                    baselinedParts: [],
                    description: this.$baselineDescription.val(),
                    name: this.$baselineName.val(),
                    optionalUsageLinks: this.baselineTemp.optionals,
                    substituteLinks: _.values(this.baselineTemp.substitutes),
                    type: App.config.configSpec.toUpperCase()
                };
                // TODO kelto: use better callbacks
                var self = this;
                $.ajax({
                    type: 'POST',
                    url: url + '/' + App.config.productId + '/baselines',
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    success: self.onBaselineCreated,
                    error: self.onBaselineCreationError
                });
            },

            onBaselineCreated: function() {
                this.trigger('baseline:create','success','Baseline Created');
                this.$baselineName.val('');
                this.$baselineDescription.val('');
            },

            onBaselineCreationError: function(err) {
                this.trigger('baseline:create','error',err.responseText);
            }
        });

        return ConfiguratorSideControl;
    });
