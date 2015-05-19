'use strict';

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
    function($scope, $stateParams, $location, Authentication, Projects) {
        $scope.authentication = Authentication;

        $scope.model = [
            {
                label: 'Project',
                seno: 1,
                type: 'String',
                field: '_id',
                view: true,
                edit: true,
                required: true

            },
            {
                label: 'Omschrijving',
                seno: 2,
                type: 'String',
                field: 'omschrijving',
                view: true,
                edit: true,
                required: true
            },
            {
                label: 'Projectgroep',
                seno: 3,
                type: 'String',
                field: 'projectgroep',
                view: true,
                edit: true,
                required: true
            },
            {
                label: 'Administratie',
                seno: 4,
                type: 'String',
                field: 'administratie',
                view: true,
                edit: true,
                required: true
            },
            {
                label: 'Verkooprelatie',
                seno: 5,
                type: 'Ref',
                field: 'verkooprelatie',
                key: '_id',
                view: true,
                edit: true,
                required: true
            },
            {
                label: 'Verkooprelatie_naam',
                seno: 6,
                type: 'Ref',
                field: 'verkooprelatie',
                key: 'naam',
                view: true,
                edit: true
            },
            {
                label: 'User',
                seno: 7,
                type: 'Ref',
                field: 'user',
                key: 'displayName',
                view: true,
                edit: true
            },
            {
                label: 'Created',
                seno: 8,
                type: 'Date',
                field: 'created',
                view: true,
                edit: false
            },
            {
                label: 'Updated',
                seno: 9,
                type: 'Date',
                field: 'updated',
                view: true,
                edit: false
            }];

        $scope.create = function() {
            console.log($scope);
            var project = new Projects({
                _id: $scope.project.id,
                omschrijving: $scope.project.omschrijving,
                projectgroep: $scope.project.projectgroep

            });
            project.$save(function(response) {
                $location.path('projects/' + response._id);

                $scope.omschrijving = '';
                $scope.projectgroep = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function() {
                    $location.path('projects');
                });
            }
        };

        $scope.update = function() {
            var project = $scope.project;
            project.$update(function() {
                $location.path('projects/' + project._id);
            },
                    function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
            console.log($scope.project);
        };

        $scope.find = function() {
            $scope.projects = Projects.query();


        };

        $scope.findOne = function() {



            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            });
            console.log($scope.project);

        };


        $scope.sync = function() {
            Projects.sync(function() {
                $location.path('projects');
            },
                    function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });

        };

        $scope.clearVal = 0;
        $scope.saveVal = 0;

        $scope.clear = function() {
            $scope.clearVal += 1; //On this value change directive clears the context
        }

        $scope.saveToImage = function() {
            $scope.saveVal = 1; //On this value change directive saves the signature
        }
    }
]);

