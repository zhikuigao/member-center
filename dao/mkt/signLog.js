const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = conn => {
    /**
     * 登入登出
     */
    let signLogSchema = new Schema({
        //用户编号
        user: { type: String, required: true },
        //
        date: { type: Date, required: true },
        //
        ip: { type: String },
        //
        equipment:{},
        //
        equipmentId: { type: String },

        option: { type: String }

    }, { versionKey: false });

    let SignLog = conn.model('signLog', signLogSchema, 'signLog');

    return SignLog;
};