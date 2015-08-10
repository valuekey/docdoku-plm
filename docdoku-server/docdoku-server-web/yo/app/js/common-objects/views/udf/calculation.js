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
            'click .remove':'onRemove'
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
            this.binDOMElements().resetCalculation();

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
            debugger;
            var val =  this.model.model.get(this.getAttributeName());
            val = this.$operator.val() === 'SUM' ? val : val / ((this.model.getVisitedAssemblies() + this.model.getVisitedInstances()) || 0);
            this.$memo.text(val);
            this.$assembliesVisited.text(this.model.visitedAssemblies);
            this.$instancesVisited.text(this.model.visitedInstances);
            this.$result.show();
        },

        onRemove:function(){
            debugger;
            this.model.model.unset(this.getAttributeName());
            this.trigger('removed',this.model);
            this.remove();
        }

    });

    return CalculationView;

});
