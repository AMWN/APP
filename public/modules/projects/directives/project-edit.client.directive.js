'use strict';

angular.module('projects').directive('inputValidation', [
    function() {
        return {
            restrict: 'AEC',
            link: function postLink(scope, element, attrs) {
                
                console.log(scope.$parent.$parent.$parent);
                console.log(element[0].required);
           
            }
        };
    }
]);