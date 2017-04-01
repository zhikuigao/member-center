/**!
 * cynomys.jwis.cn - services/deviceService.js
 *
 * Copyright(c) afterloe. - 已修改
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const [errors] = [require(path.resolve(__dirname, "..", "errors"))];

function newDevice({ equipmentId, equipment }) {
    if (!equipment) errors.throwLackParameters();
    let { browser, os, device } = equipment;
    let type = device.type || equipmentId ? "PC" : "browser";
    return {
        browser,
        type,
        id: equipmentId,
        name: os.name,
        version: os.version,
        count: 0
    };
};

module.exports = {
    newDevice
};
