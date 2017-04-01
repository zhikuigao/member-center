const userService = require('../services/userService'),
    roleService = require('../services/roleService'),
    appService = require('../services/appService'),
    { domain } = require('../configuration'),
    errors = require('../errors');

// function* subscribers(next) {
//     let { params } = this;
//     let subscribers = yield userService.adminPerspective(params);
//     this.body = this.success(subscribers);

//     return yield next;
// };

// function* banned(next) {
//     let { params } = this;
//     let { nModified } = yield userService.banned(params);
//     if (0 === nModified) errors.throwOperationFailed();
//     this.body = this.success();

//     return yield next;
// };

// function* subscriber(next) {
//     let { params } = this;
//     let userInfo = yield userService.personalInfo(params);
//     this.body = this.success(userInfo);

//     return yield next;
// };



function* createRole(next) {
    let params = this.request.body;
    let role = yield roleService.createRole(params, this._userId);
    this.body = this.success(role);

    return yield next;
}

function* getRole(next) {
    let params = this.params;
    let role = yield roleService.getRole(params);
    if (!role) errors.throwRoleNotExist();
    this.body = this.success(role);

    return yield next;
}

function* updateRole(next) {
    let params = this.request.body;
    let roleId = this.params.roleId;

    yield roleService.updateRole(roleId, params, this._userId);
    this.body = this.success();

    return yield next;
}

function* deleteRole(next) {
    let roleId = this.params.roleId;
    yield roleService.deleteRole(roleId);
    this.body = this.success();

    return yield next;
}

function* getValidRoles(next) {
    let roles = yield roleService.getValidRoles();
    this.body = this.success(roles);

    return yield next;
}

function* getValidCustomRoles(next) {
    let roles = yield roleService.getValidCustomRoles();
    this.body = this.success(roles);

    return yield next;
}

function* resetUsersPassword(next) {
    let params = this.request.body;
    yield userService.restPasswords(params.users, domain.password);
    this.body = this.success();

    return yield next;
}

function* getUser(next) {
    let userId = this.params.userId;
    let user = yield userService.personalInfo({ userId });
    this.body = this.success(user);

    return yield next;
}

function* updateUser(next) {
    let params = this.request.body;
    let userId = this.params.userId;
    yield userService.updateUser(userId, params);
    this.body = this.success();

    return yield next;
}

function* createUser(next) {
    let { request, requestIp, equipmentId, equipment } = this, params = request.body;
    Object.assign(params, {
        ip: requestIp,
        equipmentId,
        equipment
    });
    params.password = domain.password;
    let user = yield * userService.createUser(params);

    this.body = this.success();
    return yield next;
}

function* deleteUser(next) {
    let userId = this.params.userId;
    yield userService.banned({ userId });
    this.body = this.success();

    return yield next;
}

function* getRoleCategories(next) {
    let categories = yield roleService.getRoleCategories();
    this.body = this.success(categories);

    return yield next;
}

function* getValidUsers(next) {
    let params = this.query;
    let users = yield userService.searchUsers(params);
    this.body = this.success(users);

    return yield next;
}

function* getValidUsersTest(next) {
    let params = this.query;
    let users = yield userService.searchUsersTest(params);
    this.body = this.success(users);

    return yield next;
}

function* getValidApps(next) {
    let keyword = this.query.keyword;
    let apps = yield appService.getDistinctApps({ keyword });
    this.body = this.success(apps);

    return yield next;
}

function* getMateRoleCategory(next) {
    let type = this.params.type;
    let category = yield roleService.getMateRoleCategory(type);
    this.body = this.success(category);

    return yield next;
}

module.exports = {
    // subscribers,
    // banned,
    // subscriber
    createRole,
    getRole,
    updateRole,
    deleteRole,
    getValidRoles,
    getValidCustomRoles,
    resetUsersPassword,
    getUser,
    updateUser,
    createUser,
    deleteUser,
    getRoleCategories,
    getValidUsers,
    getValidUsersTest,
    getValidApps,
    getMateRoleCategory
};
