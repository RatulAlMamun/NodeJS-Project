/**
 * Title: Routes
 * Description: Application Routes
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */
// dependencies
const {testHandler} = require('./handlers/routeHandlers/testHandler');

// routes definition 
const routes = {
    test: testHandler
};

// module exports
module.exports = routes;