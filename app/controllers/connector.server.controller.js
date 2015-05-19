'use strict';

/**
 * Module dependencies.
 */
var soap = require('soap');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var xml2js = require('xml2js');

var username = '';
var password = '';

var url = 'https://49996.afasonlineconnector.nl/';

var body;
var faultcode;
var faultstring;

exports.getconnector = function(options, callback) {

    var connectorId = options.getconnector;

    var parser = function(xml) {
        var xml_parsed = '';
        parseString(xml, function(err, result) {
            xml_parsed = result.AfasGetConnector[connectorId];
        });
        return xml_parsed;
    };

    var parser_error = function(xml) {
        var xml_parsed = '';
        parseString(xml, function(err, result) {
            xml_parsed = result['soap:Envelope'];
        });
        return xml_parsed;
    };

    soap.createClient('./appconnectorGet.wsdl', function(err, client) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(Date.now() + ' Connector: connecting AOL');

        client.GetDataWithOptions({
            token: '<token><version>1</version><data>E8141F81A8974622B3A4B390B0C7750FB3BB5515420D162339E973B521C24741</data></token>',
            connectorId: connectorId,
            filterXml: '',
            skip: 0,
            take: 1000,
            options: '<Options><Outputmode>1</Outputmode><Outputoptions>3</Outputoptions></Options>'
        }, function(err, resp) {

            if (err) {
                console.log(err.body);
                console.log(parser_error(err.body));

                response = {
                    error: true,
                    code: 11003,
                    body: err.body,
                    faultcode: '',
                    faultstring: err.body
                };
                callback(response);
            }
            else
            {
                console.log(Date.now() + ' Connector: got response');
                var response = resp;
                if (Object.keys(resp)[0] === 'GetDataWithOptionsResult') {

                    response = {
                        error: false,
                        body: parser(response.GetDataWithOptionsResult)
                    };
                    
                    callback(response);
                }
            }

        });

    });
};

exports.updateconnector = function(options, callback) {

    var connectorId = options.updateconnector;
    var obj = options.data;
    var response = [];
    
    var builder = new xml2js.Builder({rootName: 'PtProject',
        cdata: true,
        headless: false,
        renderOpts: {'pretty': true, 'indent': ' ', 'newline': '\n'}
    });
    var xml_build = builder.buildObject(obj);

    console.log(xml_build);

    soap.createClient('./appconnectorUpdate.wsdl', function(err, client) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(Date.now() + ' Connector: connecting AOL');

        client.Execute({
            token: '<token><version>1</version><data>E8141F81A8974622B3A4B390B0C7750FB3BB5515420D162339E973B521C24741</data></token>',
            connectorType: connectorId,
            connectorVersion: 1,
            dataXml: xml_build
        }, function(err, resp) {
            
            if (err) {
                if (err.body) {
                    body = err.body;
                }

                if (err.root.Envelope.Body.Fault.faultcode) {
                    faultcode = err.root.Envelope.Body.Fault.faultcode;
                }

                if (err.root.Envelope.Body.Fault.faultstring) {
                    faultstring = err.root.Envelope.Body.Fault.faultstring;
                }


                response = {
                    error: true,
                    code: 11002,
                    body: body,
                    faultcode: faultcode,
                    faultstring: faultstring
                };

                callback(response);
            }
            else
            {
                response = {
                    error: false
                };
                callback(response);
            }

        });

    });
};