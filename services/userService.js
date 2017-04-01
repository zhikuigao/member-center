const security = require('../security'),
    utilities = require('../bin/utilities'),
    deviceService = require('../services/deviceService'),
    redisService = require('../services/redisService'),
    sequenceService = require('../services/sequenceService'),
    roleService = require('../services/roleService'),
    { User, Sequence, UserDomain, Role, RoleCategory } = require('../dao/mktIndex'),
    //{ UserDomain, Sequence } = require('../dao/mktIndex'),
    regExps = require('../bin/regExps'),
    configuration = require('../configuration.json'),
    { mailRegExp, pwdRegExp, phoneRegExp } = require('../bin/regExps'),
    errors = require('../errors');



const isValid = function(id) {
    // check first if undefined
    if (!id) {
        return false;
    }
    // check if id is a valid string
    if (typeof id !== 'string') {
        id = id.toString();
    }
    // simply match the id from regular expression
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
    } else {
        return false;
    }
};

/**
 * 登录
 *
 * @param mail
 * @param password
 * @param phoneNum
 * @param ip
 * @param equipmentId
 * @param equipment
 * @returns {*}
 */
function* signIn({ userName, applicationType, mail, password, phoneNum, ip, equipmentId, equipment }) {
    // console.log(userName, applicationType, mail, password, phoneNum);
    if (!mail && !phoneNum && !userName) errors.throwLackParameters();
    if (!password || !applicationType) errors.throwLackParameters();
    password = security.sign(password);
    let user, updateInfo = {
        lastLoginDate: new Date,
        lastLoginIp: ip
    };
    if (userName) { //新增
        user = yield User.signIn({ isSuperAdmin: true, superAdminUserName: userName, password });
    } else {
        user = yield User.signIn(mail ? { mail, password } : { phoneNum, password });
    }

    if (!user) errors.throwAccountOrPwdError();
    if (user.state != 'normal') errors.throwUserIsBaned();

    if (!user.isSuperAdmin) { //新增
        let rights = yield roleService.getUserRights(user.id, 'service');
        // console.log(rights, applicationType);
        if (!rights.includes(applicationType)) errors.throwNotExistAuthority(rights, applicationType);
    }

    if (equipmentId && "unknow" !== equipmentId) {
        let { deviceList = new Array } = user;
        let index = deviceList.findIndex(device => device.id == equipmentId),
            device;
        if (-1 === index) {
            device = deviceService.newDevice({ equipmentId, equipment });
            device["isLogin"] = true;
            deviceList.unshift(device);
        } else {
            deviceList[index].count = deviceList[index].count + 1;
            let d = deviceList[0];
            deviceList[0] = deviceList[index];
            deviceList[index] = d;
        }
        updateInfo["deviceList"] = deviceList;
        user.deviceList = deviceList;
    }
    let { avatar } = user;
    user.avatar = avatar ? process.env.sourceHost + "/preview/" + avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`;
    yield * User.updateById(user.id, {
        $set: updateInfo
    });
    return user;
};

/**

/**
 * 用户域登录
 *
 * @param userDomain
 * @param userName
 * @param ip
 * @param equipmentId
 * @param equipment
 * @param language
 * @returns {*}
 */
function* signInDomain({ mail, applicationType, password, ip, equipmentId, equipment }) {
    if (!mail) errors.throwLackParameters();
    if (mail && !mailRegExp.test(mail)) errors.throwEmailFormatMismatch();
    let __user = yield queryUser(mail),
        deviceList = [];

    if (!__user) { //用户不存在 注册
        let defaultRole = yield roleService.getDefaultRole();
        let roleId = defaultRole.toObject()._id.toString();

        if (equipmentId) deviceList.push(deviceService.newDevice({ equipmentId, equipment }));
        __user = new User({ deviceList, mail });
        __user.password = security.sign(password);
        __user.id = yield sequenceService.next("user");
        __user.roles = [roleId]; //角色
        yield User.create(__user);
    }

    return yield signIn({ mail, applicationType, password, ip, equipmentId, equipment });
};


/**
 * 修改用户的设备列表
 *
 * @param userId    　用户ｉｄ
 * @param deviceList　设备列表
 */
function* reviseDeviceList(userId, { deviceList }) {
    if (!deviceList || !userId) errors.throwLackParameters();
    yield * User.updateById(userId, {
        $set: {
            deviceList
        }
    });
};

/**
 * 根据标识查询用户
 *
 * @param to
 * @returns {*}
 */
function* queryUser(to) {
    let queryCondition;
    if (mailRegExp.test(to)) queryCondition = { mail: to };
    if (phoneRegExp.test(to)) queryCondition = { phoneNum: to };
    if (!queryCondition) errors.throwUnsupportedId();
    return yield User.findOne(queryCondition);
};


/**
 * 注册
 *
 * @param user
 * @returns {{code: number}}
 */
function* signUp({ verificationCode, mail, password, phoneNum, equipmentId, equipment }) {
    if (!verificationCode || !password) errors.throwLackParameters();

    if (mail && !mailRegExp.test(mail)) errors.throwEmailFormatMismatch();
    if (phoneNum && !phoneRegExp.test(phoneNum)) errors.throwPhoneNumberFormatMismatch();
    if (!pwdRegExp.test(password)) errors.throwPwdFormatMismatch();
    let defaultRole = yield roleService.getDefaultRole();
    let roleId = defaultRole.toObject()._id.toString();

    let __user, key = mail || phoneNum,
        ver = yield redisService.get(key),
        deviceList = new Array;

    if (!ver) errors.throwVerificationCodeError();
    if (verificationCode !== ver.code) errors.throwVerificationCodeError();
    __user = yield queryUser(key);
    if (__user) errors.throwUserExist();
    if (equipmentId) deviceList.push(deviceService.newDevice({ equipmentId, equipment }));
    __user = new User({ deviceList, mail, phoneNum });
    __user.password = security.sign(password);
    __user.id = yield sequenceService.next("user");
    __user.roles = [roleId]; //角色
    yield User.create(__user);
    yield * redisService.del(key);

    return __user;
};

/**
 * 获取个人信息
 *
 * @param userId
 */
function* personalInfo({ userId },u) {
    if (!userId) errors.throwLackParameters();
    let user='';
        if(isValid(userId)){
            user = yield User.findOne({_id:userId,mode:configuration.mode});
        }
        else{
            user = yield User.findOne({id:parseInt(+userId),mode:configuration.mode});
        }
    if (!user) errors.throwUserNotExist();
    let {
        nickname,
        phoneNum,
        mail,
        job,
        company,
        synopsis,
        target,
        avatar,
        gender,
        contribution,
        joinDate = new Date,
        lastLoginDate = new Date,
        third,
        name,
        department,
        roles,
        isSuperAdmin
    } = user;
    let username='' ,usertype='' ,company_id ='';
    if(configuration.mode === "A"){
        if (!third)
            avatar = avatar ? process.env.sourceHost + "/preview/" + avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`;
    }else if(configuration.mode === "B"){
        avatar = avatar ? process.env.sourceHost + "/preview/" + avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`;
    }

    return {
        userId,
        nickname,
        phoneNum,
        mail,
        job,
        contribution,
        gender,
        company,
        synopsis,
        target,
        joinDate: joinDate.toLocaleString(),
        lastLoginDate: lastLoginDate ? lastLoginDate.toLocaleString() : (new Date).toLocaleString(),
        avatar,
        name,
        department,
        roles,
        isSuperAdmin,
        username,
        usertype,
        company_id
    };
};

/**
 * 修改个人基本信息
 *
 * @param userId
 * @param params
 */
function* reviseMy(userId, { nickname, gender, company, synopsis, job, name, department }) {
    if (!userId) errors.throwLackParameters();
    let user = yield User.findById(userId),
        updateInfo = {
            nickname: nickname || user.nickname,
            gender: gender || user.gender,
            company: company || user.company,
            synopsis: synopsis || user.synopsis,
            job: job || user.job,
            name: name || user.name,
            department: department || user.department
        };
    if (gender && "M" !== gender && "F" !== gender) updateInfo.gender = null;
    yield User.updateById(userId, {
        $set: updateInfo
    });
    return updateInfo;
};

/**
 * 绑定邮箱／手机号
 *
 * @param userId
 * @param to
 */
function* bindingTo(userId, { to }) {
    let user = yield queryUser(to),
        key;
    if (user) errors.throwUserExist();
    user = yield User.findById(userId);
    if (mailRegExp.test(to)) key = "mail";
    if (phoneRegExp.test(to)) key = "phoneNum";
    if (user[key]) errors.throwBindError();
    yield * User.updateById(userId, {
        $set: {
            [key]: to
        }
    });
};

/**
 * 找回密码
 *
 * @param userId
 * @param newPassword
 * @returns {*}
 */
function* retrievePassword(userId, newPassword) {
    if (!userId) errors.throwLackParameters();
    if (!pwdRegExp.test(newPassword)) errors.throwPwdFormatMismatch();
    newPassword = security.sign(newPassword);
    return yield User.updateById(userId, {
        $set: {
            password: newPassword
        }
    });
}

/**
 * 修改密码
 *
 * @param userId
 * @param oldpw
 * @param newPassword
 */
function* revisePwd(userId, { oldpw, newPassword }) {
    oldpw = security.sign(oldpw);
    let user = yield User.findOne({ id: userId, password: oldpw });
    if (!user) errors.throwValidationFail();
    yield retrievePassword(userId, newPassword);
};

/**
 * 修改用户头像
 *
 * @param userId
 * @param savePath
 * @param fileName
 * @param mimeType
 */
function* reviseAvatar(userId, { savePath, fileName, mimeType }) {
    if (!savePath) errors.throwLackParameters();
    yield User.updateById(userId, {
        $set: {
            avatar: {
                savePath,
                fileName,
                mimeType
            }
        }
    });
};

function userListHandler() {
    this.map(subscriber => {
        subscriber.avatar = subscriber.avatar ? process.env.sourceHost + "/preview/" + subscriber.avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`;
        subscriber.contribution = subscriber.contribution || 0;
        subscriber.apps = subscriber.appList ? subscriber.appList.length : 0;
        subscriber.target = subscriber.target || [];
        delete subscriber.appList;
    });
};

