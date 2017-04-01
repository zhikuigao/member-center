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

const path = require("path"),
    { Sequence } = require("../dao/mktIndex"),
    errors = require('../errors');

function* createSequence({ sequence, step = 1, start = 0 }) {
    if (!sequence) errors.throwLackParameters();
    let flag = yield Sequence.findOne({ sequence }),
        __sequence;
    if (!flag) yield Sequence.create({ sequence, step, start, value: start });
};

function* next(sequence) {
    if (!sequence) errors.throwLackParameters();
    let __sequence = yield Sequence.findOne({ sequence });
    if (!__sequence) errors.throwNotExistsSequence();
    let { step, value, maxValue, minValue } = __sequence;
    value += step;
    if ("n" !== maxValue && value > maxValue) errors.throwExceedMaximum();
    if (value < minValue) errors.throwExceedMinimum();
    yield Sequence.update({ sequence }, { $set: { value } });
    return value;
};

module.exports = {
    createSequence,
    next
};
