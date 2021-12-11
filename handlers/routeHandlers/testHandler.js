/**
 * Title: Test handlers
 * Description: 
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */

// module scaffolding
const handler = {};

// handler function
handler.testHandler = (requestProperties, callback) => {
    callback(200, {
        error: false,
        message: "this is a test message."
    });
}

// module export
module.exports = handler;