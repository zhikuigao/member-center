 const logger = require('./logger');

 function* error(next) {

     let errResponse = err => {
         let { messageCode } = err;
         err.url = err.url || this.request.url;

         if (messageCode) { //系统handle的错误
             err.message = messageCode;
             delete err.messageCode;
         }
         //非handle错误
         this.body = this.fail(err.message, err.code);
         logger.error(err);
     };

     if (this.error) errResponse(this.error); //兼容mkt原路由前置中间件
     try {
         yield next;
     } catch (err) {
         errResponse(err); //业务错误
     };
 };

 module.exports = error;
