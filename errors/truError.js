/**!
 * cynomys.jwis.cn - errors/truError.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

module.exports = class extends Error {
    constructor(msg, code) {
        super(msg);
        this.code = code;
    }
};