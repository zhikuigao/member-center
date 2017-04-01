const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const [signInCallbackObject, userListCallbackObject] = [{
    userDomain: 1,
    userName: 1,
    id:1
}, {
    userDomain: 1,
    userName: 1,
    id:1
}];


//待加入monngoose
const isValid = function(id) {
    // check first if undefined
    if (!id) {
        return false;
    }
    // check if id is a valid string
    if (typeof id !== 'string') {
        id = id.toString();
    }
    // simply match the id from regular expression
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
    } else {
        return false;
    }
};


module.exports = conn => {
    /**
     *  用户(非严格模式验证)
     */
    let userDomainSchema = new Schema({
        //
        userDomain: { type: String, required: true },
        //
        userName: { type: String ,required: true},
        //
        password: { type: String, required: true },
        //
        id: { type: Number, required: true },
        //状态 normal/banned
        state: { type: String, default: 'normal' }

    }, { versionKey: false, strict: false });

    userDomainSchema.statics.signIn = function*(filter) {
        return yield UserDomain.findOne(filter, signInCallbackObject);
    };

    userDomainSchema.statics.updateById = function*(userId, newUser) {
        if (isValid(userId)) {
            return yield UserDomain.update({ _id: userId }, newUser);
        } else {
            return yield UserDomain.update({ id: +userId }, newUser);
        }
    };

    userDomainSchema.statics.findById = function*(userId) {
        if (isValid(userId)) {
            return yield UserDomain.findOne({ _id: userId });
        } else {
            return yield UserDomain.findOne({ id: +userId });
        }
    };

    let UserDomain = conn.model('userDomain', userDomainSchema, 'userDomain');

    return UserDomain;
};
