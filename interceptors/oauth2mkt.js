/**!
 * cynomys.jwis.cn - interceptors/oauth2mkt.js - 已修改
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
const configuration = require('../configuration.json');

function checkout_login(session) {
    if (!session || (!session['id'] && !session['_id'])) return false;
    return true;
}

module.exports = function*(next) {
    if(configuration.mode === "A"){
        let session = yield this.getSession();
        if (!checkout_login(session)) errors.throwNeedSignIn();
        this.userId = session.id || session._id;
        this._userId = session._id;
        this.mail = session.mail;
        this.phoneNum = session.phoneNum;
    }else if(configuration.mode === "B"){
        let session = yield this.getSession();
        this.userId = session.id;
        this._userId = session._id
        this.deviceMateToken = session.token;
    }


    return yield next;
};
