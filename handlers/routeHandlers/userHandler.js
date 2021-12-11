/**
 * Title: User handlers
 * Description: Handle user routes function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');

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
    callback(200);
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
handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};

// module export
module.exports = handler;