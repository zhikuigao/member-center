const path = require('path'),
    redisService = require('../services/redisService'),
    errors = require('../errors');

module.exports = function*(next) {
    let { to, code } = this.params, { ei } = this.request.header, user, value;
    if (!ei) errors.throwIllegalEquipment();
    code = code.toUpperCase();
    value = yield redisService.get(ei);
    console.log(code, '----', value);

    if (!value || value['picCode'] !== code) errors.throwValidationFail();
    yield * redisService.del(ei);
    this.body = this.success();

    return yield next;
};
