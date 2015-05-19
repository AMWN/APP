'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    _id: {
        type: String
    },
    omschrijving: {
        type: String,
        default: '',
        trim: true,
        required: 'Omschrijving cannot be blank'
       
    },
    projectgroep: {
        type: String,
        default: '',
        trim: true
    },
    administratie: {
        type: String,
        default: '',
        trim: true
    },
    verkooprelatie: {
        type: String,
        ref: 'Salesrelation'
    },
    verkooprelatie_naam: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
});

mongoose.model('Project', ProjectSchema);