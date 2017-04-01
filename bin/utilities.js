const _ = require('lodash'),
    mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    verificationCodeDictionary = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
    securityCodeDictionary = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const securityCodeDictionaryLength = securityCodeDictionary.length,
    verificationCodeDictionaryLength = verificationCodeDictionary.length,
    ObjectId = mongoose.Types.ObjectId;
/**
 * 生成短位安全码
 *
 * @param number
 */
function securityCode(number = 6) {
    let need = [],
        i = 0;
    do {
        let index = Math.floor(Math.random() * securityCodeDictionaryLength);
        need.push(securityCodeDictionary[index]);
        i++;
    } while (i < number);
    return need.join("");
};

/**
 * 生成随机码
 *
 * @param number
 * @returns {string}
 */
function randomCode(number = 4) {
    let need = [],
        i = 0;
    do {
        let index = Math.floor(Math.random() * verificationCodeDictionaryLength);
        need.push(verificationCodeDictionary[index]);
        i++;
    } while (i < number);
    return need.join("");
};

/**
 * 过滤html标记
 *
 * @param str
 * @returns {*}
 */
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
};

/**
 * UUID 生成器 生成唯一id，标示某个记录
 *
 * @returns {string}
 */
function uuidCode() {
    return uuid.v1().split("-").join("");
};

/**
 * 分页
 * @param {[type]} query           [description]
 * @param {Number} options.pageNum [description]
 * @param {Number} options.page    [description]
 * @param {[type]} options.order   [description]
 */
function* pagination(query, { pageNum = 10, page = 1, order }) {
    let count = 0,
        pageCount = 0,
        data = [];
    page < 1 ? page = 0 : page--;

    /**
     * 查询语句查询
     */
    if (query.constructor.name == 'Query') {
        count = yield query.count(); //总记录数
        let surplus = count % pageNum > 0 ? 1 : 0;
        pageCount = parseInt(count / pageNum) + surplus; //总页数
        order && (query = query.sort(order)); //排序

        // query._conditions = Object.assign(query._conditions); //查询时间以前
        query = query.skip(pageNum * page).limit(pageNum);
        data = yield query.exec('find');
    }
    /**
     * 聚合语句分页
     */
    else if (query.constructor.name == 'Aggregate') {
        // let pipelines = query._pipeline; //temp _pipeline
        // sortObject && (query = query.sort(sortObject));

        // if (type == opt.pulldown) { //下拉刷新
        //     query._pipeline.push({ $match: { createdAt: { $lt: time } } });
        //     rows = yield query.limit(take); //_pipeline add sort skip take

        // } else if (type == opt.pullUp) { //上拉加载最新
        //     query._pipeline.push({ $match: { createdAt: { $gt: time } } });
        //     rows = yield query;
        // }

        // pipelines.push({ $group: { _id: null, count: { $sum: 1 } } }); //temp _pipeline add count
        // query._pipeline = pipelines; //change _pipeline
        // let queryCount = yield query;
        // count = queryCount.length > 0 ? queryCount[0].count : 0;
    }
    /**
     * 结果分页
     */
    else if (query.constructor.name == 'Array') {
        count = query.length;
        let surplus = count % pageNum > 0 ? 1 : 0;
        pageCount = parseInt(count / pageNum) + surplus; //总页数

        if (order) {
            let params = getDefaultSort(order);
            query = _.orderBy(query, params.fileds, params.sorts);
        }

        data = query.slice(page * pageNum, page * pageNum + pageNum);
    }

    return { count, pageCount, data };
}

/**
 * mongoose排序参数转换js排序参数
 * @param  {[type]} mongooseSort [description]
 * @return {[type]}              [description]
 */
let getDefaultSort = function(mongooseSort) {
    let params = {
        fileds: [],
        sorts: []
    };

    for (let k in mongooseSort) {
        params.fileds.push(k);
        let order = mongooseSort[k] > 0 ? 'asc' : 'desc';
        params.sorts.push(order);
    }
    return params;
};


/**
 * 转换objectid
 * @param {[type]} arg           [description]
 */
function* toObjectId(arg) {
    let result;
    if (Array.isArray(arg)) {
        result = arg.map(id => ObjectId(id));
    } else {
        result = Object(arg);
    }
    return result;
}

/**
 * 扁平化化嵌套数组
 * @param  {[type]} arr [description]
 */
function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

/**
 * 数组排重
 * @param  {[type]} arr [description]
 */
function unique(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
}

module.exports = { randomCode, randomNum: securityCode, delHtmlTag, uuidCode, pagination, toObjectId, flatten, unique };
