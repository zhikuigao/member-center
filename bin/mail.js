/**!
 * cynomys.jwis.cn - bin/mail.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const [nodemailer, utility, os, path, fs] = [require('nodemailer'), require('utility'), require('os'), require("path"), require("fs")];
const config = require(path.join(__dirname, "..", "configuration"));

let {administration = new Object} = config;
let {appName, mailSender, smtpConfig} = administration;


if (mailSender.auth) {
    smtpConfig = mailSender;
} else {
    smtpConfig = {
        enable: mailSender.enable,
        host: mailSender.host,
        port: mailSender.port,
        secure: mailSender.secure || mailSender.ssl,
        debug: mailSender.debug,
        auth: mailSender.auth
    };
}

let transport;

/**
 * Send notice email with mail level and appName.
 *
 * @param {String|Array} to, email or email list.
 * @param {String} level, e.g.: 'log, warn, error'.
 * @param {String} subject
 * @param {String} html
 * @param {Function(err, result)} callback
 */
exports.notice = function sendLogMail(to, level, subject, html, callback) {
    callback = callback || utility.noop;
    subject = '[' + appName + '] [' + level + '] [' + os.hostname() + '] ' + subject;//标题
    html = String(html);//html内容
    if (mailSender.enable === false) {
        console.log('[send mail debug] [%s] to: %s, subject: %s\n%s', Date(), to, subject, html);
        return callback();
    }

    exports.send(to, subject, html.replace(/\n/g, '<br/>'), callback);
};

let LEVELS = ['log', 'warn', 'error'];
LEVELS.map(level => {
    exports[level] = function (to, subject, html, callback) {
        exports.notice(to, level, subject, html, callback);
    };
});

/*
 * Send register email
 *
 * @param to
 * @param code
 */

function replaceX(str) {
    var tempStr = "";
    str = str.replace(/(..)(.+)(@)/g, function ($1, $2, $3, $4) {
        for (var i = $3.length - 1; i >= 0; i--) {
            tempStr += "*";
        }
        return $2 + tempStr + $4;
    });
    return str;
};

/*
 * Send email -- promise.
 *
 * @param {String|Array} to, email or email list.
 * @param {String} subject
 * @param {String} html
 * @param {Function(err, result)} callback
 */
exports.sendPromise = function (to, subject, html) {
    return new Promise((resolve, reject) => {
        if (!transport) transport = nodemailer.createTransport(smtpConfig);
        let message = {
            from: mailSender.from || mailSender.sender,
            to: to,
            subject: subject,
            html: html
        };

        transport.sendMail(message, (err, result) => {
            if (err) reject(err);
            console.log("%s sender mail to %s success", new Date, to);
            resolve();
        });
    });
};

/*
 * Send email -- callback.
 *
 * @param {String|Array} to, email or email list.
 * @param {String} subject
 * @param {String} html
 * @param {Function(err, result)} callback
 */
exports.send = function (to, subject, html, callback) {
    callback = callback || utility.noop;

    if (!transport) transport = nodemailer.createTransport(smtpConfig);

    let message = {
        from: mailSender.from || mailSender.sender,//发送者邮箱
        to: to,//接受者邮箱
        subject: subject,//邮箱主题
        html: html//html内容
    };

    transport.sendMail(message, (err, result) => {
        if (err)
            console.log(err.stack);
        console.log("%s sender mail to %s success", new Date, to);
        callback(err, result);
    });

};