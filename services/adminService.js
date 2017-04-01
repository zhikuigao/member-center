/**
 * cynomys.jwis.cn - services/adminService.js - 已修改
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path"),
    { mailRegExp, phoneRegExp } = require('../bin/regExps');

let adminGroup;

function initAdminGroup(__admins) {
    if (!__admins) __admins = require("../configuration").admins;
    adminGroup = new Array;
    for (let user of __admins) {
        if (user.mail || user.phoneNum)
            adminGroup.push(user);
    }
};

function determineAdmin(to) {
    let flag;
    if (mailRegExp.test(to)) flag = adminGroup.find(admin => admin["mail"] === to);
    if (phoneRegExp.test(to)) flag = adminGroup.find(admin => admin["phoneNum"] === to);
    return flag ? true : false;
};

initAdminGroup();

module.exports = {
    determineAdmin,
    initAdminGroup
};
