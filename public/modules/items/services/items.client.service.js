'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('items').factory('Items', ['$resource',
    function($resource) {
        console.log('serviceitems');
        return $resource('\connector');
               
    }

]);