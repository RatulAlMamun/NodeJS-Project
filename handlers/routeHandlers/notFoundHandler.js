/**
 * Title: Not Found handlers
 * Description: 
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 8th December, 2021
 * 
 */

// module scaffolding
const handler = {};

// handler function
handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(404, {
        error: true,
        message: "Not Found!"
    });
}

// module export
module.exports = handler;