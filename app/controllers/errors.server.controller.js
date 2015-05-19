'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

var getConnectorErrorMessageUpdate = function(err) {
    var output;

    try {
        var faultcode = err.faultcode;
        var faultstring = err.faultstring;
        output = faultcode + ' : ' + faultstring;

    } catch (ex) {
        output = 'Something went wrong with the connector';
    }

    return output;
};


var getConnectorErrorMessageGet = function(err) {
    var output;

    try {
        var faultcode = err.faultcode;
        var faultstring = err.faultstring;
        output = faultcode + ' : ' + faultstring;

    } catch (ex) {
        output = 'Something went wrong with the connector';
    }

    return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            case 11002:
                message = getConnectorErrorMessageUpdate(err);
                break;
            case 11003:
                message = getConnectorErrorMessageGet(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};