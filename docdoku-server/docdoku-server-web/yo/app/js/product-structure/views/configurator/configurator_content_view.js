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
                this.partReferenceModel = part;
                this.clear();
                this.substituteOfPart(part);
                this.referencePartView = new ConfiguratorPartView({model: part,collection: this.baselineTemp.calculations}).render();
                this.referencePartView.setReference();
                this.partReference.html(this.referencePartView.$el);
                this.listenTo(this.referencePartView,'part-view:click',this.referenceClicked);
                var substitutes = part.getSubstituteIds();
                var self = this;
                _.each(this.substitutes,function(substitute){
                    var substituteView = new ConfiguratorPartView({model: substitute, collection: self.baselineTemp.calculations}).render();
                    self.partSubstitutesView.push(substituteView);
                    self.partSubstitutes.append(substituteView.$el);
                    self.listenTo(substituteView,'part-view:click',self.substituteClick);
                    substituteView.setSubstitute(part);
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
                var self = this;
                var substitutes = part.getSubstituteIds();
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
                debugger;
            },

            swapReference: function(substitute,oldSelected) {
                //should remove the optional if done.
                this.baselineTemp.parts.add(substitute);
                this.baselineTemp.parts.remove(oldSelected);

            },

            referenceClicked: function(referenceView) {
                if(referenceView.isSelected) {
                    this.baselineTemp.parts.remove(referenceView.model);
                    this.baselineTemp.optionals.push(referenceView.model);
                } else {
                    this.baselineTemp.parts.add(referenceView.model);
                    this.baselineTemp.optionals.splice(this.baselineTemp.optionals.indexOf(referenceView.model));
                }
            },

            substituteClick: function(view) {
                var oldSubstitute = this.baselineTemp.substitutes[this.partReference.get('path')] || this.partReferenceModel;
                if(view.model.get('path') === this.partReferenceModel.get('path')) {
                    delete this.baselineTemp.substitutes[view.model.get('path')];
                } else {
                    this.baselineTemp.substitutes[this.partReferenceModel.get('path')] = view.model;
                }
                this.swapReference(view.model,oldSubstitute);
                this.referencePartView.toggleClass();
                view.toggleClass();
                debugger;
                view.$el.remove();
                this.partReference.html(view.$el);
                this.partSubstitutes.append(this.referencePartView.$el);
                view.delegateEvents();
                this.referencePartView.delegateEvents();
            }

        });

        return ConfiguratorContentView;
    });
