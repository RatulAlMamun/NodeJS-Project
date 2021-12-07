/**
 * Title: Handle Request and Response
 * Description: 
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */

// dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder')

// application scaffolding
const handler = {};


// Request & Response Handler
handler.handleReqRes = (req, res) => {
    // request handler
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace('/^\/+|\/+$/g', '');
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const headersObject = req.headers;
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    
    // request payload
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', (buffer) => {
        realData += decoder.end(buffer);
    });

    // response handler
    res.end('Hello world');
};

// exports data
module.exports = handler;