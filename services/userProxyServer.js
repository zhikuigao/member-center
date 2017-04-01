const { User } = require('../dao/mktIndex'), { UserMapping } = require('../dao/proxyIndex'),
    regExps = require('../bin/regExps'),
    errors = require('../errors');
const config = require('../configuration.json');
const request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/**
 * 查找子系统用户
 * @param {Objext} body        [description]
 * @return {如果用户传电话或邮箱，就用电话，邮箱去更改，如果没有，就去session中取userId}
 */
function* findSubsysUser(data,uesrId) {
    if(!data.phone&&!data.email){
        user = yield UserMapping.find({userId:uesrId}).select(' -updatedAt -userId -phone -createdAt  -_id').exec();
        if(!user.length) errors.throwUserMapNotExist();
        if(data.system){
            let ret = user[0].subsystems;
            user.subsystems =  ret.filter(r =>{
                return  r.name == data.system;
            });
            return user;
        }else{
            return user;
        }
    }else{
        return user = yield UserMapping.find({$or:[{phoneNum:data.phone?data.phone:''},{email:data.email?data.email:''}]}).select(' -updatedAt -userId -phone -createdAt  -_id').exec();
    }
}
/**
 * 批量导入数据
 * @param {Objext} data        [用户和子系统组合的json]
 * @return {*}
 */
function* batchInsertData(data,userId){
    let result = [];
    for(let i = 0;i < data.length;i++){
        try{
            let user = yield User.findOne({$or:[{phoneNum:data[i].phone?data[i].phone:''},{mail:data[i].email?data[i].email:''}]}).exec();
            if(!user) {
                result.push(`${data[i].phone ? data[i].phone : data[i].email} 导入${data[i].system}失败,请先注册tru_mate`);
                continue;
            }
            let userMap = null;
            userMap = yield UserMapping.findOne({userId:user.id}).exec();
            let subSystem = [];
            if(userMap&&userMap.subsystems ){
                subSystem = userMap.subsystems ;
                let count = 0;
                for(let j = 0;j < subSystem.length;j++){
                    if(subSystem[j].name == data[i].system){
                        // result.push(`导入${data[i].system}失败 ,${data[i].system}已经存在${data[i].phone ? data[i].phone : data[i].email}`);
                        //return result;
                        subSystem[j].info.username = data[i].username;
                        subSystem[j].info.password = data[i].password;
                        count ++;
                    }
                }
                if(count === 0){
                    subSystem.push({name:data[i].system,info:{username:data[i].username,password:data[i].password}});
                }
            }else{
                subSystem.push({name:data[i].system,info:{username:data[i].username,password:data[i].password}});
            } //如果这个人存在且子系统存在就去判断传过来的系统有没有相同的
            if(!userMap){
                yield UserMapping.create({phone:data[i].phone,email:data[i].email,userId:user.id,subsystems:subSystem});
                result.push(`${data[i].phone ? data[i].phone : data[i].email} 导入${data[i].system}成功`);
            }else{
                userMap.subsystems = subSystem;
                yield userMap.save();
                result.push(`${data[i].phone ? data[i].phone : data[i].email} 导入${data[i].system}成功`);
            }
        }catch(err){
            result.push(`${data[i].phone ? data[i].phone : data[i].email} 导入失败`);
        }
    }
    return result;
}

/**
 * 更新子系统信息
 * @param {Objext} data        [子系统的信息]
 * @return {*}
 */
function *updateSubsystem(data,userId,header){
    let result = [],arr = [];
    for(let i = 0;i < data.length;i++){
        let u = yield UserMapping.findOne({$or:[{phone:data[i].phone?data[i].phone:''},{email:data[i].email?data[i].email:''},{userId:userId}]}).exec();
        if(!u){
            result.push({status:false,msg:`${data[i].phone?data[i].phone:data[i].email?data[i].email:userId }还没关联`});
        }else{
            let system = u.subsystems;
            for(let j = 0;j < system.length;j++){
                if(system[j].name == data[i].system){
                    data[i].username && (system[j].info.username = data[i].username);
                    data[i].newPassword && (system[j].info.password = data[i].newPassword);
                    if(!data[i].newPassword || !data[i].oldPassword || !data[i].username){
                        result.push({status:false,msg:`${data[i].phone?data[i].phone:data[i].email?data[i].email:userId }username or newPassword or oldPassword is wrong`});
                        continue;
                    }
                    arr.push({systemName:data[i].system,userName:data[i].username,newPassword:data[i].newPassword,oldPassword:data[i].oldPassword});
                }
            }
            let Result =  yield requestThirdServiceGetMethod(config.appGateWay +'/protocol/search');
            if(Result.code != 0){
                return console.log('appGateWay 挂了');
            }
            else{
                let url = config.WindchillHost;
                config.WindchillHost = url.replace(url.substr(0,url.indexOf(':')),Result.result.protocol);
            }
            let res = yield requestThirdServicePostMethod(config.WindchillHost+'/user/resetPassword','post',arr,header);

            if(res.code == 200 || res.code == 0){
                yield u.save();
                result.push({status:true,msg:`${data[i].phone?data[i].phone:data[i].email?data[i].email:userId }修改成功`});
            }else{
                result.push({status:false,msg:`${data[i].phone?data[i].phone:data[i].email?data[i].email:userId }修改失败`});
            }

        }
    }
    return result;
}

