/*global _,define,App*/
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
                this.substitutes = [];
                _.bindAll(this);
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
                var self = this;
                this.partReferenceModel = part;
                this.clear();
                this.substituteOfPart(part);
                this.resetReference(part);

                _.each(this.substitutes,function(substitute){
                    self.addSubstitute(substitute,part);
                });

            },

            clear: function() {
                _.each(this.partSubstitutesView, function(substituteView) {
                    substituteView.remove();
                });
                this.partSubstitutesView.length = 0;
                this.substitutes.length = 0;
                if(this.referencePartView) {
                    this.referencePartView.remove();
                }
            },

            // TODO kelto: substitute should come from the webservice.
            substituteOfPart: function(part) {
                if(this.substitutes.length) {
                    return;
                }
                var self = this;
                var substitutes = part.substituteIds;
                if(substitutes) {
                    var search = function(pPart) {
                        if(substitutes.indexOf(pPart.partUsageLinkId) !== -1) {
                            self.substitutes.push(pPart);
                        }
                        _.each(pPart.components,function(pComp) {
                            search(pComp);
                        });
                    };

                    _.each(this.collection.models[0].get('components'), function(comp) {
                        search(comp);
                    });
                }
            },

            resetReference: function(reference) {
                var configItem;
                var path = this.baselineTemp.substitutes[reference.path];
                if(path) {
                    configItem = this.model.map[path];
                    var index = this.indexOfComponent(this.substitutes, configItem.config_item);
                    this.substitutes.splice(index,1);
                    this.substitutes.push(reference);
                } else {
                    configItem = this.model.map[reference.path];
                }
                var isSelected = _.indexOf(this.baselineTemp.optionals, configItem.config_item.path) === -1;
                this.referencePartView = new ConfiguratorPartView({model: configItem,collection: this.baselineTemp.calculations, isSubstitute: false, isSelected: isSelected});
                this.referencePartView.render();
                this.referencePartView.setReference();
                this.partReference.html(this.referencePartView.$el);
                this.listenTo(this.referencePartView,'part-view:optionalToggle',this.referenceClicked);
            },

            addSubstitute: function(substitute, reference) {
                var configItem = this.model.map[reference.path].getSubstitute(substitute);
                var substituteView = new ConfiguratorPartView({model: configItem, collection: this.baselineTemp.calculations, isSubstitute: true});
                substituteView.render();
                this.partSubstitutesView.push(substituteView);
                this.partSubstitutes.append(substituteView.$el);
                this.listenTo(substituteView,'part-view:substituteToggle',this.substituteClick);
                substituteView.setSubstitute();
            },

            swapReference: function(substitute,oldSelected) {
                //should remove the optional if done.


            },

            indexOfComponent: function(array,component) {
                var index = -1;
                _.some(array, function(item,i) {
                    if(item.path === component.path) {
                        index = i;
                        return true;
                    }
                    return false;
                });

                return index;
            },

            referenceClicked: function(referenceView) {
                if(referenceView.isSelected) {
                    this.baselineTemp.optionals.push(referenceView.model.config_item.path);
                } else {
                    var index = this.indexOfComponent(this.baselineTemp.optionals,referenceView.model.config_item);
                    index = _.indexOf(this.baselineTemp.optionals,referenceView.model.config_item.path);
                    this.baselineTemp.optionals.splice(index,1);
                }
                this.trigger('optionals:update');
            },

            substituteClick: function(view) {
                this.removeOptional();
                this.referencePartView.model.swap(view.model,this.referencePartView.model);
                if(view.model.config_item.substitute) {
                    this.baselineTemp.substitutes[this.partReferenceModel.path] = view.model.config_item.path;
                } else {
                    delete this.baselineTemp.substitutes[view.model.config_item.path];
                }

                this.trigger('substitutes:update');
            },

            removeOptional: function() {
                var index = _.indexOf(this.baselineTemp.optionals, this.referencePartView.model.config_item.path);
                if(index > -1) {
                    this.baselineTemp.optionals.splice(index,1);
                }
            }

        });

        return ConfiguratorContentView;
    });
