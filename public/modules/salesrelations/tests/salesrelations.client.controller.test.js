'use strict';

(function() {
	// Salesrelations Controller Spec
	describe('Salesrelations Controller Tests', function() {
		// Initialize global variables
		var SalesrelationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Salesrelations controller.
			SalesrelationsController = $controller('SalesrelationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Salesrelation object fetched from XHR', inject(function(Salesrelations) {
			// Create sample Salesrelation using the Salesrelations service
			var sampleSalesrelation = new Salesrelations({
				name: 'New Salesrelation'
			});

			// Create a sample Salesrelations array that includes the new Salesrelation
			var sampleSalesrelations = [sampleSalesrelation];

			// Set GET response
			$httpBackend.expectGET('salesrelations').respond(sampleSalesrelations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.salesrelations).toEqualData(sampleSalesrelations);
		}));

		it('$scope.findOne() should create an array with one Salesrelation object fetched from XHR using a salesrelationId URL parameter', inject(function(Salesrelations) {
			// Define a sample Salesrelation object
			var sampleSalesrelation = new Salesrelations({
				name: 'New Salesrelation'
			});

			// Set the URL parameter
			$stateParams.salesrelationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/salesrelations\/([0-9a-fA-F]{24})$/).respond(sampleSalesrelation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.salesrelation).toEqualData(sampleSalesrelation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Salesrelations) {
			// Create a sample Salesrelation object
			var sampleSalesrelationPostData = new Salesrelations({
				name: 'New Salesrelation'
			});

			// Create a sample Salesrelation response
			var sampleSalesrelationResponse = new Salesrelations({
				_id: '525cf20451979dea2c000001',
				name: 'New Salesrelation'
			});

			// Fixture mock form input values
			scope.name = 'New Salesrelation';

			// Set POST response
			$httpBackend.expectPOST('salesrelations', sampleSalesrelationPostData).respond(sampleSalesrelationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Salesrelation was created
			expect($location.path()).toBe('/salesrelations/' + sampleSalesrelationResponse._id);
		}));

		it('$scope.update() should update a valid Salesrelation', inject(function(Salesrelations) {
			// Define a sample Salesrelation put data
			var sampleSalesrelationPutData = new Salesrelations({
				_id: '525cf20451979dea2c000001',
				name: 'New Salesrelation'
			});

			// Mock Salesrelation in scope
			scope.salesrelation = sampleSalesrelationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/salesrelations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/salesrelations/' + sampleSalesrelationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid salesrelationId and remove the Salesrelation from the scope', inject(function(Salesrelations) {
			// Create new Salesrelation object
			var sampleSalesrelation = new Salesrelations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Salesrelations array and include the Salesrelation
			scope.salesrelations = [sampleSalesrelation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/salesrelations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSalesrelation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.salesrelations.length).toBe(0);
		}));
	});
}());