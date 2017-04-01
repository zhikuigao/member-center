const path = require('path');
const mkdirp = require('mkdirp');
const bunyan = require('bunyan');

let loggerPath = process.env.zkLogDir || path.join(process.env.HOME, ".tru", "user", "zklog");
mkdirp.sync(loggerPath);

module.exports = bunyan.createLogger({
    name: 'myprofile',
    streams: [{
        type: 'rotating-file',
        path: path.resolve(loggerPath, 'info.log'),
        period: '1d',
        count: 10
    }, {
        level: 'error',
        path: path.resolve(loggerPath, 'error.log')
    }]
});
