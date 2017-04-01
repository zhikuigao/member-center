const url = require('url'),
    config = require('../configuration'),
    db = require('./db');

let [database = new Object(), dbUrl, conn] = [config.mktDatabase];

dbUrl = url.format({
    protocol: database.dialect + ":",
    slashes: true,
    host: `${database.host}:${database.port}`,
    port: database.port,
    pathname: database.db,
    path: database.db
});

module.exports = db.create(dbUrl);
