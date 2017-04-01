/**
 * Created by Administrator on 2017/3/21.
 */
const request = require('request'),
    errors = require('../errors'),
    configuration = require('../configuration.json'),
    config = require('../configuration');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function* thirdServer(headers, method, uri,body) {
    let thirdServer = config.thirdServer;
    let appGaateWay = thirdServer.appGaateWay;
    let host = thirdServer.deviceMate;
    if (!thirdServer.debug) {
        //todo  先获取appgeteway的协议
        let opt = {
            url: `${appGaateWay}/protocol/search`,
            rejectUnauthorized: false,
            method: 'get'
        };
        let Result = yield requestApi(opt);
        if (Result.code != 0) {
            errors.throwThirdpartyServiceFail();
        } else {
            uri = uri.replace(uri.substr(0, host.indexOf(':')), Result.result.protocol);
        }
    } else {
        //todo 这里是本地调试的时候不走appGateWay 的url  根据自己实际的实际情况改uri
        uri = uri.replace(configuration.thirdServer.deviceMate,configuration.thirdServer["debug-deviceMate"] );
    }

    //todo 去获取xxx 的服务
    let options = {
        url: uri,
        rejectUnauthorized: false,
        method: method.toUpperCase(),
        headers: {
            'User-Agent': headers['user-agent'] || '',
            'ei': headers.ei || '',
            'token': headers.token || ''
        },
        form:body
    };

    try {
        let data = yield requestApi(options);
        if (data.code == 0) {
            return data.result;
        }else{
            return data;
        }
    } catch (err) {
        console.log(err);
        errors.throwThirdpartyServiceError();
    }

}

function requestApi(options) {
    return new Promise(function(resolve, reject) {
        console.log('-------------------------------------------------------------');
        console.log(options);
        console.log('-------------------------------------------------------------');
        request(options, function(error, response, body) { console.log('**********************************************************');
            console.log(body);
            console.log('**********************************************************');
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                resolve(info);
            } else {
                reject(error || response);
            }
        })
    })
}

function* getDeviceMateUserInfo(token,userId){
    if(userId > 99999) userId = Number (userId - config.id);
    let uri = configuration.thirdServer.deviceMate + configuration.thirdServer.getUserInfoByToken + userId + '?token=' + token;
    let user = yield thirdServer('','get',uri,'');
    return user;
}
/**
 * todo 只有在deviceMate上的userId大于9999减去，在第一次登录时写进数据库加了一个固定值，这里减去
 * @param token
 * @param userId
 * @param body
 */
function* changePasword(token,userId,body){
    if(userId > 99999) userId = Number (userId - config.id);
    let uri = configuration.thirdServer.deviceMate + configuration.thirdServer.modifyPassword + userId + '?token=' + token;
    let ret = yield thirdServer('','post',uri,body);
    return ret;
}

function* delToken(token){
    let uri = configuration.thirdServer.deviceMate + configuration.thirdServer.logOut + '?token=' +token;
    let ret = yield thirdServer('','get',uri,'');
}
module.exports = {
    thirdServer,
    requestApi,
    getDeviceMateUserInfo,
    changePasword,
    delToken
};
