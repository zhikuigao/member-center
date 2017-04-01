const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = conn => {
    /**
     *  角色分类
     */
    let roleCategorySchema = new Schema({
        //角色分类名称
        name: { type: String, default: null },
        //类型 mate/developer/administrator
        type: { type: String, default: null }

    }, { versionKey: false });

    let RoleCategory = conn.model('roleCategory', roleCategorySchema, 'roleCategory');

    return RoleCategory;
};
