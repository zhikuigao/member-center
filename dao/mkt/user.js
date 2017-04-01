const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    utilities = require('../../bin/utilities');

const [signInCallbackObject, userListCallbackObject] = [{
    nickname: 1,
    id: 1,
    mail: 1,
    avatar: 1,
    deviceList: 1,
    phoneNum: 1,
    name: 1,
    department: 1,
    isSuperAdmin: 1,
    state: 1

}, {
    nickname: 1,
    id: 1,
    mail: 1,
    phoneNum: 1,
    avatar: 1,
    contribution: 1,
    appList: 1,
    target: 1
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
    let userSchema = new Schema({
        //职业
        job: { type: String, default: null },
        //公司
        company: { type: String, default: null },
        //昵称
        nickname: { type: String, required: true, default: "TRU" + utilities.randomNum(8) },
        //描述
        synopsis: { type: String, default: null },
        //年龄
        year: { type: Number, default: null },
        //性别
        gender: { type: String, default: null },
        //地区
        from: {
            province: { type: String, default: null },
            city: { type: String, default: null }
        },
        avatar: { type: Schema.Types.Mixed, default: null },
        //注册时间
        joinDate: { type: Date, default: Date.now },
        //最后登录时间
        lastLoginDate: { type: Date, default: Date.now },
        //手机
        phoneNum: { type: String },
        //邮箱
        mail: { type: String },
        //密码
        password: { type: String},
        // 对外暴露id
        id: { type: Number, required: true },
        //状态 normal/banned
        state: { type: String, default: 'normal' },
        //
        target: [],
        //app列表
        appList: [],
        //设备列表
        deviceList: [],

        //姓名
        name: { type: String, default: '' },
        //部门
        department: { type: String, default: '' },
        //角色
        roles: [],
        //是否超级管理员
        isSuperAdmin: { type: Boolean, default: false },
        //超级管理员账号
        superAdminUserName: { type: String, default: null },
        mode:{type:String,default:'A'}

    }, { versionKey: false, strict: false });

    userSchema.statics.signIn = function*(filter) {
        return yield User.findOne(filter, signInCallbackObject).lean();
    };

    userSchema.statics.updateById = function*(userId, newUser) {
        if (isValid(userId)) {
            return yield User.update({ _id: userId }, newUser);
        } else {
            return yield User.update({ id: +userId }, newUser);
        }
    };

    userSchema.statics.findById = function*(userId) {
        if (isValid(userId)) {
            return yield User.findOne({ _id: userId });
        } else {
            return yield User.findOne({ id: +userId });
        }
    };

    userSchema.statics.findUserList = function*(condition = {}, number = 100, page = 0, order = 'lastLoginDate') {
        page < 1 ? page = 0 : page--;
        return yield User.find(condition, userListCallbackObject).sort({
            [order]: -1
        }).skip(number * page).limit(number);
    };

    userSchema.statics.searchUsers = function({ roleCategoryId, username }) {
        let condition = {};
        if (roleCategoryId) condition.roleCategoryId = roleCategoryId;
        if (username) condition['$or'] = [{ phoneNum: { $regex: username, $options: 'i' } }, { mail: { $regex: username, $options: 'i' } }];

        return User.find(condition);
    };

    let User = conn.model('user', userSchema, 'user');

    return User;
};
