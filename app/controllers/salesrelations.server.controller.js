'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Salesrelation = mongoose.model('Salesrelation'),
        _ = require('lodash'),
        MongoClient = require('mongodb').MongoClient,
        connector = require('../../app/controllers/connector.server.controller');


// Connection URL
var url = 'mongodb://localhost:27017/app-dev';


/**
 * Create a Salesrelation
 */
exports.create = function(req, res) {
    var salesrelation = new Salesrelation(req.body);
    salesrelation.user = req.user;

    salesrelation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(salesrelation);
        }
    });
};

/**
 * Show the current Salesrelation
 */
exports.read = function(req, res) {
    res.jsonp(req.salesrelation);
};

/**
 * Update a Salesrelation
 */
exports.update = function(req, res) {
    var salesrelation = req.salesrelation;

    salesrelation = _.extend(salesrelation, req.body);

    salesrelation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(salesrelation);
        }
    });
};

/**
 * Delete an Salesrelation
 */
exports.delete = function(req, res) {
    var salesrelation = req.salesrelation;

    salesrelation.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(salesrelation);
        }
    });
};

/**
 * List of Salesrelations
 */
exports.list = function(req, res) {
    Salesrelation.find().sort('-created').populate('user', 'displayName').exec(function(err, salesrelations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(salesrelations);
        }
    });
};

/**
 * Salesrelation middleware
 */
exports.salesrelationByID = function(req, res, next, id) {
    Salesrelation.findById(id).populate('user', 'displayName').exec(function(err, salesrelation) {
        if (err)
            return next(err);
        if (!salesrelation)
            return next(new Error('Failed to load Salesrelation ' + id));
        req.salesrelation = salesrelation;
        next();
    });
};

/**
 * Salesrelation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.salesrelation.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};


exports.sync = function(req, res) {
    console.log(Date.now() + 'sync server');
    var options = {getconnector: 'APP_salesrelations'};
    connector.getconnector(options, function callback(response) {
        if (response.error) {
            console.log('error on getconnector');
            return res.status(400).send({
                message: errorHandler.getErrorMessage(response)
            });
        }
        else
        {
            console.log(Date.now() + ' mongodb: remove documents');
            Salesrelation.remove({}, function(err) {
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
                        var salesrelation = new Salesrelation();
                        salesrelation._id = response.body[key]._id[0];
                        salesrelation.naam = response.body[key].naam[0];
                        salesrelation.adres = response.body[key].adres[0];
                        salesrelation.user = req.user;
                        salesrelation.save(function(err) {
                            if (err) {
                                errors = '1';
                            }
                        });
                    }

                    if (errors) {
                        console.log(Date.now() + ' mongodb: ' + response.body.length + ' sre documents created');
                        console.log(Date.now() + ' response: sre documents created');
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
