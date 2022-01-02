/**
 * Title: Environments Set up
 * Description: Place The environment variable here
 * Author: Md Abdullah al Mamun (Ratul)
 * Date: 9th December, 2021
 * 
 */

// application scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: '38fh3gnn3pdkKdf03',
    maxChecks: 5
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: '9j3jv0jdflKDJf0wkjf',
    maxChecks: 5
};

// Choose the current environment based on run command
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' 
                        ? process.env.NODE_ENV 
                        : 'staging';

// export environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object'
                        ? environments[currentEnvironment] 
                        : environments.staging;

// exports module
module.exports = environmentToExport;