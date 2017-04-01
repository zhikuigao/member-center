/**!
 * cynomys.jwis.cn - controller/json/vSecurityCode.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path"),
    redisService = require('../services/redisService'),
    userService = require('../services/userService'),
    errors = require('../errors');

function* terminal(next) {
    let { to, code } = this.params, { ei } = this.request.header, ip = this.requestIp, object, user;
    object = yield redisService.get(to);
    if (!ei) errors.throwIllegalEquipment();
    if (!object) errors.throwOauthError();
    if (ip !== object.ip) errors.throwExistsRisk();
    if (code !== object.code) errors.throwVerificationCodeError();
    yield redisService.del(to);
    user = yield userService.queryUser(to, this.language);
    if (!user) errors.throwUserNotExist();
    object = {
        auth: "Fingerprint authentication",
        userId: user._id,
        ip
    };
    yield redisService.set(ei, object, 60 * 5);
    this.body = this.success();

    return yield next;
};

function* pc(next) {
    let { code } = this.params, { ei } = this.request.header, ip = this.requestIp, object;
    if (!ei) errors.throwIllegalEquipment();
    object = yield redisService.get(ei);
    if (!object || code !== object.securityCode) errors.throwVerificationCodeError();
    if (ip !== object.ip) errors.throwExistsRisk();
    object.auth = "Fingerprint authentication";
    object.ip = ip;
    delete object.securityCode;
    yield redisService.set(ei, object, 60 * 5);
    this.body = this.success();

    return yield next;
};

module.exports = { pc, terminal };
