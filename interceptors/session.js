/**!
 * cynomys.jwis.cn - interceptors/session.js - 已修改
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const bin = path.resolve(__dirname, "..", "bin");
const [security, key, redisService, parser, utilities, errors] = [require(path.join(__dirname, "..", "security")), "cynomys-sig", require(path.join(__dirname, "..", "services", "redisService")),
    require(path.resolve(bin, "uaParser")), require(path.resolve(bin, "utilities")), require(path.resolve(__dirname, "..", "errors"))];
const configuration = require('../configuration.json');
function parseLanguage(header) {
    let language = header.language;

    try {
        if (!language) language = header["accept-language"];
        language = language.split(";")[0];
        let co = language.split(",");
        language = co.find(c => "en-US" == c);
        if (!language) throw new Error();
    } catch (error) {
        language = "zh-CN";
    }
    return language;
};

module.exports = function* (next) {
    let [start, cookie, requestIp = "0.0.0.0", header] = [new Date, this.cookies.get(key), this.request.ip, this.request.header],
        { ei = "unknow", token} = header;
    this.requestIp = requestIp; // 绑定请求Ip到 this对象上
    this.language = parseLanguage(header); // 绑定语言
    this.equipment = parser(header["user-agent"]); // 绑定设备属性到 this对象上
    this.equipmentId = ei; //绑定设备Id 到设备上
    if (!cookie) cookie = token;

    this.token = cookie;
    this.success = (ctx) => ({
        code: 0,
        error: null,
        result: ctx
    });

    this.fail = (msg, code) => ({
        code: code || 1,
        error: msg || "System error",
        result: null
    });

    this.cancel = function* () {
        let [, equipmentId, userId] = security.decipher(cookie).split(":"); // 解构 设备id,用户id,ip
        if (equipmentId !== this.equipmentId) errors.throwSessionError();
        yield redisService.del(`${equipmentId}:${userId}`);
        this.cookies.set(key, requestIp);
    };

    this.getSession = function* (__token) {
        try {
			if(__token)
				cookie = __token;
                let [secret, equipmentId, userId] = security.decipher(cookie).split(":"); // 解构 设备id,用户id,ip
                if (equipmentId !== this.equipmentId) errors.throwSessionError();
                let session = yield redisService.get(`${equipmentId}:${userId}`);
                if (session.secret !== secret) errors.throwSessionError();
                delete session.secret;
                session.cookie = cookie;
                return session;
        } catch (error) {
            return null;
        }
    };


    //this.getSession = function* () {
    //    try {
    //        let [equipmentId,userId] = security.decipher(cookie).split(":"); // 解构 设备id,用户id,ip
    //        if (equipmentId !== this.equipmentId) throw new Error("session Error, Please signIn");
    //        return yield redisService.get(`${equipmentId}:${userId}`);
    //    } catch (error) {
    //        return null;
    //    }
    //};


    this.reSetSession = function* (value) {
        let [secret, equipmentId, userId] = security.decipher(cookie).split(":"); // 解构 设备id,用户id,ip
        if (equipmentId !== this.equipmentId) errors.throwSessionError();
        let session = yield redisService.get(`${equipmentId}:${userId}`);
        if (session.secret !== secret) errors.throwSessionError();
        Object.assign(session, value);
        return yield redisService.set(`${equipmentId}:${userId}`, session);
    };

    this.setSession = function* (seems, token = cookie) {
        let [secret, equipmentId, userId] = security.decipher(token).split(":");

        if (equipmentId !== this.equipmentId) errors.throwSessionError();
        console.log('---------------------',equipmentId,userId);
        seems.secret = secret;
        return yield redisService.set(`${equipmentId}:${userId}`, seems);
    };

    this.sign = function (userId) {
        cookie = security.cipher(`${utilities.randomCode(15)}:${this.equipmentId}:${userId}`);
        this.cookies.set(key, cookie);
        return cookie;
    };

    yield next;

    console.log("[%s][%s] %s %s - %s ms", new Date().toLocaleString(), requestIp, this.method, this.url, new Date - start);
};
