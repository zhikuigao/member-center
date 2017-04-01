/**!
 * cynomys.jwis.cn - interceptors/session.js  - 已修改
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const services = path.resolve(__dirname, "..", "services");
const [redisService, userService] = [require(path.resolve(services, "redisService")), require(path.resolve(services, "userService"))];

module.exports = function*(next) {
    let { deviceList, equipmentId, userId } = this;
    let currentDevice = deviceList[0];
    for (let device of deviceList) {
        let { isLogin, id, name } = device;
        if (isLogin && name === currentDevice.name && id !== equipmentId) {
            delete device.isLoading;
            yield redisService.del(`${id}:${userId}`);
        }
    }
    yield * userService.reviseDeviceList(userId, { deviceList });

    return yield next;
};
