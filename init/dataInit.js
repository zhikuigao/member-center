const co = require('co'),
    { Role, RoleCategory, User, Sequence } = require('../dao/mktIndex'),
    security = require('../security'),
    config = require('../configuration');

const username = 'superAdmin',
    password = '123456';

co(function*() {
    /*
        序号
     */
    let sequence = yield Sequence.findOne({ sequence: "user" });
    if (!sequence) {
        sequence = yield Sequence.create({ sequence: "user", step: 1, start: 100000, value: 100000 });
    }

    /*
        创建超级管理员
     */
    let supper = yield User.findOne({ isSuperAdmin: true, superAdminUserName: username });
    if (!supper) {
        let next = sequence.value + sequence.step;
        yield Sequence.update({ sequence: "user" }, { $set: { value: next } });

        let __user = {};
        __user.password = security.sign(password);
        __user.id = next;
        __user.isSuperAdmin = true;
        __user.superAdminUserName = username;
        supper = yield User.create(__user);
    }

    /*
        创建角色分类
     */
    let mateCate = yield RoleCategory.findOne({ type: 'mate' });
    if (!mateCate) mateCate = yield RoleCategory.create({ name: "普通用户", type: "mate" });

    let developerCate = yield RoleCategory.findOne({ type: 'developer' });
    if (!developerCate) developerCate = yield RoleCategory.create({ name: "开发用户", type: "developer" });

    let administratorCate = yield RoleCategory.findOne({ type: 'administrator' });
    if (!administratorCate) administratorCate = yield RoleCategory.create({ name: "管理用户", type: "administrator" });

    /*
        创建角色
     */
    function* createRole(role) {
        let flag = yield Role.findOne({ type: role.type, identity: role.identity });
        if (!flag) yield Role.create(role);
    }

    //mate用户
    function* mateRole() {
        let role = {
            name: 'mate用户',
            roleCategoryId: mateCate._id,
            handlerId: supper._id,
            rights: [{
                type: "service",
                id: "tru.pcmate"
            }, {
                type: "app",
                id: "tru.mysocial"
            }, {
                type: "app",
                id: "tru.mytask"
            }, {
                type: "app",
                id: "tru.myprofile"
            }, {
                type: "app",
                id: "tru.myprocess"
            }, {
                type: "app",
                id: "tru.mystorage"
            }],
            type: 'platform',
            description: "mate用户",
            identity: "mate"
        };

        yield createRole(role);
    }

    //app开发人员
    function* appDevelopRole() {
        let role = {
            name: '应用开发者',
            roleCategoryId: developerCate._id,
            handlerId: supper._id,
            rights: [{
                type: "service",
                id: "tru.appDevelop"
            }],
            type: 'platform',
            description: "应用开发者",
            identity: "appDeveloper"
        };
        yield createRole(role);
    }

    //服务开发者
    function* serviceDevelopRole() {
        let role = {
            name: '服务开发者',
            roleCategoryId: developerCate._id,
            handlerId: supper._id,
            rights: [],
            type: 'platform',
            description: "服务开发者",
            identity: "serviceDeveloper"
        };
        yield createRole(role);
    }

    //app管理员
    function* appAdminRole() {
        let role = {
            name: '应用管理员',
            roleCategoryId: administratorCate._id,
            handlerId: supper._id,
            rights: [{
                type: "service",
                id: "tru.appAdmin"
            }],
            type: 'platform',
            description: "应用管理员",
            identity: "appAdministrator"
        };
        yield createRole(role);
    }

    //系统管理员
    function* sysAdminRole() {
        let role = {
            name: '系统管理员',
            roleCategoryId: administratorCate._id,
            handlerId: supper._id,
            rights: [{
                type: "service",
                id: "tru.manage"
            }],
            type: 'platform',
            description: "系统管理员",
            identity: "systemAdministrator"
        };
        yield createRole(role);
    }

    yield mateRole();
    yield appDevelopRole();
    yield serviceDevelopRole();
    yield appAdminRole();
    yield sysAdminRole();

    //数据迁移部分 给原有用户添加mate角色
    function* upDefaultUserRole() {
        let dfRole = yield Role.findOne({ type: 'platform', identity: 'mate' });
        let dfRoleId = dfRole._id.toString();
        let res = yield User.update({}, { $set: { roles: [dfRoleId] } }, { multi: true });
        console.log(`up user number: ${res.nModified}`);
    }

    yield upDefaultUserRole();

}).then(() => {
    console.log('success');
    process.exit(0);
}, (err) => {
    console.log('err', err);
    process.exit(0);
});
