'use strict';

// Setting up route
angular.module('items').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('viewItem', {
			url: '/item',
			templateUrl: 'modules/items/views/view-item.client.view.html'
		});
	}
]);