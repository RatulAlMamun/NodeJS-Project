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
const environment = require('./helpers/environments');
const data = require('./lib/data');

// testing file system
// data.create('test', 'newFile', {'name': 'Bangladesh', 'Langugae': 'Bangla'}, (err) => {
//     console.log('error: ', err);
// });

data.read('test', 'newFile', (err, data) => {
    console.log(err, data);
});

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