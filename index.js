/**
 * Title: Uptime monitoring Application
 * Description: A RESTful API to monitor up/down time of user define links
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th December, 2021
 * 
 */

// dependencies
const http = require('http');
const environment = require('./helpers/environments');
const { handleReqRes } = require('./helpers/handleReqRes')

// application scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// Request & Response Handler
app.handleReqRes = handleReqRes;

// start the server
app.createServer();