/*global define,App*/
define(['backbone' ],
    function (Backbone) {
        'use strict';
        var AttributesCalculation = Backbone.Collection.extend({

            addOperator: function(attribute, operator) {
                var model = this.get(attribute);
                if(!model) {
                    this.add({id: attribute, name: attribute, operators: [operator]});
                } else {
                    var operators = model.get('operators');
                    if(_.indexOf(operators,operator) === -1) {
                        operators.push(operator);
                        model.trigger('change');
                    }
                }
            },

            removeOperator: function(attribute, operator) {
                var model = this.get(attribute);
                if(model) {
                    var operators = model.get('operators');
                    if(operators.splice(_.indexOf(operators,operator),1).length) {
                        if(!operators.length) {
                            this.remove(model);
                        }
                        model.trigger('change');
                    }
                }
            }
        });

        return AttributesCalculation;

    });
