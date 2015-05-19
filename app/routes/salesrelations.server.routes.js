'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var salesrelations = require('../../app/controllers/salesrelations.server.controller');

	// Salesrelations Routes
	app.route('/salesrelations')
		.get(salesrelations.list)
		.post(users.requiresLogin, salesrelations.create);

	app.route('/salesrelations/:salesrelationId')
		.get(salesrelations.read)
		.put(users.requiresLogin, salesrelations.hasAuthorization, salesrelations.update)
		.delete(users.requiresLogin, salesrelations.hasAuthorization, salesrelations.delete);
        
         app.route('/salesrelationssync')
		.get(salesrelations.sync);
	
        
	// Finish by binding the Salesrelation middleware
	app.param('salesrelationId', salesrelations.salesrelationByID);
};
