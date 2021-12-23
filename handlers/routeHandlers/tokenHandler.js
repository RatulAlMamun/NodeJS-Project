/**
 * Title: User handlers
 * Description: Handle user routes function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */

// dependencies
const data = require('../../lib/data');

// module scaffolding
const handler = {};

// handler function
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}

// requested methods scaffolding
handler._tokens = {};

handler._tokens.get = (requestProperties, callback) => {};
handler._tokens.post = (requestProperties, callback) => {};
handler._tokens.put = (requestProperties, callback) => {};
handler._tokens.delete = (requestProperties, callback) => {};

// module export
module.exports = handler;