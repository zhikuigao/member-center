const autoIncrement = require('mongoose-auto-increment'),
    url = require('url'),
    config = require('../configuration'),
    db = require('./db');

let [database = new Object(), dbUrl, conn] = [config.proxyDatabase];

dbUrl = url.format({
    protocol: database.dialect + ":",
    slashes: true,
    host: `${database.host}:${database.port}`,
    port: database.port,
    pathname: database.db,
    path: database.db
});

let connection = db.create(dbUrl);
autoIncrement.initialize(connection);

module.exports = connection;
