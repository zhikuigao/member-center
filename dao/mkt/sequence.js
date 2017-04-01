const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = conn => {
    /**
     * 序列号
     */
    let sequenceSchema = new Schema({
        //
        step: { type: Number, required: true, default: 1 },
        //
        start: { type: Number, required: true, default: 0 },
        //
        maxValue: { type: String, default: 'n' },
        //
        minValue: { type: Number, default: 0 },
        //
        sequence: { type: String, required: true },
        //
        value: { type: Number, default: 0 }

    }, { versionKey: false });

    let Sequence = conn.model('sequence', sequenceSchema, 'sequence');

    return Sequence;
};
