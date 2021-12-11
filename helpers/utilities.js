/**
 * Title: Utilites
 * Description: Important Utility functions
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */
// dependencies
const crypto = require('crypto');
const environment = require('../helpers/environments');

// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }
    return output;
};

// hashing a string
utilities.hash = (str) => {
    if (typeof(str) === 'string' && str.length > 0) {
        let hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// exports module
module.exports = utilities;