function* adminPerspective({ order, pageNum, page }) {
    try {
        if ("string" === typeof pageNum) pageNum = Number.parseInt(pageNum);
        if ("string" === typeof page) page = Number.parseInt(page);
    } catch (error) {
        pageNum = 100;
        page = 1;
    }
    order = order === "time" ? "joinDate" : "lastLoginDate";
    let result = yield User.findUserList({}, pageNum, page, order);
    userListHandler.call(result);
    return result;
};

function* banned({ userId }) {
    if (!userId) errors.throwLackParameters();
    let user = yield User.findById(userId);
    if (!user) errors.throwUserNotExist();
    if (user.isSuperAdmin) errors.throwUnsupportedControlSupperAdmin();

    return yield User.updateById(userId, {
        $set: {
            state: "banned"
        }
    });
};

/**
 * 重置密码(管理员)
 * @param {[type]} userIds       [description]
 * @param {[type]} newPassword   [description]
 */
function* restPasswords(userIds, newPassword) {
    if(configuration.mode == 'A'){
        if (!Array.isArray(userIds)) errors.throwLackParameters();
        newPassword = security.sign(newPassword);

        return yield User.update({ _id: { $in: userIds } }, { $set: { password: newPassword } }, { multi: true });
    }else if(configuration.mode == 'B'){
        //let { userId, request,deviceMateToken } = this;
        //let body = {};
        //body.old_password = request.body.oldpw;
        //body.password = newPassword;
        //yield deviceMate.changePasword(deviceMateToken,userId,body);
        return ;
    }

}

