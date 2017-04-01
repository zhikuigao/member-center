/**!
 * cynomys.jwis.cn - bin/logger.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const [debug, formater, Logger, utility, util, os, path] = [require('debug')('cynomys.jwis.cn:logger'), require('error-formater'), require('mini-logger'), require('utility'), require('util'), require('os'), require("path")];
const [config, isTEST, mail, passError] = [require(path.join(__dirname, "..", "configuration")), process.env.NODE_ENV === 'test',
    require(path.join(__dirname, "mail")), ["write ECANCELED", "read ECONNRESET", "write ECONNRESET", "failed to decode", "write EPIPE"]];
let {logDir = process.env.logDir} = config, to = new Array;

function errorFormater(err) {
    let msg = formater.both(err);
    mail.error(to, msg.json.name, msg.text);
    return msg.text;
};

for (let user of config.admins) {
    if (user.mail)
        to.push(user.mail);
}

let logger = Logger({
    dir: logDir,
    duration: '1d',
    format: '[{category}.]YYYY-MM-DD[.log]',
    stdout: config.debug && !isTEST,
    errorFormater: errorFormater,
    seperator: os.EOL
});

let logger_error = logger.error;

/**
 * 拓展Logger对象的error方法，AOP执行前织入
 *
 * @param args 传入对象
 */
logger.error = function (...args) {
    let [err] = args;
    let msg = formater.both(err);
    if (!passError.find(e => e == err.message)) {
        console.log(err.message);
        mail.error(to, msg.json.name, msg.text);
        return logger_error.apply(logger, args);
    }
};

module.exports = logger;