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

// get method handler - get token using token id
handler._tokens.get = (requestProperties, callback) => {
    // token id validation
    const tokenId = 
        typeof(requestProperties.queryString.id) === 'string' &&
        requestProperties.queryString.id.trim().length === 200 
        ? requestProperties.queryString.id 
        : null;
    // check the token id is valid or not
    if (tokenId) {
        // lookup the token
        data.read('tokens', tokenId, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token not found!'
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested token not found!'
        });
    }
};

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

// put method handler - update the token expires time for 1hr
handler._tokens.put = (requestProperties, callback) => {
    // request payload sanitizing
    const tokenId = 
        typeof(requestProperties.body.tokenId) === 'string' &&
        requestProperties.body.tokenId.trim().length === 200 
        ? requestProperties.body.tokenId 
        : null;

    const extend = 
        typeof(requestProperties.body.extend) === 'boolean' &&
        requestProperties.body.extend 
        ? true
        : false;
        
        // validate request payload
        if (tokenId && extend) {
            // lookup for the token data
            data.read('tokens', tokenId, (err1, tokenData) => {
                if (!err1) {
                    let tokenObject = parseJSON(tokenData);
                    // check token expiration time
                    if (tokenObject.expires > Date.now()) {
                        // update the token expires time to 1hr
                        tokenObject.expires = Date.now() + 60 * 60 * 1000;
                        data.update('tokens', tokenId, tokenObject, (err2) => {
                            if (!err2) {
                                callback(200, tokenObject);
                            } else {
                                callback(500, {
                                    error: "Server error!"
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: "Token is expired!"
                        });
                    }
                } else {
                    callback(500, {
                        error: "Server Error!"
                    });
                }
            });
        } else {
            callback(400, {
                error: "Requested payload is not valid!"
            })
        }
};
handler._tokens.delete = (requestProperties, callback) => {};

// module export
module.exports = handler;