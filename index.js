/**
 * Title: Uptime monitoring Application
 * Description: A RESTful API to monitor up/down time of user define links
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th December, 2021
 * 
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

// application scaffolding
const app = {};

// application initialization function
app.init = () => {
    // start the server
    server.init();
    
    // start the workers
    workers.init();
};

// application initiate
app.init();