/*global _,define,App,$*/
define([
    'backbone',
    'mustache',
    'text!common-objects/templates/udf/user_defined_function.html',
    'common-objects/collections/configuration_items',
    'common-objects/collections/baselines',
    'common-objects/views/udf/calculation',
    'common-objects/models/calculation'
], function (Backbone, Mustache, template,ConfigurationItemCollection,Baselines, CalculationView, Calculation) {

    'use strict';

    var UserDefinedFunctionView = Backbone.View.extend({

        events: {
            'hidden #user_defined_function_modal': 'onHidden',
            'submit #user_defined_function_form':'run',
            'change .user-defined-product-select':'fetchValues',
            'change .user-defined-type-select':'fetchValues',
            'click .add-calculation':'addCalculation'
        },

        initialize: function () {
            this.configurator = this.options.configurator ? this.options.configurator : false;
            _.bindAll(this);
            this.calculationViews = [];
            if(!this.collection) {
                var Calculations = Backbone.Collection.extend({
                    model: Calculation
                });
                this.collection = new Calculations();
            }

        },

        render: function () {

            this.$el.html(Mustache.render(template, {i18n: App.config.i18n, configurator: this.configurator}));
            this.$modal= this.$('#user_defined_function_modal');
            this.$productList = this.$('.user-defined-product-select');
            this.$typeList = this.$('.user-defined-type-select');
            this.$valueList = this.$('.user-defined-value-select');
            this.$runButton = this.$('.run-udf');
            this.$calculations = this.$('.calculations');

            return this;
        },

        setBaselineMode:function(){
            this.$typeList.val('baseline');
        },

        fetchProducts: function () {
            var productList = this.$productList;
            var typeList = this.$typeList;
            var _this = this;

            typeList.append('<option value="latest">'+App.config.i18n.LATEST_SHORT+'</option>');
            typeList.append('<option value="baseline">'+App.config.i18n.BASELINE+'</option>');

            new ConfigurationItemCollection().fetch({success:function(products){
                products.each(function(product){
                    productList.append('<option value="'+product.getId()+'">'+product.getId()+'</option>');
                });
                _this.fetchValues();
                _this.fetchAttributes();
            }});

            return this;
        },

        fetchValues: function () {
            var productId = this.$productList.val();
            var typeId = this.$typeList.val();
            var valueList = this.$valueList;
            valueList.empty();

            if (productId) {
                if (typeId === 'latest') {
                    valueList.append('<option value="wip">'+App.config.i18n.HEAD_WIP+'</option>');
                    valueList.append('<option value="latest">'+App.config.i18n.HEAD_CHECKIN+'</option>');
                    valueList.append('<option value="latest-released">'+App.config.i18n.HEAD_RELEASED+'</option>');

                } else if (typeId === 'baseline') {
                    new Baselines({},{type:'product',productId:productId}).fetch({success:function(baselines) {
                        baselines.each(function(baseline){
                            valueList.append('<option value="'+baseline.getId()+'">'+baseline.getName()+'</option>');
                        });
                    }});

                }
            }
            return this;
        },

        fetchAttributes:function(){
            this.availableAttributes = [];
            var self = this;
            $.ajax({
                url: App.config.contextPath + '/api/workspaces/' + App.config.workspaceId + '/attributes/part-iterations',
                success: function (attributes) {
                    _.each(attributes,function(attribute){
                        if(attribute.type === 'NUMBER'){
                            self.availableAttributes.push(attribute.name);
                        }
                    });
                    self.displayCalculations();
                }
            });
        },

        displayCalculations: function() {
            var self = this;
            _.each(this.collection.models,function(calculation) {
                self.createCalculationView(calculation);
            });
            return this;
        },

        createCalculationView:function(calculation){
            var _this = this;
            var calculationView = new CalculationView({attributeNames:this.availableAttributes, model: calculation}).render();
            this.$calculations.append(calculationView.$el);
            this.calculationViews.push(calculationView);

            calculationView.on('removed',function(calc){

                _this.calculationViews.splice(_this.calculationViews.indexOf(calculationView),1);

                if(!_this.calculationViews.length){
                    _this.$runButton.hide();
                }
                _this.collection.remove(calc.cid);
            });

            this.$runButton.show();

        },

        addCalculation:function(){
            var calculation = new Calculation();
            this.collection.push(calculation);
            this.createCalculationView(calculation);
        },

        openModal: function () {
            this.$modal.modal('show');
        },

        closeModal: function () {
            this.$modal.modal('hide');
        },

        onHidden: function () {
            this.remove();
        },

        run: function(e){

            var productId = this.$productList.val() || App.config.productId;
            var valueId = this.$valueList.val() || App.config.configSpec;
            var runButton = this.$runButton;

            runButton.html(App.config.i18n.LOADING +' ...').prop('disabled',true);

            //TODO kelto: should not have to reload it from the configurator, since it already exist
            // pass it as a parameter.
            var PartCollection = Backbone.Collection.extend({
                url: function () {
                    return this.urlBase() + '/filter?configSpec=' + valueId + '&depth=10&path=-1';
                },

                urlBase: function () {
                    return App.config.contextPath + '/api/workspaces/' + App.config.workspaceId + '/products/' + productId;
                }
            });

            new PartCollection().fetch({
                success:this.doUDF.bind(this)
            });

            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        doUDF:function(pRootComponent){

            var calculationViews = this.calculationViews;
            var calculations = this.collection;

            var compute = function(node) {
                _.each(calculations.models,function(calculation) {
                    var attribute = node.attrs[calculation.getAttributeName()];
                    if(attribute !== undefined) {
                        calculation.add(attribute);
                        if(node.components.length){
                            calculation.incVisitedAssemblies();
                        }else{
                            calculation.incVisitedInstances();
                        }
                    }
                });
            };

            var visit = function(rootComponent){

                rootComponent.attrs = {};

                _.each(rootComponent.attributes,function(attr){
                    if(attr.type === 'NUMBER'){
                        rootComponent.attrs[attr.name] = parseFloat(attr.value);
                    }
                });

                for(var i = 0 ; i < rootComponent.amount ; i++) {
                    compute(rootComponent);
                    _.each(rootComponent.components,visit);
                }

            };

            visit(pRootComponent.first().attributes);

            _.each(calculationViews,function(view){
                view.onEnd();
            });

            this.$runButton.html(App.config.i18n.RUN).prop('disabled',false);
        }

    });

    return UserDefinedFunctionView;

});
