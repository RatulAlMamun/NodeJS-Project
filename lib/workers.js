/**
 * Title: Server library
 * Description: Server related function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th January, 2021
 * 
 */

// dependencies
const url = require('url');
const http = require('http');
const data = require('./data');
const https = require('https');
const { parseJSON } = require('./../helpers/utilities');

// worker object - module scaffolding
const worker = {};

// process CheckOutCome
worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
    // check if check outcome is up or down
    let state =
        !checkOutCome.error && 
        checkOutCome.responseCode && 
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1 
        ? 'up' 
        : 'down';
    
    
};

// perform check
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        'error': false,
        'value': false
    };

    // sent outcome process flag
    let outComeSent = false;

    // parse the hostname and full url from originalData
    const parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path;

    // construct the request
    const requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        // check the status of the response
        const status = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    // request error event
    req.on('error', () => {
        checkOutCome = {
            'error': true,
            'value': 'timeout'
        };
        // update the check outcome and pass to the next process
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    // request timeout check
    req.on('timeout', (e) => {
        // update the check outcome and pass to the next process
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    // send request
    req.end();
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id)  {
        originalData.state = 
            typeof(originalCheckData.state) === 'string' && 
            ['up', 'down'].indexOf(originalCheckData.state) > -1 
            ? originalCheckData.state 
            : 'down';
        originalData.lastChecked = 
            typeof(originalCheckData.lastChecked) === 'number' && 
            originalCheckData.lastChecked > 0 
            ? originalCheckData.lastChecked 
            : false;

        // pass to the next process
        worker.performCheck(originalData);
    } else {
        console.log('Error: Check was invalid or not properly formated!');
    }
};

// lookup all the checks from database
worker.gatherAllChecks = () => {
    // get all the checks
    data.list('checks', (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            checks.forEach(check => {
                // read the checkData
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        // pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: Reading one of the checks data!');
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to process!');
        }
    });
};

// timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
};

// create worker
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
};

// exports module
module.exports = worker; 
