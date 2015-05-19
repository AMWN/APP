'use strict';

//Setting up route
angular.module('salesrelations').config(['$stateProvider',
	function($stateProvider) {
		// Salesrelations state routing
		$stateProvider.
		state('listSalesrelations', {
			url: '/salesrelations',
			templateUrl: 'modules/salesrelations/views/list-salesrelations.client.view.html'
		}).
		state('createSalesrelation', {
			url: '/salesrelations/create',
			templateUrl: 'modules/salesrelations/views/create-salesrelation.client.view.html'
		}).
		state('viewSalesrelation', {
			url: '/salesrelations/:salesrelationId',
			templateUrl: 'modules/salesrelations/views/view-salesrelation.client.view.html'
		}).
		state('editSalesrelation', {
			url: '/salesrelations/:salesrelationId/edit',
			templateUrl: 'modules/salesrelations/views/edit-salesrelation.client.view.html'
		});
	}
]);