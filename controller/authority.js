const roleService = require('../services/roleService'),
    appService = require('../services/appService'),
    userService = require('../services/userService'),
    utilities = require('../bin/utilities'),
    errors = require('../errors'),
    authEnum = require('../serviceAuth');
function* getMyAppAuths(next) {
    let rightIds = yield roleService.getUserRights(this.userId);
    let uniqueApps = rightIds.map(app => {
        return {
            type: 'app',
            id: app
        };
    }); //app排重
    this.body = this.success(uniqueApps);

    return yield next;
}



function* validateService(next) {
    let { type, _id } = this.headers;
    let userId = this.userId;
    if (!type) errors.throwMissAuthHeaders();

    let url = this.query.uri;
    // console.log(url);
    if (authEnum[type]) { // 访问 非app网元
        let arr = authEnum[type];
        let flag = false;
        for(let i = 0;i < arr.length;i++){
            let serviceReg = new RegExp(arr[i]);
            if (serviceReg.test(url)){
                flag = true;
                break;
            }
        }
        if(!flag) errors.throwNotExistAuthority();
        //let serviceReg = new RegExp(authEnum[type]);
        //console.log(serviceReg);
        //if (!serviceReg.test(url)) errors.throwNotExistAuthority();
        this.body = this.success({ userId });

    } else if ('app' === type) { //app网元
        let user = yield userService.personalInfo({ userId });
                if (!user.isSuperAdmin) {
                    if (!_id) errors.throwMissAuthHeaders();
                    let app = yield appService.getApp(_id);
                    let rightIds = yield roleService.getUserRights(this.userId);
                    //app归属权限
                    app = app.toObject();
                    if (!rightIds.some(id => id === app.appId)) errors.throwNotExistAuthority();
                    // console.log(app, app.appId, rightIds);

                    if (!app.privileges || !app.privileges.httpservices) errors.throwNotExistAuthority();
                    let httpservices = app.privileges.httpservices;
                    //app服务访问权限
                    let isExistAuth = false;
                    for (sv of httpservices) {
                        let svReg = new RegExp(sv);
                        if (svReg.test(url)) {
                            isExistAuth = true;
                            break;
                        }
            }
            if (!isExistAuth) errors.throwNotExistAuthority();
        }
        this.body = this.success({ userId });
    } else {
        errors.throwUnsupportedAuthHeaders();
    }

    return yield next;
}

module.exports = {
    getMyAppAuths,
    validateService
};
