'use strict';

// Configuring the Articles module
angular.module('salesrelations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Salesrelations', 'salesrelations', 'dropdown', '/salesrelations(/create)?');
		Menus.addSubMenuItem('topbar', 'salesrelations', 'List Salesrelations', 'salesrelations');
		Menus.addSubMenuItem('topbar', 'salesrelations', 'New Salesrelation', 'salesrelations/create');
	}
]);