let requestThirdServiceGetMethod = function*(url){

    let options = {
        url: url,
        rejectUnauthorized: false,
        method: 'get'
    };
    return new Promise(function(resolve,reject){
        request(options,function(err, response, body){
            if(err) reject(err);
            else{
                resolve(JSON.parse(body));
            }
        })
    })
};


let requestThirdServicePostMethod = function* (url,method,arr,header){
    let options = {
        url: url,
        rejectUnauthorized: false,
        method: method,
        headers: {
            "user-agent":header["user-agent"],
            token:header.token,
            type:header.type,
            ei:header.ei,
            "content-Type":header["content-type"]
        },
        body:JSON.stringify(arr)
    };
    console.log('-------------------------------------------------------------');
    console.log(options);
    console.log('-------------------------------------------------------------');
    return new Promise(function(resolve,reject){
        request.post(options,function(err,httpResponse,body){
            console.log('**********************************************************');
            console.log(body);
            console.log('**********************************************************')
            if(err) resolve({code:JSON.parse(body).status,msg:JSON.parse(body).error});
            else{
                if(JSON.parse(body).code != 0)
                    resolve({code:JSON.parse(body).code,msg:JSON.parse(body).result});
                else
                    resolve({code:JSON.parse(body).code,msg:'修改成功'});
            }
        });
    })
};
/**
 * 删除子系统信息
 * @param {Objext} data        [子系统的信息]
 * @return {*}
 */
function *deleteSubsystem(data,userId){
    let result = [];
    for(let i = 0;i < data.length;i++){
        let u = yield UserMapping.findOne({$or:[{phone:data[i].phone?data[i].phone:''},{email:data[i].email? data[i].email:''},{userId:userId}]}).exec();
        if(!u){
            result.push(`${data[i].phone?data[i].phone:data[i].email?data[i].email:userId }还没注册`);
        }else{
            let system = u.subsystems;
            for(let j = 0;j < system.length;j++){
                if(system[j].name == data[i].system){
                    system.splice(j,1);
                }
            }
            if(system.length ){
                yield u.save();
            }else{
                yield UserMapping.remove({$or:[{phone:data[i].phone?data[i].phone:''},{email:data[i].email? data[i].email:''},{userId:userId}]});
            }
            result.push(`删除成功`);
        }
    }
    return result;

}

function *updateAccount(data){
    let option = {};
    yield UserMapping.update({userId:data.userId},{$set:{phone:obj.newPhone,email:obj.newEmail}});
    return ;
}
/**
 * 查找mkt用户信息
 * @param {string} phmail        [手机或邮箱]
 * @return {*}
 */
function* findMktUser(phmail) {
    let mailReg = new RegExp((regExps.mail));
    if (mailReg.test(phmail)) { //邮箱
        return yield User.findOne({ mail: phmail });
    } else { //电话
        return yield User.findOne({ phoneNum: phmail });
    }
}
function *findSubsysUserInfo(data,userId){
    let u = yield User.findById(data.userId || userId);
    //let user_id = data.userId || userId || u.id;
    let user_id = u.id;
    user = yield UserMapping.find({userId:user_id}).select(' -updatedAt -userId -phone -createdAt  -_id').exec();
    if(!user.length)errors.throwUserMapNotExist();
    let obj = {};
    if(data.system){
        let ret = user[0].subsystems;
        user.subsystems =  ret.filter(r =>{
            if(r.name == data.system){
                obj = r.info;
            }
            //return  r.name == data.system;
        });
        return obj;
        //return user[0].subsystems[0].info;
    }else{
        //return user[0].subsystems[0].info;
        return user[0].subsystems;
    }
}

function* getSystemList(data,userId){
    let arr = [];
    for(let i = 0; i < data.length;i++){
        let user = yield  UserMapping.findOne({$or:[{phone:data[i].phone ? data[i].phone : ''},{email:data[i].email ? data[i].email : ''}]}).select('phone,email,userId subsystems');
        if(!user){
            arr.push({phone:data[i].phone,email:data[i].email,system:'没有查到该用户的数据'});
        }else{
            let sys = user.subsystems
            let array = [];
            sys.forEach(item=>{
                array.push(item.name);
            });
            arr.push({phone:data[i].phone,email:data[i].email,system:array});
        }

    }

    return arr;
}

module.exports = { findSubsysUser, findMktUser,batchInsertData ,updateSubsystem,deleteSubsystem,updateAccount,findSubsysUserInfo,getSystemList};