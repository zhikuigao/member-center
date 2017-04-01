/**!
 * cynomys.jwis.cn - interceptors/analysis.js - 已修改
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
// const { AppLog, SignLog } = require('../dao/mktIndex');
const {  SignLog } = require('../dao/mktIndex');

/**
 * 收集用户 登陆/登出 日志
 */
function* collectSignLog(next) {

    yield SignLog.create({
        user: this.userId.toString(),
        date: new Date,
        ip: this.requestIp,
        equipment: this.equipment,
        equipmentId: this.equipmentId,
        option: this.option
    });

    return yield next;
};

/**
 * 收集APP 上传/下载 日志
 */
function* collectAppLog(next) {
    // if (this.error) return yield next;

    // try {
    //     yield Dao.AppLog.collect({
    //         appId: this.appId.toString(),
    //         user: this.userId.toString(),
    //         date: new Date,
    //         ip: this.requestIp,
    //         equipment: this.equipment,
    //         equipmentId: this.equipmentId,
    //         option: this.option
    //     });
    // } catch (error) {
    //     this.error = error;
    // }

    return yield next;

};

module.exports = { collectSignLog, collectAppLog };
