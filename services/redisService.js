/**!
 * cynomys.jwis.cn - services/sessionService.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

const [redis, path] = [require("redis"), require("path")];
const [config, security] = [require(path.join(__dirname, "..", "configuration")), require(path.join(__dirname, "..", "security"))];

const {timeout = 60 * 60 * 24 * 2,host = process.env.REDIS_PORT_6379_TCP_ADDR, port = process.env.REDIS_PORT_6379_TCP_PORT} = config.signServer;

// 惰性链接 -- 只有在redis使用的时候才开始调用链接
let redisClient;

/**
 * 获取redis连接
 */
function connectionServer() {
    redisClient = redis.createClient(port, host);//连接服务器
};

/**
 * 判断key 是否存在于redis中
 *
 * @param key
 * @returns {*}
 */
function* has(key) {
    if (!key) return;
    if (!redisClient)
        connectionServer();
    return yield redisClient.exists.bind(redisClient, key);
};

/**
 * 根据key来从redis中获取信息
 *
 * @param key
 * @returns {*}
 */
function* get(key) {
    if (!key) return;
    if (!redisClient)
        connectionServer();
    let str = yield redisClient.get.bind(redisClient, key);
    return JSON.parse(str);
};

/**
 * 根据key来从redis中删除信息
 *
 * @param key
 * @returns {*}
 */
function* del(key) {
    if (!key) return;
    if (!redisClient)
        connectionServer();
    return yield redisClient.del.bind(redisClient, key);
};

/**
 * 将key 和 value存入redis
 *
 * @param key
 * @param seems
 * @returns {*}
 */
function* set(key, seems, _timeout = timeout) {
    if (!key || !seems) return;
    if (!redisClient)
        connectionServer();
    // 如果传入的value是 对象的话 就使用JSON方法将对象转化为字符串
    if (seems instanceof Object)
        seems = JSON.stringify(seems);
    let val = yield redisClient.set.bind(redisClient, key, seems); // 设置key-value
    yield redisClient.expire.bind(redisClient, key, _timeout); // 设置超时时间
    return val;
};

module.exports = {has, get, del, set};