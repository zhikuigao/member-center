const userService = require('../services/userService'),
    redisService = require('../services/redisService'),
    { domain } = require('../configuration'),
    configuration = require('../configuration'),
    deviceMate = require('../interceptors/deviceMate.js'),
    errors = require('../errors');
let mode = configuration.mode;
let thirdServerUrl = configuration.thirdServer;
function* signIn(next) {
    let applicationType = this.headers.type;
    if ('A' === mode) {
        let { request, requestIp, equipmentId, equipment } = this, params = request.body;
        Object.assign(params, {
            ip: requestIp,
            equipmentId,
            equipment,
            applicationType
        });
        let user = yield userService.signIn(params);
        this.userId = user.id;
        this.deviceList = user.deviceList;
        this.option = "signIn";
        let token = this.sign(user.id);
        delete user.deviceList;
        yield * this.setSession(user, token);
        delete user.secret;
        this.body = this.success({token, user,mode:'A'});
    }
    else if ('B' === mode) {
        let {request,requestIp, equipmentId, equipment} = this, params = request.body;
        let body = {username: params.account || params.mail || params.phoneNum || params.userName , password: params.password};
        let deviceMateUrl = thirdServerUrl.deviceMate + thirdServerUrl.login;
        let userInfo = yield deviceMate.thirdServer('', 'post', deviceMateUrl, body);
        if (userInfo.success == true) {
            let user = yield  userService.deviceMateSign(userInfo, equipmentId, equipment, applicationType);
            this.userId = userInfo.user.id;
            this.deviceList = user.deviceList;
            this.option = "signIn";
            this.deviceMateToken = userInfo.token;
            user.token = userInfo.token;
            delete user.deviceList;
            let token = this.sign(userInfo.user.id  );

            yield * this.setSession(user, token);
            //delete user.secret;
            this.body = this.success({token: token, user:user,mode:'B'});
        } else {
            errors.throwAccountOrPwdError();
        }
    }


    return yield next;
};

function* signInDomain(next) {
    let applicationType = this.headers.type;
    let { request, requestIp, equipmentId, equipment } = this, params = request.body;
    Object.assign(params, {
        ip: requestIp,
        equipmentId,
        equipment,
        applicationType
    });
    params.password = domain.password;
    let user = yield userService.signInDomain(params);
    this.userId = user.id;
    this.deviceList = user.deviceList;
    this.option = "signIn";
    let token = this.sign(user.id);
    delete user.deviceList;
    yield * this.setSession(user, token);
    delete user.secret;
    this.body = this.success({token, user});
    return yield next;

};

function* validateLogon(next) {
    this.body = this.success();
    return yield next;
};

function* signOut(next) {
    if(configuration.mode == 'B'){
        let deviceMateUrl = thirdServerUrl.deviceMate + thirdServerUrl.logOut;
        let ret = yield deviceMate.delToken(this.deviceMateToken);
        console.log(ret);
    }
    yield this.cancel();
    this.body = this.success();
    return yield next;
};

function* signUp(next) {
    let { request, requestIp, equipmentId, equipment } = this, params = request.body;
    Object.assign(params, {
        ip: requestIp,
        equipmentId,
        equipment
    });
    yield * userService.signUp(params);
    this.body = this.success();
    return yield next;
};

function* retrievePwd(next) {
    let { request, requestIp } = this;
    let { newPassword } = request.body || {}, { ei } = request.header, object;
    object = yield redisService.get(ei);
    if (!object || !object.auth) errors.throwOauthError();
    if (requestIp !== object.ip) errors.throwExistsRisk();
    yield * userService.retrievePassword(object.userId, newPassword);
    yield * redisService.del(ei);
    this.body = this.success();

    return yield next;
};

module.exports = {signIn, validateLogon, signOut, signUp, retrievePwd, signInDomain};
