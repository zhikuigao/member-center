const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = conn => {

    /**
     *  app 非严格模式
     */
    let sourcechema = new Schema({


    }, { versionKey: false, strict: false });


    let Source = conn.model('sources', sourcechema, 'sources');

    return Source;
};
