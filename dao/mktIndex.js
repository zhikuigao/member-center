const path = require('path'),
    fs = require('fs'),
    conn = require('./mktDb');

function upperCaseFirst([first, ...rest]) {
    return first.toUpperCase() + rest.join('');
}

//加载dao模块 属性首字母大写
function loadDao(dirpath) {
    let controllers = {},
        files = fs.readdirSync(dirpath);
    for (let file of files) {
        if (path.extname(file) != '.js') continue;
        let modelName = path.basename(file, '.js');
        let filePath = path.join(dirpath, modelName);
        let module = require(filePath);
        if (typeof module !== 'function') {
            console.warn(`mktIndex Warning : ${filePath} is not included`);
            continue;
        }
        controllers[upperCaseFirst(modelName)] = require(filePath)(conn);
    }
    return controllers;
};

let dirpath = path.join(__dirname, 'mkt');
module.exports = loadDao(dirpath);
