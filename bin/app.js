const koa = require('koa'),
    maxrequests = require('koa-maxrequests'),
    middlewares = require('koa-middlewares'),
    cors = require("kcors"),
    registRouter = require('./router'),
    notFound = require('./not_found'),
    session = require('../interceptors/session'),
    check = require('../interceptors/securityCheck'),
    error = require('./error'),
    logger = require('./logger'),
    config = require('../configuration');

let app = new koa();

app.name = "cynomy_mkt_json"; // 应用名

app.use(maxrequests());
middlewares.jsonp(app);
app.use(session);
app.use(check);

app.proxy = true;
app.use(middlewares.bodyParser({ jsonLimit: config.jsonLimit }));

app.use(cors());

// app.use(cors({
//     allowMethods: 'GET,HEAD'
// }));

// if (config.enableCompress) {
//     app.use(middlewares.compress({ threshold: 150 }));
// }
app.use(middlewares.conditional());
app.use(middlewares.etag());

//路由错误
app.use(error);

/**
 * Routes
 */
let router = middlewares.router();
registRouter(router);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(notFound);

/**
 * Error handler
 */
app.on('error', (err, ctx) => {
    console.log('app error', err);
    err.url = err.url || ctx.request.url;
    logger.error(err);
});

module.exports = app;
