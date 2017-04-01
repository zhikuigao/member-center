const { common, userProxy, personal, vVerificationCode, vSecurityCode, manager, authority, information } = require('../controller'),
    validateLogon = require('../interceptors/oauth2mkt'),
    SSO = require('../interceptors/singleSignOn'),
    analysis = require('../interceptors/analysis'), //- unfinished
    filter = require('../interceptors/stringFilter'),
    isManager = require('../interceptors/isManager');

module.exports = app => {
    /* ---- 用户 ---- */

    // 登录 - done - [待修改] 超级管理员+系统区分
    app.put('/user/signIn', common.signIn, SSO, analysis.collectSignLog);
    // 域登录 - done
    app.put('/user/signInDomain', common.signInDomain, analysis.collectSignLog);
    // 校验TOKEN 是否有效 - done 
    app.get("/user/validateLogon", validateLogon, common.validateLogon);
    // 注销 - done
    app.put("/user/signOut", validateLogon, common.signOut);
    // 注册 - done 
    app.post("/user/signUp", common.signUp);
    // 个人中心 - done
    app.get("/user/personal", validateLogon, personal.my);
    // 个人 -- 获取个人信息 - done
    app.get("/personal/my", validateLogon, personal.my);
    // 个人 -- 修改个人信息 - done
    app.put("/personal/my", validateLogon, filter, personal.reviseMy);
    // 个人 -- 绑定邮箱或者手机号 - done - 不需要验证码?
    app.put("/personal/binding", validateLogon, personal.bindingTo);
    // 个人 -- 修改密码 -done
    app.put("/personal/revise/password", validateLogon, personal.revisePwd);
    // 个人 -- 修改头像 -done
    app.post("/personal/revise/avatar", validateLogon, personal.reviseAvatar);
    app.put("/personal/applicationModules",validateLogon,personal.applicationModules);//修改个人依赖的模块（组件）
    app.get("/personal/applocationModules/:appKey",validateLogon,personal.getApplicationModules);//获取个人依赖的模块（组件）
    // 找回密码 -done
    app.put("/user/retrieve", common.retrievePwd);

    //----------目前缺失角色验证

    // 管理模式 - 新增角色 - 2.1
    app.post("/manager/role", validateLogon, isManager, manager.createRole);
    // 管理模式 - 获取角色信息 - 2.2
    app.get("/manager/role/:roleId", validateLogon, isManager, manager.getRole);
    // 管理模式 - 设置角色信息 - 2.3
    app.put("/manager/role/:roleId", validateLogon, isManager, manager.updateRole);
    // 管理模式 - 删除角色 - 2.4 
    app.delete("/manager/role/:roleId", validateLogon, isManager, manager.deleteRole);


    // 管理模式 - 获取角色集合 - 2.5
    app.get("/manager/roles", validateLogon, isManager, manager.getValidRoles);
    // // 管理模式 - 获取自定义角色集合 - 2.13
    app.get("/manager/roles/custom", validateLogon, isManager, manager.getValidCustomRoles);


    // 管理模式 - 获取用户集合 - 2.7
    app.get("/manager/users", validateLogon, isManager, manager.getValidUsers);
    // 管理模式 - 获取用户集合 - 2.7 ----- 用于重构2.7 未完成
    app.get("/manager/userstest", manager.getValidUsersTest);
    // 管理模式 - 重置用户集合密码 - 2.10
    app.put("/manager/users/password", validateLogon, isManager, manager.resetUsersPassword);


    // 管理模式 - 获取用户 - 2.14 
    app.get("/manager/user/:userId", validateLogon, isManager, manager.getUser);
    // 管理模式 - 设置用户信息及角色 - 2.6
    app.put("/manager/user/:userId/roles", validateLogon, isManager, manager.updateUser);
    // 管理模式 - 新增用户 - 2.8
    app.post("/manager/user", validateLogon, isManager, manager.createUser);
    // 管理模式 - 删除用户 - 2.9 
    app.delete("/manager/user/:userId", validateLogon, isManager, manager.deleteUser);

    // 管理模式 - 获取appid集合 - 2.11
    app.get("/manager/apps", validateLogon, isManager, manager.getValidApps);
    // 管理模式 - 获取角色分类集合 - 2.12
    app.get("/manager/roleCategories", validateLogon, isManager, manager.getRoleCategories);
    // 管理模式 - 获取角色分类集合 - 文档未定义
    app.get("/manager/roleCategory/:type", validateLogon, isManager, manager.getMateRoleCategory);


    // 服务访问权限 - 3.1
    app.get("/authority/right/validate", validateLogon, authority.validateService);
    // app访问权限 - 3.2
    app.get("/authority/apps", validateLogon, authority.getMyAppAuths);



    // 获取默认角色 注册前访问 - 文档未定义
    app.get('/information/role/:identity', information.getIdentityRole);
    // service访问权限 - 文档未定义
    app.get("/information/rights/services/:userId", information.getMyServiceAuths);

    /* ---- 验证 ---- */

    // pc - 校验图片验证码 - 改密 - done
    app.get("/security/auth/:to/:code", vVerificationCode);

    app.get("/security/vSecurityCode/:code", vSecurityCode.pc); // 校验安全码 - 授权
    // 校验安全码 - 授权 - 常用 -done
    app.get("/security/vSecurityCode/:to/:code", vSecurityCode.terminal);


    //获取子系统信息（给管理员用）
    app.get('/subsystem/adminUser', validateLogon,userProxy.adminUser);
    //获取子系统信息（给客户用）
    app.get('/subsystem/user',validateLogon, userProxy.userInfo);
    //批量导入用户和子系统的用户名密码信息
    app.post('/subsystem/userMapping', validateLogon,userProxy.userMapping);
    //更改子系统的信息
    app.put('/subsystem/updateSubsystem',validateLogon,userProxy.updateSubsystem);
    //删除子系统信息
    app.delete('/subsystem/deleteSubsystem',validateLogon, userProxy.deleteSubsystem);

    app.post('/subsystem/list',validateLogon,userProxy.getSystemList);

    //更新手机号、mate账号、email
    // app.put('/subsystem/account', userProxy.account);

    // app.get("/", function* (next) {
    //     let self = this;
    //     if (self.error)
    //         self.body = self.fail(self.error.message, 500);
    //     else
    //         this.body = this.success({
    //             server: "tru.jwis.cn",
    //             auth: "afterloe",
    //             mail: "afterloeliu@jwis.cn",
    //             qq: "60728727@qq.com",
    //             language: self.language,
    //             appName: "cynomy_market"
    //         });
    //     return yield next;
    // });
};
