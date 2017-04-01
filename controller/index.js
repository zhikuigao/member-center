const fs = require('fs'),
    path = require('path');

let controllers = {};

let files = fs.readdirSync(__dirname);
for (let file of files) {
    if ('index.js' === file || path.extname(file) != '.js') continue;
    let filePath = path.join(__dirname, file);
    let ctrlname = path.basename(file, '.js');
    controllers[ctrlname] = require(filePath);
}

module.exports = controllers;
