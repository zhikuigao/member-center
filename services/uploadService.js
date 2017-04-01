const utilities = require('../bin/utilities'),
    path = require('path'),
    parse = require('co-busboy'),
    fs = require('fs');

function* upload(...filesFilter) {
    let fields = parse(this.req, { autoFields: true }),
        field, info = {};

    while (field = yield fields) {
        if (Array.isArray(field)) {
            let [name, value] = field;
            info[name] = value;
        } else {
            let { fieldname, filename, mimeType } = field;
            if (filesFilter.every(k => k != fieldname)) {
                field.resume();
                continue;
            }
            let streamName = path.join(process.env.dataDir, utilities.uuidCode() + path.extname(filename));
            info[fieldname] = {
                savePath: path.basename(streamName),
                fileName: filename,
                mimeType: mimeType
            };
            let stream = fs.createWriteStream(streamName);
            field.pipe(stream);
        }
    }
    return info;
}

module.exports = { upload };
