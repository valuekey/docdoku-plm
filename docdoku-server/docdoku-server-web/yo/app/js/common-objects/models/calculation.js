/*global _,define*/
define(['backbone'], function (Backbone) {
    'use strict';
    var Calculation = Backbone.Model.extend({

        initialize: function () {
            _.bindAll(this);
            this.reset();
        },

        setPartCollection: function(partCollection) {
            this.set('partCollection',partCollection);
            return this;
        },

        getPartCollection: function() {
            return this.get('partCollection');
        },

        setAttributeName: function(computeAttributeName) {
            this.set('attributeName', computeAttributeName);
            return this;
        },

        getAttributeName: function() {
            return this.get('attributeName');
        },

        setOperator: function(operator) {
            this.set('operator',operator);
            return this;
        },

        getOperator: function() {
            return this.get('operator');
        },

        getOperands: function() {
            return this.get('operands');
        },

        getFinalResult: function() {
            if(this.getOperands() && this.getOperator() === 'AVG') {
                return this.get('result') / this.get('operands');
            } else {
                return this.get('result');
            }
        },

        getResult: function() {
            return this.get('result');
        },

        setResult: function(result) {
            this.set('result', result);
        },

        add: function(value) {
            this.set('operands', this.get('operands')+1);
            switch(this.getOperator()){
                case 'SUM':
                case 'AVG':
                    this.addValue(value);
                    break;

                default:
            }
        },

        /**
         * Function that will update the result when it has already been computed.
         * Should used Add and getResult to do a calculation.
         * @param difference
         */
        update: function(difference) {
            if(this.getOperator() === 'AVG') {
                difference = difference / this.getOperands();
            }
            this.addValue(difference);
        },

        /**
         * Utils function to add value, should not be used from other classes.
         * @param value
         */
        addValue: function(value) {
            this.setResult(this.getResult() + value);
        },

        reset: function() {
            this.set('operands',0);
            this.setResult(0);
            this.set('visitedAssemblies',0);
            this.set('visitedInstances',0);
        },
        incVisitedAssemblies: function() {
            this.set('visitedAssemblies',this.getVisitedAssemblies()+1);
        },
        getVisitedAssemblies: function() {
            return this.get('visitedAssemblies');
        },
        incVisitedInstances: function() {
            this.set('visitedInstances',this.getVisitedInstances()+1);
        },
        getVisitedInstances: function() {
            return this.get('visitedInstances');
        }
    });
    return Calculation;
});
