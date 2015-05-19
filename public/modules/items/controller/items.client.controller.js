'use strict';

angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Items',
	function($scope, $stateParams, $location, Authentication, Items) {
		$scope.authentication = Authentication;
  
                
		$scope.findOne = function() {
			$scope.items = Items.get();
                        console.log($scope.items);
		};
	}
]);