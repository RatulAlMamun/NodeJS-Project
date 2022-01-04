/**
 * Title: Server library
 * Description: Server related function
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 4th January, 2021
 * 
 */

// dependencies

// worker object - module scaffolding
const worker = {};

// create worker
worker.init = () => {
    console.log(`worker running`);
};

// exports module
module.exports = worker;
