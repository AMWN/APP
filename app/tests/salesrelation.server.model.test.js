'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Salesrelation = mongoose.model('Salesrelation');

/**
 * Globals
 */
var user, salesrelation;

/**
 * Unit tests
 */
describe('Salesrelation Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			salesrelation = new Salesrelation({
				name: 'Salesrelation Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return salesrelation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			salesrelation.name = '';

			return salesrelation.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Salesrelation.remove().exec();
		User.remove().exec();

		done();
	});
});