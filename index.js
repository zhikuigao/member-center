const http = require('http'),
    path = require('path'),
    config = require('./configuration'),
    mkdirp = require("mkdirp"),
    co = require('co'),
    createZnode = require('./znode/index'),
    sequenceService = require('./services/sequenceService');

let { port = 10050, bindHost = "127.0.0.1" } = config.server;
let {
    dataDir = path.join(process.env.HOME, ".tru", "mkt", "data"),
        logDir = path.join(process.env.HOME, ".tru", "user", "log"),
         zkLogDir = path.join(process.env.HOME, ".tru", "user", "zklog"),
        sourceHost = `http://${os.hostname}:10080`,
        hostName = `https://${os.hostname}:10070`,
        APIName = `https://${os.hostname}:10060`
} = config;

process.env.dataDir = dataDir;
process.env.logDir = logDir;
process.env.zkLogDir = zkLogDir;

process.env.sourceHost = sourceHost;
process.env.hostName = hostName;
process.env.apiName = APIName;

co(function*() {
    let sequence = yield [
        sequenceService.createSequence({ sequence: "user", step: 1, start: 100000 })
    ];
    return sequence;
}).then(() => {}, (err) => {
    console.log('warning : sequence init error', err);
});

mkdirp.sync(dataDir);
mkdirp.sync(logDir);

const app = require('./bin/app');
http.createServer(app.callback()).listen(port, bindHost, () => {
    let zkCfg = config.zkClient;
    let zkClient = createZnode(zkCfg.zookeeperAddress, zkCfg.zkNodeName, port);
    zkClient.connect();

    console.log("[%s]: server is running in %s:%s", new Date().toLocaleString(), bindHost, port);
});

