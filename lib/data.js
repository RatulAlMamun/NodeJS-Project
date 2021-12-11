/**
 * Title: Data handling library
 * Description: A library to handle data read/write system
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 11th December, 2021
 * 
 */

// dependecies
const fs = require('fs');
const path = require('path');

// application scaffolding
const lib = {};

// base directory of the data folder
lib.basdir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.basdir + dir + '/' + file + '.json', 'wx', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    // closing the opened file
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error for closing the new file.');
                        }
                    });
                } else {
                    callback('Error for writing Data.');
                }
            });
        } else {
            callback('Could not create file.');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basdir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        callback(err, data);
    });
};

// exports module
module.exports = lib;