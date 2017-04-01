  const { User, Role, RoleCategory } = require('../dao/mktIndex'),
      utilities = require('../bin/utilities'),
      errors = require('../errors');
    const configuration = require('../configuration.json');
    const defaultCustomRight = { type: 'service', id: 'tru.pcmate' };
    const _ = require('lodash');

  /**
   * 创建自定义角色
   * @param {[type]} role        [description]
   * @param {[type]} userId        [description]
   */
  function* createCustomRole(role, userId) {
      let defaultCategory = yield RoleCategory.findOne({ type: 'mate' });
      role.handlerId = userId;
      role.roleCategoryId = defaultCategory._id;
      role.rights.push(defaultCustomRight);
      return yield Role.saveRole(role);
  }

  /**
   * 添加角色
   * @param {[type]} options.name        [description]
   * @param {[type]} options.description [description]
   * @param {[type]} options.rights      [description]
   * @param {[type]} userId              [description]
   * @yield {[type]} [description]
   */
  function* createRole({ name, description, rights }, userId) {
      if (!name || !description) errors.throwLackParameters();
      if (!Array.isArray(rights)) errors.throwLackParameters();

      return yield createCustomRole({ name, description, rights }, userId);
  }

  /**
   * 查看角色
   * @param {[type]} options.roleId [description]
   * @yield {[type]} [description]
   */
  function* getRole({ roleId }) {
      if (!roleId) errors.throwLackParameters();
      let role = yield Role.findById(roleId);
      role.rights = role.rights.filter(r => r.type == 'app');
      return role;
  }

  /**
   * 更新角色
   * @param {[type]} roleId              [description]
   * @param {[type]} options.name        [description]
   * @param {[type]} options.description [description]
   * @param {[type]} options.rights      [description]
   * @param {[type]} userId              [description]
   */
  function* updateRole(roleId, { name, description, rights }, userId) {
      if (!roleId) errors.throwLackParameters();
      if (!name && !description && !rights) errors.throwLackParameters();
      if (!Array.isArray(rights)) errors.throwLackParameters();

      let role = {};
      if (name) role.name = name;
      if (description) role.description = description;
      if (rights) {
          rights.push(defaultCustomRight);
          role.rights = rights;
      }
      role.handlerId = userId;

      return yield Role.updateById(roleId, role);
  }

  /**
   * 删除角色
   * @param {[type]} roleId [description]
   */
  function* deleteRole(roleId) {
      if (!roleId) errors.throwLackParameters();
      let role = yield Role.findOne({ "isValid" : true, "type" : "platform", "identity" : "mate", _id: roleId});
      if(role)  errors.throwUnsupportedDeleteMate();
      let user = yield User.findOne({ roles: { $all: [roleId] } });
      if (user) errors.throwRoleIsUsed();

      return yield Role.updateById(roleId, { isValid: false });
  }

  /**
   * 所有可用角色(待修改)
   */
  function* getValidRoles() {
      // 分类角色树
      let roleCategories = yield RoleCategory.find();
      let roles = yield Role.find({ isValid: true });

      //待修改
      let result = [];
      roleCategories.forEach(c => {
          c = c.toObject();
          c.roles = [];
          roles.forEach(r => {
              r = r.toObject();
              if (r.roleCategoryId.toString() === c._id.toString()) c.roles.push(r); //{}!={}
          });
          result.push(c);
      });
      // console.log(result);

      return result;
  }

  /**
   * 获取可用自定义角色
   */
  function* getValidCustomRoles() {
      let roles = yield Role.find({"identity" : "mate","isValid" : true}).populate('handlerId');

      let result = roles.map(({ _id, name, description, type, handlerId }) => {

              let handler = handlerId ? {
                  phoneNum: handlerId.phoneNum,
                  mail: handlerId.mail,
                  name: handlerId.name,
                  department: handlerId.department,
                  superAdminUserName: handlerId.superAdminUserName,
                  isSuperAdmin: handlerId.isSuperAdmin
              } : null;

          if(configuration.mode === handlerId.mode){
              return {
                  _id:_id || '',
                  name:name || '',
                  description:description || '',
                  type:type || '',
                  handler:handler || ''
              };
          }else{
              if(type == 'platform'){
                  return {
                      _id: _id,
                      name:name || '',
                      description: description ||'',
                      type: type || '',
                      handler: handler|| ''
                  };
              }
          }

      });

      return _.compact(result);
  }

  /**
   * 获取角色分类
   */
  function* getRoleCategories() {
      return yield RoleCategory.find();
  }

  /**
   * 获取用户角色
   * @param {[type]} userId        [description]
   */
  function* getUserRole(userId) {
      let user = yield User.findById(userId);
      if (!user) errors.throwUserNotExist();
      let userRoles = yield Role.find({ _id: { $in: user.roles }, isValid: true });

      return userRoles;
  }

  /**
   * 获取权限
   * @param {[type]} userId        [description]
   * @param {String} type          [description]
   */
  function* getUserRights(userId, type = 'app') {
      let roles = yield getUserRole(userId);
      let rights = roles.map(r => r.rights);
      rights = utilities.flatten(rights); //多维数组序列化扁平数组
      let rightIds = rights.filter(rgt => rgt.type == type).map(rgt => rgt.id);
      rightIds = utilities.unique(rightIds);
      return rightIds;
  }

  /**
   * 获取默认角色
   */
  function* getDefaultRole() {
      let role = Role.findOne({ type: 'platform', identity: 'mate' });
      if (!role) errors.throwRoleNotExist();
      return role;
  }

  /**
   * 获取mate分类
   */
  function* getMateRoleCategory(type) {
      return yield RoleCategory.findOne({ type });
  }

  /**
   * 获取身份
   * @param {[type]} identity      [description]
   */
  function* getIdentityRole(identity) {
      let role;
      if (identity === 'mate') {
          role = yield getDefaultRole();
      } else {
          role = yield Role.findOne({ identity: identity });
      }

      if (!role) errors.throwRoleNotExist();
      return role;
  }

  module.exports = {
      createRole,
      getRole,
      updateRole,
      deleteRole,
      getValidRoles,
      getValidCustomRoles,
      getRoleCategories,
      getUserRole,
      getUserRights,
      getDefaultRole,
      getMateRoleCategory,
      getIdentityRole
  };
