'use strict';

// Salesrelations controller
angular.module('salesrelations').controller('SalesrelationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Salesrelations',
    function($scope, $stateParams, $location, Authentication, Salesrelations) {
        $scope.authentication = Authentication;

        // Create new Salesrelation
        $scope.create = function() {
            // Create new Salesrelation object
            var salesrelation = new Salesrelations({
                name: this.name
            });

            // Redirect after save
            salesrelation.$save(function(response) {
                $location.path('salesrelations/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Salesrelation
        $scope.remove = function(salesrelation) {
            if (salesrelation) {
                salesrelation.$remove();

                for (var i in $scope.salesrelations) {
                    if ($scope.salesrelations [i] === salesrelation) {
                        $scope.salesrelations.splice(i, 1);
                    }
                }
            } else {
                $scope.salesrelation.$remove(function() {
                    $location.path('salesrelations');
                });
            }
        };

        // Update existing Salesrelation
        $scope.update = function() {
            var salesrelation = $scope.salesrelation;

            salesrelation.$update(function() {
                $location.path('salesrelations/' + salesrelation._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Salesrelations
        $scope.find = function() {
            $scope.salesrelations = Salesrelations.query();
        };

        // Find existing Salesrelation
        $scope.findOne = function() {
            $scope.salesrelation = Salesrelations.get({
                salesrelationId: $stateParams.salesrelationId
            });
            console.log($scope.salesrelation);
        };

        $scope.sync = function() {
            Salesrelations.sync(function() {
                $location.path('salesrelations');
            }, 
            function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);