'use strict';

//Salesrelations service used to communicate Salesrelations REST endpoints
angular.module('salesrelations').factory('Salesrelations', ['$resource',
    function($resource) {
        return $resource('salesrelations/:salesrelationId', {salesrelationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            sync: {method: 'GET',
                url: 'salesrelationssync'
            }
        });
    }
]);