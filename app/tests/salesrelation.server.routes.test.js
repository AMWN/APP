'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Salesrelation = mongoose.model('Salesrelation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, salesrelation;

/**
 * Salesrelation routes tests
 */
describe('Salesrelation CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Salesrelation
		user.save(function() {
			salesrelation = {
				name: 'Salesrelation Name'
			};

			done();
		});
	});

	it('should be able to save Salesrelation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salesrelation
				agent.post('/salesrelations')
					.send(salesrelation)
					.expect(200)
					.end(function(salesrelationSaveErr, salesrelationSaveRes) {
						// Handle Salesrelation save error
						if (salesrelationSaveErr) done(salesrelationSaveErr);

						// Get a list of Salesrelations
						agent.get('/salesrelations')
							.end(function(salesrelationsGetErr, salesrelationsGetRes) {
								// Handle Salesrelation save error
								if (salesrelationsGetErr) done(salesrelationsGetErr);

								// Get Salesrelations list
								var salesrelations = salesrelationsGetRes.body;

								// Set assertions
								(salesrelations[0].user._id).should.equal(userId);
								(salesrelations[0].name).should.match('Salesrelation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Salesrelation instance if not logged in', function(done) {
		agent.post('/salesrelations')
			.send(salesrelation)
			.expect(401)
			.end(function(salesrelationSaveErr, salesrelationSaveRes) {
				// Call the assertion callback
				done(salesrelationSaveErr);
			});
	});

	it('should not be able to save Salesrelation instance if no name is provided', function(done) {
		// Invalidate name field
		salesrelation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salesrelation
				agent.post('/salesrelations')
					.send(salesrelation)
					.expect(400)
					.end(function(salesrelationSaveErr, salesrelationSaveRes) {
						// Set message assertion
						(salesrelationSaveRes.body.message).should.match('Please fill Salesrelation name');
						
						// Handle Salesrelation save error
						done(salesrelationSaveErr);
					});
			});
	});

	it('should be able to update Salesrelation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salesrelation
				agent.post('/salesrelations')
					.send(salesrelation)
					.expect(200)
					.end(function(salesrelationSaveErr, salesrelationSaveRes) {
						// Handle Salesrelation save error
						if (salesrelationSaveErr) done(salesrelationSaveErr);

						// Update Salesrelation name
						salesrelation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Salesrelation
						agent.put('/salesrelations/' + salesrelationSaveRes.body._id)
							.send(salesrelation)
							.expect(200)
							.end(function(salesrelationUpdateErr, salesrelationUpdateRes) {
								// Handle Salesrelation update error
								if (salesrelationUpdateErr) done(salesrelationUpdateErr);

								// Set assertions
								(salesrelationUpdateRes.body._id).should.equal(salesrelationSaveRes.body._id);
								(salesrelationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Salesrelations if not signed in', function(done) {
		// Create new Salesrelation model instance
		var salesrelationObj = new Salesrelation(salesrelation);

		// Save the Salesrelation
		salesrelationObj.save(function() {
			// Request Salesrelations
			request(app).get('/salesrelations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Salesrelation if not signed in', function(done) {
		// Create new Salesrelation model instance
		var salesrelationObj = new Salesrelation(salesrelation);

		// Save the Salesrelation
		salesrelationObj.save(function() {
			request(app).get('/salesrelations/' + salesrelationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', salesrelation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Salesrelation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Salesrelation
				agent.post('/salesrelations')
					.send(salesrelation)
					.expect(200)
					.end(function(salesrelationSaveErr, salesrelationSaveRes) {
						// Handle Salesrelation save error
						if (salesrelationSaveErr) done(salesrelationSaveErr);

						// Delete existing Salesrelation
						agent.delete('/salesrelations/' + salesrelationSaveRes.body._id)
							.send(salesrelation)
							.expect(200)
							.end(function(salesrelationDeleteErr, salesrelationDeleteRes) {
								// Handle Salesrelation error error
								if (salesrelationDeleteErr) done(salesrelationDeleteErr);

								// Set assertions
								(salesrelationDeleteRes.body._id).should.equal(salesrelationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Salesrelation instance if not signed in', function(done) {
		// Set Salesrelation user 
		salesrelation.user = user;

		// Create new Salesrelation model instance
		var salesrelationObj = new Salesrelation(salesrelation);

		// Save the Salesrelation
		salesrelationObj.save(function() {
			// Try deleting Salesrelation
			request(app).delete('/salesrelations/' + salesrelationObj._id)
			.expect(401)
			.end(function(salesrelationDeleteErr, salesrelationDeleteRes) {
				// Set message assertion
				(salesrelationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Salesrelation error error
				done(salesrelationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Salesrelation.remove().exec();
		done();
	});
});