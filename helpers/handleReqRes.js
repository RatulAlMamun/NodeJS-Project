/**
 * Title: Handle Request and Response
 * Description: 
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */

// dependencies
const url = require('url');
const routes = require('../routes');
const {StringDecoder} = require('string_decoder');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// application scaffolding
const handler = {};

// Request & Response Handler
handler.handleReqRes = (req, res) => {
    // request handler
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const headersObject = req.headers;
    const requestProperties = {
        path,
        method,
        queryString,
        headersObject
    };

    // Choose URL handle to execute
    const chooseHandler = routes[path] ? routes[path] : notFoundHandler;
    chooseHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
        // Final Response set
        res.writeHead(statusCode);
        res.end(payloadString);
    });
    
    // request payload
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', (buffer) => {
        realData += decoder.end(buffer);
    });
};

// exports data
module.exports = handler;