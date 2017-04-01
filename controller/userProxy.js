const errors = require('../errors'),
    userProxyServer = require('../services/userProxyServer');

function* adminUser(next) {
    let { userId, request } = this;
    let data = request.query;
    if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.findSubsysUser(data,userId);
    this.body = this.success(result);
    return yield next;
}
function *userMapping(next){
    let { userId, request } = this;
    let data = request.body;
    if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.batchInsertData(data,userId);
    this.body = this.success(result);
    return yield next;
}

function *updateSubsystem(next){
    let { userId, request } = this;
    let data = request.body;
    if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.updateSubsystem(data,userId,this.header);
    this.body = this.success(result);
    return yield next;
}
function *deleteSubsystem(next){

    let { userId, request } = this;
    let data = request.body;
    if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.deleteSubsystem(data,userId);
    this.body = this.success(result);
    return yield next;
}
function *account(next){
    let { userId, request } = this;
    let data = request.body.data;
    if(!Object.keys(data).length) throw errors.LackParameters();
    yield userProxyServer.updateAccount(data,userId);
    this.body = this.success();
    return yield next;
}
function* userInfo(next) {
    let { userId, request } = this;
    let data = request.query;
    //if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.findSubsysUserInfo(data,userId);
    this.body = this.success(result);
    return yield next;
}
function* getSystemList(next){
    let {userId,request} = this;
    let data = request.body;
    if(!Object.keys(data).length) throw errors.LackParameters();
    let result = yield userProxyServer.getSystemList(data,userId);
    this.body = this.success(result);
    return yield next;
}
module.exports = {
    userInfo,userMapping,updateSubsystem,deleteSubsystem,account,adminUser,getSystemList
};