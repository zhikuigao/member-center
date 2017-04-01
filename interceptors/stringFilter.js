/**!
 * cynomys.jwis.cn - interceptors/session.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const path = require("path");
const utilities = require(path.resolve(__dirname, "..", "bin", "utilities"));

function filter(object = {}) {
    let filterObject = new Object;
    for (let key in object) {
        let value = object[key];
        value = "string" === typeof value ? utilities.delHtmlTag(value) : value;
        key = utilities.delHtmlTag(key);
        filterObject[key] = value;
    }
    return filterObject;
};

module.exports = function*(next) {
    let { params, request, query } = this;
    this["request"].body = filter(request.body);
    this.params = filter(params);
    this.query = filter(query);

    return yield next;
};