/**
 * 更新用户信息
 * @param {[type]} userId        [description]
 * @param {[type]} newUser       [description]
 */
function* updateUser(userId, { name, department, roles }) {
    if (!userId) errors.throwLackParameters();
    if (!name && !department && !roles) errors.throwLackParameters();
    if (roles && (!Array.isArray(roles) || 0 === roles.length)) errors.throwUserRoleNotExist();
    let user = '';
    if(isValid(userId)){
         user = yield User.findOne({_id:userId,mode:configuration.mode});
        if (!user) errors.throwUserNotExist();
        yield User.updateById(userId, {
            $set: {
                name: name,
                department: department,
                roles: roles
            }
        })
    }else{
        user = yield User.findOne({id:+userId,mode:configuration.mode});
        if (!user) errors.throwUserNotExist();
        yield User.updat({id:+userId}, {
            $set: {
                name: name,
                department: department,
                roles: roles
            }
        })
    }

    if (!user) errors.throwUserNotExist();

   ;
}

/**
 * 创建用户
 * @yield {[type]} [description]
 */
function* createUser({ mail, phoneNum, password, name, department, roles, equipmentId, equipment }) {
    if (!mail && !phoneNum) errors.throwLackParameters();
    if (!password) errors.throwLackParameters();
    if (mail && !mailRegExp.test(mail)) errors.throwEmailFormatMismatch();
    if (phoneNum && !phoneRegExp.test(phoneNum)) errors.throwPhoneNumberFormatMismatch();
    if (!roles || !Array.isArray(roles) || 0 === roles.length) errors.throwUserRoleNotExist();

    let key = mail || phoneNum,
        deviceList = [],
        __user = yield queryUser(key);

    if (__user) {
        __user.state === 'banned' && errors.throwUserIsBaned();
        __user.state === 'normal' && errors.throwUserExist();
    }
    if (equipmentId) deviceList.push(deviceService.newDevice({ equipmentId, equipment }));
    __user = new User({ deviceList, mail, phoneNum, name, department, roles });
    __user.mode = 'B';
    __user.password = security.sign(password);
    __user.id = yield sequenceService.next("user");
    return yield User.create(__user);
}

