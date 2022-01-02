/**
 * Title: Routes
 * Description: Application Routes
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */

// dependencies
const { testHandler } = require('./handlers/routeHandlers/testHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// routes definition 
const routes = {
    test: testHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
};

// module exports
module.exports = routes;