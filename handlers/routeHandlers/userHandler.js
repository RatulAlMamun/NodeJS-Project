/**
 * Title: User handlers
 * Description: Handle user routes function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */

// dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

// handler function
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}

handler._users = {};

handler._users.get = (requestProperties, callback) => {
    // check the phone no is valid
    const phone = 
        typeof(requestProperties.queryString.phone) === 'string' &&
        requestProperties.queryString.phone.trim().length === 11 
        ? requestProperties.queryString.phone 
        : null;
    
    if (phone) {
        // lookup the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requested user not found!'
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested user not found!'
        });
    }
};
handler._users.post = (requestProperties, callback) => {
    const firstName = 
        typeof(requestProperties.body.firstName) === 'string' &&
        requestProperties.body.firstName.trim().length > 0 
        ? requestProperties.body.firstName 
        : null;

    const lastName = 
        typeof(requestProperties.body.lastName) === 'string' &&
        requestProperties.body.lastName.trim().length > 0 
        ? requestProperties.body.lastName 
        : null;

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

    const tossAggrement = 
        typeof(requestProperties.body.tossAggrement) === 'boolean' &&
        requestProperties.body.tossAggrement
        ? requestProperties.body.tossAggrement 
        : null;

    if (firstName && lastName && phone && password && tossAggrement) {
        // make sure that user does not already exist
        data.read('users', phone, (err1, user) => {
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tossAggrement
                };

                // store the user to database
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(201, {
                            message: 'Users creat successfully'
                        })
                    } else {
                        callback(500, {
                            error: 'could not create user'
                        });
                    }
                });
            } else {
                callback(500, {
                    error: "Server error"
                });
            }
        });
    } else {
        callback(400, {
            error: 'Payload is not perfect'
        });
    }
};
handler._users.put = (requestProperties, callback) => {
    const firstName = 
        typeof(requestProperties.body.firstName) === 'string' &&
        requestProperties.body.firstName.trim().length > 0 
        ? requestProperties.body.firstName 
        : null;

    const lastName = 
        typeof(requestProperties.body.lastName) === 'string' &&
        requestProperties.body.lastName.trim().length > 0 
        ? requestProperties.body.lastName 
        : null;

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
    
    if (phone) {
        if (firstName || lastName || password) {
            data.read('users', phone, (err, userData) => {
                const user = { ...parseJSON(userData) }
                if (!err && user) {
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (password) {
                        user.password = hash(password);
                    }
                    data.update('users', phone, user, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'User updated successfully.'
                            })
                        } else {
                            callback(500, {
                                error: 'Server Error'
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have a problem in your payload.'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your payload.'
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone no. Please try again.'
        });
    }
};
handler._users.delete = (requestProperties, callback) => {
    // check the phone no is valid
    const phone = 
        typeof(requestProperties.queryString.phone) === 'string' &&
        requestProperties.queryString.phone.trim().length === 11 
        ? requestProperties.queryString.phone 
        : null;
    
    if (phone) {
        // lookup the user
        data.read('users', phone, (err1, u) => {
            const user = { ...parseJSON(u) };
            if (!err1 && user) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User deleted successfully'
                        });
                    } else {
                        callback(500, {
                            message: 'Server Error'
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Requested user not found!'
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested user not found!'
        });
    }
};

// module export
module.exports = handler;