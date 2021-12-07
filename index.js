/**
 * Title: Uptime monitoring Application
 * Description: A RESTful API to monitor up/down time of user define links
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th December, 2021
 * 
 */

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')

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
app.handleReqRes = handleReqRes;

// start the server
app.createServer();