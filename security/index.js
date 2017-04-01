/**!
 * cynomys.jwis.cn - security/index.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const [crypto, path, fs] = [require("crypto"), require("path"), require("fs")];
const config = require(path.join(__dirname, "..", "configuration"));
const {outEncoding = "hex", algorithm = "des3", intEncoding = "ascii", securityKey = "cynomy_mkt"} = config.security;
const secret = "afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)";

/**
 * 加密
 *
 * @param buf
 * @returns {string}
 */
function cipher(buf) {
    let encrypted = "",
        cip = crypto.createCipher(algorithm, securityKey);
    encrypted += cip.update(buf, intEncoding, outEncoding);
    encrypted += cip.final(outEncoding);
    return encrypted;
};

/**
 * 解密
 *
 * @param encryptedBuf
 * @returns {string}
 */
function decipher(encryptedBuf) {
    let decrypted = "",
        decipher = crypto.createDecipher(algorithm, securityKey);
    decrypted += decipher.update(encryptedBuf, outEncoding, intEncoding);
    decrypted += decipher.final(intEncoding);
    return decrypted;
};

/**
 * 签名校验
 *
 * @param buf
 * @returns {*}
 */
function sign(buf) {
    const hash = crypto.createHmac('RSA-SHA512', secret)
        .update(buf)//有记忆功能，将字符串相加
        .digest('base64');//将字符串以base64格式打印出来
    return hash;
};

/**
 * 计算文件的Hash 值 - sha256
 *
 * @param path
 * @returns {Promise}
 * @constructor
 */
function hash_sha256(__path) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(__path)) reject(new Error("file is not exist"));
        let [input, hash, code] = [fs.createReadStream(__path), crypto.createHash('sha256')];
        input.pipe(hash);
        hash.on("data", chunk => code = chunk.toString("hex"));
        hash.on("end", () => resolve(code));
        hash.on("error", error => reject(error));
    });
};

module.exports = {cipher, decipher, sign, hash_sha256};