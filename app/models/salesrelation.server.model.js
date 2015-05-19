'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Salesrelation Schema
 */
var SalesrelationSchema = new Schema({
    _id: {
        type: String
    },
    naam: {
        type: String,
        default: '',
        required: 'Please fill Salesrelation name',
        trim: true
    },
    adres: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Salesrelation', SalesrelationSchema);