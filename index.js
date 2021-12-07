/**
 * Title: Uptime monitoring Application
 * Description: A RESTful API to monitor up/down time of user define links
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th December, 2021
 * 
 */

// dependencies
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder')

// application scaffolding
const app = {};

// configaration settings
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });

};

// Request & Response Handler
app.handleReqRes = (req, res) => {
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
    req.on('end', () => {
        realData += decoder.end(buffer);
    });

    // response handler
    res.end('Hello world');
};

// start the server
app.createServer();