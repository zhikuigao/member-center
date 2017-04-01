/**!
 * cynomys.jwis.cn - errors/index.js
 *
 * Copyright(c) afterloe. -已修改
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const [mapper = {}, TruError] = [require(path.resolve(__dirname, "i18nError")), require(path.resolve(__dirname, "truError"))];

Object.keys(mapper).map(m => {
    exports[`throw${m}`] = (...args) => {
        let err = new TruError('', mapper[m]["code"]);
        err['messageCode'] = m + " " + args.join(" ");
        err['i18n'] = mapper[m];
        err['i18n']['extra'] = " " + args.join(" ");
        throw err;
    };
});

exports.equal = error => error instanceof TruError;
