const zookeeper = require('node-zookeeper-client');
const os = require('os');
const CreateMode = zookeeper.CreateMode;
const co = require('co');
const logger = require('./logger');
const ip = require('ip');

let currentHostIp = (function() {

    return ip.address();
    // let ifaces = os.networkInterfaces();
    // let address = '';

    // Object.keys(ifaces).forEach(function(ifname) {
    //     var alias = 0;

    //     ifaces[ifname].forEach(function(iface) {
    //         if ('IPv4' !== iface.family || iface.internal !== false) {
    //             // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    //             return;
    //         }

    //         if (alias >= 1) {
    //             // this single interface has multiple ipv4 addresses
    //         } else {
    //             // this interface has only one ipv4 adress
    //             address = iface.address;
    //         }
    //         ++alias;
    //     });
    // });

    // return address;
})();

let isNodeExist = function(client, path) {
    return new Promise((resolve, reject) => {
        client.exists(path, function(error, stat) {
            error ? reject(error) : resolve(stat ? true : false);
        });
    });
};

let createNode = function(client, path, nodeMode, data) {
    return new Promise((resolve, reject) => {
        client.create(path, data, nodeMode, function(error, path) {
            error ? reject(error) : resolve();
        });
    });
};

let removeNode = function(client, path) {
    return new Promise((resolve, reject) => {
        client.remove(path, -1, function(error) {
            error ? reject(error) : resolve();
        });
    });
};

module.exports = function(zookeeperAddress, zkNodeName, port) {
    let client = zookeeper.createClient(zookeeperAddress);
    let paths = `/service/${zkNodeName}/servers/server-/`;

    const data = {
        mode: 'product',
        product: {
            ip: currentHostIp,
            port: port,
            path: '/'
        }
    };
    client.once('connected', function() {
        co(function*() {
            let regex = /\//g,
                result;
            let lastSlashIndex = paths.lastIndexOf('/');

            while ((result = regex.exec(paths))) {
                // 忽略掉根目录
                if (result.index == 0) continue;

                let nodeMode, nodeData = new Buffer('');
                if (result.index != lastSlashIndex) {
                    nodeMode = CreateMode.PERSISTENT;
                } else {
                    nodeMode = CreateMode.EPHEMERAL_SEQUENTIAL;
                    nodeData = new Buffer(JSON.stringify(data));
                }

                let nodePath = paths.substring(0, result.index);
                let isExist = yield isNodeExist(client, nodePath);

                if (!isExist) {
                    yield createNode(client, nodePath, nodeMode, nodeData);
                }
            }
        }).catch(err => {
            err.url = err.url || 'zookeeper connection error' + zookeeperAddress;
            logger.error('zookeeper connection error: ', err);
            console.log('zookeeper connection error: ', err);
        });
    });

    return client;
};
