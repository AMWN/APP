'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Project = mongoose.model('Project'),
        _ = require('lodash'),
        connector = require('../../app/controllers/connector.server.controller');
 

/**
 * Create a project
 */
exports.create = function(req, res) {
    var project = new Project(req.body);
    project.user = req.user;
    project.remark = {body: 'test', hidden: true};

    project.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(project);
        }
    });
};

/**
 * Show the current project
 */
exports.read = function(req, res) {

    res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
    var project = req.project;
    project = _.extend(project, req.body);
    project.updated = Date.now();
    console.log(Date.now() + ' start update connector ');

    var data = {
        Element: {
            Fields: {
                $: {'Action': 'update'},
                PrId: project._id,
                PrGp: project.projectgroep,
                Ds: project.omschrijving
            }
        }
    };
    var options = {updateconnector: 'PtProject', data: data};
    connector.updateconnector(options, function callback(response) {
        console.log(Date.now() + ' end update connector');

        if (response.error === true) {
            console.log(response.faultstring);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(response)
            });
        }
        else
        {
            project.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(project);
                }
            });
        }
    });

};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
    var project = req.project;

    project.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(project);
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
    Project.find().sort('project').populate('user', 'displayName').exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(projects);
        }
    });
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
    Project.findById(id)
            .populate('user', 'displayName')
            .populate('verkooprelatie')
            .exec(function(err, project) {
        if (err)
            return next(err);
        if (!project)
            return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.project.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

/**
 Projects sync with Profit
 */

exports.sync = function(req, res) {
    console.log(Date.now() + 'sync server');
    var options = {getconnector: 'APP_projecten'};
    connector.getconnector(options, function callback(response) {
        console.log(Date.now() + ' mongodb: remove documents');
        if (response.error) {
            console.log('error on getconnector');
            return res.status(400).send({
                message: errorHandler.getErrorMessage(response)
            });
        }
        else
        {
            console.log(Date.now() + ' mongodb: remove documents');
            Project.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                else
                {
                    console.log(Date.now() + ' mongodb: create sre documents');
                    // Use connect method to connect to the Server
                    //console.log(response.body);
                    var errors = [];
                 
                    for (var key in response.body) {
                        //var key = 0;
                        var project = new Project();
                        
                        project._id = response.body[key].project[0];
                        project.omschrijving = response.body[key].omschrijving[0];
                        project.projectgroep = response.body[key].projectgroep[0];
                        project.administratie = response.body[key].administratie[0];
                        project.verkooprelatie = response.body[key].verkooprelatie[0];
                        project.verkooprelatie_naam = response.body[key].verkooprelatie_naam[0];
                        project.created = response.body[key].created[0];
                        project.user = req.user;
                        project.save(function(err) {
                            if (err) {
                                errors = '1';
                                console.log(err);
                            }
                        });
                    }

                    if (errors) {
                        console.log(Date.now() + ' mongodb: ' + response.body.length + ' prj documents created');
                        console.log(Date.now() + ' response: prj documents created');
                        res.json({data: 'sre synced'});
                        
                    }
                    else
                    {
                        console.log(errors);
                        return res.status(400).send({message: errors});

                    }
                }

            });

        }

    });

};