/**
 * Title: User handlers
 * Description: Handle user routes function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */

// dependencies
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

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

// post method handler - token create with expire date
handler._tokens.post = (requestProperties, callback) => {
    // request payload sanitizing
    const phone = 
        typeof(requestProperties.body.phone) === 'string' &&
        requestProperties.body.phone.trim().length === 11 
        ? requestProperties.body.phone 
        : null;

    const password = 
        typeof(requestProperties.body.password) === 'string' &&
        requestProperties.body.password.trim().length > 0 
        ? requestProperties.body.password 
        : null;
    
    // validation check for request payload
    if (phone && password) {
        // get user data to check the password
        data.read('users', phone, (err1, user) => {
            if (!err1) {
                if (hash(password) === parseJSON(user).password) {
                    const token = createRandomString(200);
                    const expires = Date.now() + (5 * 60 * 1000); // expires in 5 min in millisecond
                    const tokenObject = {
                        phone,
                        token,
                        expires
                    };
                    // store token to database
                    data.create('tokens', token, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: 'Server Error!'
                            });
                        }
                    });
                } else {
                    callback(422, {
                        error: "Password is not valid!"
                    });
                }
            } else {
                callback(422, {
                    error: "Phone no is not valid!"
                });
            }
        });
    } else {
        callback(400, {
            error: 'Payload is not perfect!'
        });
    }
};
handler._tokens.put = (requestProperties, callback) => {};
handler._tokens.delete = (requestProperties, callback) => {};

// module export
module.exports = handler;