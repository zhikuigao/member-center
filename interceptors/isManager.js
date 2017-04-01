const userService = require('../services/userService'),
    roleService = require('../services/roleService'),
    errors = require('../errors');

module.exports = function*(next) {
    let userId = this.userId;
    let user = yield userService.personalInfo({ userId });
    if (!user.isSuperAdmin) {
        let rights = yield roleService.getUserRights(userId, 'service');
        if (!rights.includes('tru.manage')) errors.throwOauthError();
    }
    return yield next;
};
