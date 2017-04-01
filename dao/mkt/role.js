const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = conn => {

    let toObjectId = mongoose.Types.ObjectId;

    /**
     *  角色
     */
    let roleSchema = new Schema({
        //角色名
        name: { type: String, required: true },
        //身份 mate/appDeveloper/serviceDeveloper/appAdministrator/systemAdministrator
        identity: { type: String, enum: ['mate', 'appDeveloper', 'serviceDeveloper', 'appAdministrator', 'systemAdministrator'], default: 'mate' },
        //角色说明 
        description: { type: String, default: null },
        //类型 平台角色platform/自定义角色custom
        type: { type: String, enum: ['platform', 'custom'], default: 'custom' },
        //权限 如：{"id" : "tru.mytask","type" : "app"}
        rights: [],
        //角色分类id
        roleCategoryId: { type: Schema.Types.ObjectId, ref: 'roleCategory', required: true },
        //是否有效 false为已删除
        isValid: { type: Boolean, default: true },
        //该角色的处理人
        handlerId: { type: Schema.Types.ObjectId, ref: 'user', default: null },

    }, { versionKey: false, timestamps: true });

    roleSchema.statics.saveRole = function*(newRole) {
        if (newRole.handlerId) newRole.handlerId = toObjectId(newRole.handlerId);
        if (newRole.roleCategoryId) newRole.roleCategoryId = toObjectId(newRole.roleCategoryId);

        return yield Role.create(newRole);
    };

    roleSchema.statics.findById = function*(id) {
        // id = toObjectId(id);

        return yield Role.findOne({ _id: id });
    };


    roleSchema.statics.updateById = function*(id, newRole) {
        if (newRole.handlerId) newRole.handlerId = toObjectId(newRole.handlerId);
        if (newRole.roleCategoryId) newRole.roleCategoryId = toObjectId(newRole.roleCategoryId);
        // id = toObjectId(id);

        return yield Role.update({ _id: id }, { $set: newRole });
    };

    let Role = conn.model('role', roleSchema, 'role');

    return Role;
};
