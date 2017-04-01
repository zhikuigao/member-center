const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

module.exports = conn => {

    let infoSchema = new Schema({
        _id: Number,
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    let subsystemsSchema = new Schema({
        _id: Number,
        name: String,
        info: infoSchema
    });
    let schema = new Schema({
        mktUser: { type: Number },
        phone: {
            type: String
        },
        email: {
            type: String
        },
        userId: {
            type: String
        },
        subsystems: [subsystemsSchema]

    }, { versionKey: false, timestamps: true });
    schema.plugin(autoIncrement.plugin, 'userMapping');
    return conn.model('userMapping', schema);
};