/**
 * 查询用户集合(去除排序)
 * @param {String} options.order          [description]
 * @param {Number} options.pageNum        [description]
 * @param {Number} options.page           [description]
 * @param {[type]} options.roleCategoryId [description]
 * @param {[type]} options.username       [description]
 */
function* searchUsers({ order = 'time', pageNum = 10, page = 1, roleCategoryId, username }) {
    pageNum = +pageNum;
    page = +page;
    console.time('search');

    /*
        以下代码待修改
     */

    let result, condition;
    if(configuration.mode == "A")
    {
        condition = { state: 'normal'};
        if (username) condition['$or'] = [{ phoneNum: { $regex: username, $options: 'i' } }, { mail: { $regex: username, $options: 'i' } }];
    }else{
        condition = { state: 'normal' ,mode:'B'};
    }

    let users = yield User.find(condition);

    if (roleCategoryId) {
        let roles = yield Role.find({ roleCategoryId });
        let rolesIds = roles.map(r => r._id.toString());

        users = users.filter(u => {
            return u.roles.some(r => {
                return rolesIds.includes(r);
            });
        });
    }

    let __users = yield utilities.pagination(users, { pageNum, page, order: { 'joinDate': -1 } });

    let data = [];
    for (__u of __users.data) {
        let roleCategories = [];
        let cateIds = [];
        for (rId of __u.roles) {
            let __role = yield Role.findById(rId);
            if (!cateIds.includes(__role.roleCategoryId.toString())) {
                cateIds.push(__role.roleCategoryId.toString());
                let __cate = yield RoleCategory.findById(__role.roleCategoryId);
                roleCategories.push(__cate.name);
            }
        }
        if (__u.isSuperAdmin) roleCategories.push('超级管理员');
        data.push({
            _id: __u._id,
            name: __u.name,
            department: __u.department,
            phoneNum: __u.phoneNum,
            mail: __u.mail,
            isSuperAdmin: __u.isSuperAdmin,
            superAdminUserName: __u.superAdminUserName,
            avatar: __u.avatar ? process.env.sourceHost + "/preview/" + __u.avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`,
            roleCategories
        });
    }

    result = {
        count: __users.count,
        pageCount: __users.pageCount,
        data
    };

    console.timeEnd('search');
    return result;


    // let query = User.searchUsers({ roleCategoryId, username });
    // pageNum = +pageNum;
    // page = +page;
    // let result = yield utilities.pagination(query, { pageNum, page, order: { 'joinDate': -1 } });
    // return result;
    // 
}


/**
 * 查询用户集合(去除排序) --- 重构
 * @param {String} options.order          [description]
 * @param {Number} options.pageNum        [description]
 * @param {Number} options.page           [description]
 * @param {[type]} options.roleCategoryId [description]
 * @param {[type]} options.username       [description]
 */
function* searchUsersTest({ order = 'time', pageNum = 10, page = 1, roleCategoryId, username }) {
    pageNum = +pageNum;
    page = +page;


    // let query = User.searchUsers({ roleCategoryId, username });
    // pageNum = +pageNum;
    // page = +page;
    // let result = yield utilities.pagination(query, { pageNum, page, order: { 'joinDate': -1 } });
    // return result;
    return {};
}

function* updateApplicationModules(userId,appKey,components){
   let user = yield User.findOne({id:userId});
    let appList = user.appList;
   for(let i = 0;i < appList.length;i++){
       if(appList[i]._id.toString() === appKey){
           console.log(appList[i]._id.toString());
           appList[i].modules = components;
       }
   }
    user.appList = appList;
    try{
        yield User.update({id:userId},{$set:{appList:appList}})
        return '';
    }catch(err){
        console.log(err);
        return err;
    }
}

function* getApplicationModules(userId,appKey){
    let user = yield User.findOne({id:userId});
    let appList = user.appList;
    let modules = appList.map(item =>{
       if(item._id.toString() == appKey) {
           return item.modules;
       }
    });
    return modules[0];
}

function* deviceMateSign(userInfo,equipmentId,equipment,applicationType){
    let user = yield User.findOne({id:userInfo.user.id});let u = {};
    if(!user){
        let deviceList = [];
        let defaultRole = yield roleService.getDefaultRole();
        let roleId = defaultRole.toObject()._id.toString();
        if(userInfo.user.id >99999)
            userInfo.user.id = Number(userInfo.user.id + configuration.id);
        if (equipmentId) deviceList.push(deviceService.newDevice({ equipmentId, equipment }));
        u = yield User.create({id:userInfo.user.id,name:userInfo.user.username,deviceList:deviceList,roles:[roleId],mode:'B'});
        userInfo = {};
        userInfo.avatar = `${process.env.sourceHost}/images/weipiaoer.png`;
        userInfo.deviceList = deviceList;
        userInfo._id = u._id;
        userInfo.id = u.id;
        userInfo.isSuperAdmin = u.isSuperAdmin;
        userInfo.department = u.department;
        userInfo.mail = u.mail;
        userInfo.name = u.name;
        userInfo.nickname = u.nickname;
        userInfo.state = u.state;
        userInfo.phoneNum = u.phoneNum;

    }else{
        if (user.state != 'normal') errors.throwUserIsBaned();
        if (!user.isSuperAdmin) { //新增
            let rights = yield roleService.getUserRights(user.id, 'service');
            if (!rights.includes(applicationType)) errors.throwNotExistAuthority(rights, applicationType);
        }
        userInfo = {};
        userInfo.deviceList = user.deviceList;
        userInfo._id = user._id;
        userInfo.id = user.id;
        userInfo.isSuperAdmin = user.isSuperAdmin;
        userInfo.department = user.department;
        userInfo.mail = user.mail;
        userInfo.phoneNum = user.phoneNum;
        userInfo.name = user.name;
        userInfo.nickname = user.nickname;
        userInfo.state = user.state;
        userInfo.avatar = user.avatar ? process.env.sourceHost + "/preview/" + user.avatar.savePath : `${process.env.sourceHost}/images/weipiaoer.png`;
    }

    return userInfo;
}
module.exports = {
    signIn,
    reviseDeviceList,
    signInDomain,
    queryUser,
    signUp,
    personalInfo,
    reviseMy,
    bindingTo,
    revisePwd,
    reviseAvatar,
    retrievePassword,
    adminPerspective,
    banned,
    restPasswords,
    updateUser,
    createUser,
    searchUsers,
    searchUsersTest,
    updateApplicationModules,
    getApplicationModules,
    deviceMateSign
};
