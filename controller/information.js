 const roleService = require('../services/roleService');

 function* getIdentityRole(next) {
     let identity = this.params.identity;
     let role = yield roleService.getIdentityRole(identity);
     this.body = this.success(role);

     return yield next;
 }

 function* getMyServiceAuths(next) {
     let userId = this.params.userId;
     let rightIds = yield roleService.getUserRights(userId, 'service');
     this.body = this.success(rightIds);

     return yield next;
 }


 module.exports = {
     getIdentityRole,
     getMyServiceAuths
 };
