/**!
 * cynomys.jwis.cn - interceptors/securityCheck.js - 已修改
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const errors = require(path.resolve(__dirname, "..", "errors"));
const urlRegex = /^\/api\/.*/;

/**
 * 设备甄别
 *
 * @param ua            http设备信息
 * @param equipmentId   设备token
 * @returns {boolean}   是否是非法设备
 */
function securityCheck({browser,os} = ua, equipmentId = "unknow") {
    if ("unknow" === equipmentId) {
        if (!browser || !os) return true;    //  确认为非法设备
        if (!browser.name || !browser.version) {
            if (!os.name || !os.version) return true;
        }
    }
    return false;
};

function specialChannel(self) {
  const url = self['request']['url'];
  return urlRegex.test(url);
}

module.exports = function* (next) {
    if (this.error || specialChannel(this)) return yield next;
    try {
        let {equipment, equipmentId} = this;
        if (securityCheck(equipment, equipmentId)) errors.throwIllegalEquipment();
        if (!equipment) errors.throwLackParameters();
        let {browser, os, device} = equipment;
        let type = device.type || equipmentId ? "PC" : "browser";
        this.R = {
            browser, type,
            id: equipmentId,
            name: os.name || device.model,
            version: os.version,
            count: 0
        };
        if (!this.R.name) errors.throwIllegalEquipment();
    } catch (error) {
        this.error = error;
    }

    return yield next;
};
