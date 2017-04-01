const userService = require('../services/userService'),
      uploadService = require('../services/uploadService'),
      appService = require('../services/appService'),
    configuration = require('../configuration.json'),
    deviceMate = require('../interceptors/deviceMate.js'),
    errors = require('../errors');

function* my(next) {

    if(configuration.mode === 'A'){
        let { userId } = this;
        let user = yield userService.personalInfo({ userId });
        this.body = this.success(user);
    }else if(configuration.mode === 'B'){
        let {deviceMateToken,userId} = this;
        let u = yield deviceMate.getDeviceMateUserInfo(deviceMateToken,userId);
        let user = yield userService.personalInfo({ userId },u);
        this.body = this.success(user);
    }
};

function* reviseMy(next) {
    let { userId, request } = this;
    yield userService.reviseMy(userId, request.body);
    this.body = this.success();
    return yield next;
};

function* bindingTo(next) {
    let { userId, request } = this;
    yield userService.bindingTo(userId, request.body);
    this.body = this.success();
    return yield next;
};

function* revisePwd(next) {
    if(configuration.mode === "A"){
        let { userId, request } = this;
        yield userService.revisePwd(userId, request.body);
        this.body = this.success();
    }else if(configuration.mode === "B"){
        let { userId, request,deviceMateToken } = this;
        let body = {};
        body.old_password = request.body.oldpw;
        body.password = request.body.newPassword;
        let ret = yield deviceMate.changePasword(deviceMateToken,userId,body);
        if(ret.success == true){
            this.body = this.success();
        }else{
            errors.throwOldPwdError();
        }

    }

    return yield next;
};

function* reviseAvatar(next) {
    let { avatar } = yield uploadService.upload.call(this, 'avatar');
    if (!avatar) errors.throwLackParameters();
    yield userService.reviseAvatar(this.userId, avatar);
    let newAvatar = process.env.sourceHost + "/preview/" + avatar.savePath;
    yield this.reSetSession({ avatar: newAvatar });
    this.body = this.success(newAvatar);
    return yield next;
};


function* applicationModules(next){
    try{
        let { userId,request} = this;
        let {appKey,components} = request.body;
        if(!appKey || !components.length) throw errors.LackParameters();
        let ret  = yield userService.updateApplicationModules(userId,appKey,components);
        this.body = this.success(ret);
    }catch(err){
        this.body = this.fail(err);
    }
}

function* getApplicationModules(next){
    let {userId,request} = this;
    let {appKey} = this.params;
    if(!appKey) throw errors.LackParameters();
    let ret = yield userService.getApplicationModules(userId,appKey);
    this.body = this.success(ret || []);
}
module.exports = { my, reviseMy, bindingTo, revisePwd, reviseAvatar ,applicationModules,getApplicationModules};
