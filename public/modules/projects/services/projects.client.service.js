'use strict';

//Projects service used for communicating with the articles REST endpoints
angular.module('projects').factory('Projects', ['$resource',
    function($resource) {
        return $resource('projects/:projectId', {
            projectId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            sync: {method: 'GET',
                url: 'projectssync'
            }

        });
        
    }
    
]);