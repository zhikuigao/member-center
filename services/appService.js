const { Source ,DesignGuide} = require('../dao/mktIndex');

/**
 * 获取app列表
 * @param {[type]} options.keyword [description]
 * @yield {[type]} [description]
 */
function* getDistinctApps({ keyword }) {
    let condition = {state: 'Release'};
    if (keyword) {
        condition['$or'] = [
            {appId: {$regex: keyword, $options: 'i'}},
            {name: {$regex: keyword, $options: 'i'}},
            // { keywords: { $in: [{ $regex: keyword, $options: 'i' }] } }
            {keywords: {$regex: keyword, $options: 'i'}}
        ];
    }
    let sources = yield Source.find(condition).sort({"uploadDate":-1});

    let obj = {};
    let result = [];
    for(let source of sources){
        let s = source.toObject();
        if(!obj[s.appId]){
            obj[s.appId] = true;
            result.push({
                appId: s.appId,
                name: s.name,
                keywords: s.keywords
            })
        }
    }
    return result;
    //let result = sources.map(s => {
    //    s = s.toObject();
    //    return {
    //        appId: s.appId,
    //        name: s.name,
    //        keywords: s.keywords
    //    };
    //});

}

/**
 * 获取app
 * @param {[type]} appId         [description]
 */
function* getApp(appId) {
    let source = yield Source.findOne({_id: appId, state: 'Release'});
    if (!source) errors.thorwNoThisApp();
    return source;
}


module.exports = {
    getDistinctApps,
    getApp
};
