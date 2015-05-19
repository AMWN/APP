'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user)
            $location.path('/');

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;


                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signinProfit = function() {
            console.log('signin');

            $scope.getParameterByName = function(name)
            {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.href);
                if (results === null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            };

            var integrationdata = {
                tokenurl: $scope.getParameterByName("tokenurl"),
                code: $scope.getParameterByName("code"),
                publickey: $scope.getParameterByName("publickey"),
                sessionid: $scope.getParameterByName("sessionid")
            };

            console.log(integrationdata);

            $http.post('/auth/signinProfit', integrationdata).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                //$location.path('/');
            }).error(function(response) {
                console.log(response);
                $scope.error = response.message;
            });
        };
    }
]);