 const mongoose = require('mongoose');
 // 由于 mongoose save, findOne.exec() 返回的是他们自己的 mpromise 对象，
 // 这个对象在4.0+ 版本已经不赞成使用，所以这里使用ES6自带的promise
 mongoose.Promise = global.Promise;

 let connCounts = 0;
 //待改 connect 1.延时连接而不阻塞进程 2.flag禁止多次连接
 function create(dbUrl) {
     let isConnectedBefore = false;

     let connect = function() {
         return mongoose.createConnection(dbUrl, { server: { auto_reconnect: true } });
     };

     let disconnectedCallback = function() {
         console.log('lost mongodb connection...', dbUrl);
         // if (!isConnectedBefore) //启动重连一次
         //     connect();
     };

     conn = connect();

     conn.on('error', function(err) {
         console.log('could not connect to mongodb', dbUrl);
     });

     conn.on('reconnected', function() {
         console.log('reconnected to mongodb', dbUrl);
     });

     conn.on('disconnected', disconnectedCallback);

     conn.on('connected', function() {
         isConnectedBefore = true;
         console.log('connection established to mongodb', dbUrl);
     });

     // // 进程退出 关闭连接
     // process.once('SIGINT', function() {
     //     conn.removeListener('disconnected', disconnectedCallback); //清除重连
     //     console.log('connect closing... ', dbUrl);
     //     conn.close(function() {
     //         console.log('connect closed ', dbUrl);
     //         connCounts--;
     //         if (!(connCounts > 0)) {
     //             console.log('process exit');
     //             process.exit(0);
     //         }
     //     });
     // });
     connCounts++; //用于关闭连接
     return conn;
 }

 module.exports = {
     create
 };
