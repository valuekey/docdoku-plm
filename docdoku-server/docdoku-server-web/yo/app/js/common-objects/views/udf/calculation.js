/*global define,App,_*/
define([
    'backbone',
    'mustache',
    'text!common-objects/templates/udf/calculation.html'
],function(Backbone, Mustache, template){

    'use strict';

    var CalculationView = Backbone.View.extend({

        className:'calculation',

        events:{
            'click .remove':'onRemove',
            'change select[name=operator]': 'operatorChange',
            'change select[name=attributeName]': 'attributeNameChange'
        },

        initialise:function(){
            _.bindAll(this);
        },

        resetCalculation:function(){
            this.memo = 0;
            this.visitedAssemblies = 0;
            this.visitedInstances = 0;
            this.$memo.text('');
            this.$assembliesVisited.text('');
            this.$instancesVisited.text('');
            this.$result.hide();
            return this;
        },

        render:function(){
            this.$el.html(Mustache.render(template, {i18n: App.config.i18n, attributeNames:this.options.attributeNames}));
            this.binDOMElements().resetCalculation().initCalculation();

            return this;
        },

        initCalculation: function() {
            this.model.setOperator(this.$operator.val());
            this.model.setAttributeName(this.$attributeName.val());
            return this;
        },

        binDOMElements:function(){
            this.$operator = this.$('[name="operator"]');
            this.$attributeName = this.$('[name="attributeName"]');
            this.$result = this.$('.result');
            this.$memo = this.$('.memo');
            this.$instancesVisited = this.$('.instances-visited');
            this.$assembliesVisited = this.$('.assemblies-visited');
            return this;
        },

        getOperator:function(){
            return this.$operator.val();
        },

        getAttributeName:function(){
            return this.$attributeName.val();
        },

        getMemo:function(){
            return this.model.getFinalResult();
        },

        operatorChange: function() {
            this.model.setOperator(this.$operator.val());
        },

        attributeNameChange: function() {
            this.model.setAttributeName(this.$attributeName.val());
        },

        setMemo:function(memo){
            this.memo = memo;
        },

        incVisitedAssemblies:function(){
            this.visitedAssemblies++;
        },

        incVisitedInstances:function(){
            this.visitedInstances++;
        },

        onEnd:function(){
            this.$memo.text(this.getMemo());
            this.$assembliesVisited.text(this.model.getVisitedAssemblies());
            this.$instancesVisited.text(this.model.getVisitedInstances());
            this.$result.show();
        },

        onRemove:function(){
            this.trigger('removed');
            this.remove();
        }

    });

    return CalculationView;

});
