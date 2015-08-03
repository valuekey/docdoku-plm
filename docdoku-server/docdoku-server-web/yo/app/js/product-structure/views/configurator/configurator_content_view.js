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
                this.resetReference(part);
                var substitutes = part.getSubstituteIds();
                var self = this;
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
            },

            resetReference: function(reference) {
                this.referencePartView = new ConfiguratorPartView({model: reference,collection: this.baselineTemp.calculations, isSubstitute: false}).render();
                this.referencePartView.setReference();
                this.partReference.html(this.referencePartView.$el);
                this.listenTo(this.referencePartView,'part-view:optionalToggle',this.referenceClicked);
            },

            addSubstitute: function(substitute, reference) {
                var substituteView = new ConfiguratorPartView({model: substitute, collection: this.baselineTemp.calculations, isSubstitute: true}).render();
                this.partSubstitutesView.push(substituteView);
                this.partSubstitutes.append(substituteView.$el);
                this.listenTo(substituteView,'part-view:substituteToggle',this.substituteClick);
                substituteView.setSubstitute(reference);
            },

            swapReference: function(substitute,oldSelected) {
                //should remove the optional if done.
                this.baselineTemp.parts.add(substitute);
                this.baselineTemp.parts.remove(oldSelected);

            },

            referenceClicked: function(referenceView) {
                if(referenceView.isSelected) {
                    this.baselineTemp.parts.add(referenceView.model);
                    this.baselineTemp.optionals.splice(this.baselineTemp.optionals.indexOf(referenceView.model));
                    this.baselineTemp.calculations.updateCalculations(referenceView.attributes,+1);
                } else {
                    this.baselineTemp.parts.remove(referenceView.model);
                    this.baselineTemp.optionals.push(referenceView.model);
                    this.baselineTemp.calculations.updateCalculations(referenceView.attributes,-1);
                }
                this.trigger('optionals:update');
            },

            substituteClick: function(view) {
                var oldSubstitute = this.baselineTemp.substitutes[this.partReferenceModel.get('path')] || this.partReferenceModel;
                if(view.model.get('path') === this.partReferenceModel.get('path')) {
                    delete this.baselineTemp.substitutes[view.model.get('path')];
                } else {
                    this.baselineTemp.substitutes[this.partReferenceModel.get('path')] = view.model;
                }
                this.baselineTemp.calculations.updateCalculations(view.attributes);
                this.swapReference(view.model,oldSubstitute);
                this.referencePartView.toggleClass();
                view.toggleClass();
                this.removeOptional();
                var self = this;
                this.partSubstitutesView =  this.partSubstitutesView.filter(function(sub) {
                    return view.cid !== sub.cid;
                });
                _.each(this.partSubstitutesView,function(sub) {
                    sub.setSubstitute(view.model);
                });
                var newRef = view.model;
                var oldRef = this.partReferenceModel;
                this.partReferenceModel = newRef;
                view.remove();
                this.referencePartView.remove();
                this.resetReference(newRef);
                this.addSubstitute(oldRef, newRef);
                this.trigger('substitutes:update');
            },

            removeOptional: function() {
                if(this.referencePartView.isSelected)
                this.referencePartView.removeOptional();
                this.baselineTemp.calculations.updateCalculations(this.referencePartView.attributes,+1);
            }

        });

        return ConfiguratorContentView;
    });
