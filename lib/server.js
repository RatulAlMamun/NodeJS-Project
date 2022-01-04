/**
 * Title: Server library
 * Description: Server related function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th January, 2021
 * 
 */

// dependencies
const http = require('http');
const environment = require('../helpers/environments');
const { handleReqRes } = require('../helpers/handleReqRes');

// server object - module scaffolding
const server = {};

// create server
server.createServer = () => {
    const createServerVar = http.createServer(server.handleReqRes);
    createServerVar.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// Request & Response Handler
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    // start the server
    server.createServer();
};

// exports module
module.exports = server;
