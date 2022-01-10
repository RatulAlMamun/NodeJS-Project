/**
 * Title: Check handlers
 * Description: Handle user define checks
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 2nd January, 2022
 * 
 */

// dependencies
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

// handler function
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    // accepted Methods checking
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}

// requested methods scaffolding
handler._check = {};

// get method handler - get user data with query string of phone
handler._check.get = (requestProperties, callback) => {
    // validation rules for query string
    const id = 
        typeof(requestProperties.queryString.id) === 'string' &&
        requestProperties.queryString.id.trim().length === 20 
        ? requestProperties.queryString.id 
        : null;
    
    // validate query string
    if (id) {
        // fetch the check data from database
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // get the token from request header
                const token = 
                    typeof(requestProperties.headersObject.token) === 'string' 
                    ? requestProperties.headersObject.token 
                    : false;

                // verify token
                tokenHandler._tokens.verify(
                    token,
                    parseJSON(checkData).userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error: "Unauthorized!"
                            });
                        }
                    }
                );
            } else {
                callback(404, {
                    error: "Check data not found."
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request."
        });
    }
};

// post method handler - check url monitor create
handler._check.post = (requestProperties, callback) => {
    // validation rules
    const protocol =
        typeof(requestProperties.body.protocol) === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol
        : false;

    const url =
        typeof(requestProperties.body.url) === 'string' &&
        requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url
        : false;

    const method =
        typeof(requestProperties.body.method) === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method
        : false;

    const successCodes =
        typeof(requestProperties.body.successCodes) === 'object' &&
        requestProperties.body.successCodes instanceof Array
        ? requestProperties.body.successCodes
        : false;
    
    const timeoutSeconds =
        typeof(requestProperties.body.timeoutSeconds) === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds
        : false;

    // validate request payload
    if (protocol && url && method && successCodes && timeoutSeconds) {
        // verify token
        const token = 
            typeof(requestProperties.headersObject.token) === 'string' 
            ? requestProperties.headersObject.token 
            : false;

        // fetch the user phone by reading token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // fetch the user data by using user phone
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        // verify token
                        tokenHandler._tokens.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObject = parseJSON(userData);
                                
                                // validate for user checks array
                                const userChecks =
                                    typeof(userObject.checks) === 'object' &&
                                    userObject.checks instanceof Array
                                    ? userObject.checks
                                    : [];
                                
                                // validate the checks limit
                                if (userChecks.length < maxChecks) {
                                    // build the checks object
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id : checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    };

                                    // store the checksObject to the database
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add checkId to the userObject
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // update the user Object
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: 'Server Error!'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Server Error!'
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'User has reach the limit of checks.'
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Unauthorized.'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Unauthorized.'
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Unauthorized.'
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your payload.'
        });
    }
};

// put method handler - user update
handler._check.put = (requestProperties, callback) => {
    // validation rules for query string
    const id = 
        typeof(requestProperties.queryString.id) === 'string' &&
        requestProperties.queryString.id.trim().length === 20 
        ? requestProperties.queryString.id 
        : null;
    
    // validate query string
    if (id) {
        // validation rules
        const protocol =
            typeof(requestProperties.body.protocol) === 'string' &&
            ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

        const url =
            typeof(requestProperties.body.url) === 'string' &&
            requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

        const method =
            typeof(requestProperties.body.method) === 'string' &&
            ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

        const successCodes =
            typeof(requestProperties.body.successCodes) === 'object' &&
            requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

        const timeoutSeconds =
            typeof(requestProperties.body.timeoutSeconds) === 'number' &&
            requestProperties.body.timeoutSeconds % 1 === 0 &&
            requestProperties.body.timeoutSeconds >= 1 &&
            requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

        // validate request payload
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // fetch the check data
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJSON(checkData);
                
                    // get the token from request header
                    const token = 
                        typeof(requestProperties.headersObject.token) === 'string' 
                        ? requestProperties.headersObject.token 
                        : false;

                    // verify token
                    tokenHandler._tokens.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }

                            // update the check data
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: "Check Data updated successfully."
                                    });
                                } else {
                                    callback(500, {
                                        error: "Server Error!"
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: "Unauthorized!"
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: 'Server Error!'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You must provide at least one data to update!'
            });
        }
    } else {
        callback(400, {
            error: 'You have a problem in your payload!'
        });
    }
};

// delete method - delete existing data
handler._check.delete = (requestProperties, callback) => {
    // validation rules for query string
    const id = 
        typeof(requestProperties.queryString.id) === 'string' &&
        requestProperties.queryString.id.trim().length === 20 
        ? requestProperties.queryString.id 
        : null;
    
    // validate query string
    if (id) {
        // fetch the check data from database
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const checkObject = parseJSON(checkData);
                // get the token from request header
                const token = 
                    typeof(requestProperties.headersObject.token) === 'string' 
                    ? requestProperties.headersObject.token 
                    : false;

                // verify token
                tokenHandler._tokens.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // delete check data from database
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                // fetch user data to delete check id
                                data.read('users', checkObject.userPhone, (err3, userData) => {
                                    if (!err3 && userData) {
                                        const userObject = parseJSON(userData);
                                        // userCheck data sanitizing
                                        let userChecks = 
                                            typeof(userObject.checks) === 'object' &&
                                            userObject.checks instanceof Array
                                            ? userObject.checks
                                            : [];
                                        
                                        // remove the deleted check id from userChecks
                                        const checkPosition = userObject.checks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            
                                            // update the user data
                                            userObject.checks = userChecks;
                                            data.update(
                                                'users',
                                                userObject.phone,
                                                userObject,
                                                (err4) => {
                                                    if (!err4) {
                                                        callback(200, {
                                                            message: "Successfully deleted."
                                                        })
                                                    } else {
                                                        callback(500, {
                                                            error: "Server Error!"
                                                        });
                                                    }
                                                }
                                            );
                                        } else {
                                            callback(500, {
                                                error: "Check id is not found in user data!"
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: "Server Error!"
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: "Server Error!"
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: "Unauthorized!"
                        });
                    }
                });
            } else {
                callback(404, {
                    error: "Check data not found."
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request."
        });
    }
};

// module export
module.exports = handler;