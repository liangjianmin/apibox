var mysqlDB = require("./mysqlDB.js");
var sql = null;
module.exports = {
    /**
     * 获取全部接口数据
     * @param callback
     */
    getApis: function (callback) {
        sql = "select * from api";
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    /**
     * 获取接口分页数据
     * @param p
     * @param limit
     * @param callback
     */
    getApiPage: function (p, limit, callback) {
        sql = "select * from api limit " + p + "," + limit;
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    /**
     * 获取一条接口数据
     */
    getApi: function (link, callback) {
        sql = "SELECT * FROM `api` WHERE link='" + link + "' ";
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    /**
     *获取接口总数
     * @param callback
     */
    getApiCount: function (callback) {
        sql = 'select count(1) count from `api`';
        mysqlDB.getTableAllInfo({sql: sql}, callback);
    },
    /**
     * 保存接口数据
     * @param data
     * @param callback
     */
    saveApi: function (data, callback) {
        mysqlDB.insertTable(data, callback);
    },
    /**
     * 更新接口数据
     * @param data
     * @param callback
     */
    updateApi: function (data, callback) {
        mysqlDB.updateTable(data, callback)
    },
    /**
     * 删除接口api
     * @param data
     * @param callback
     */
    deleteApi: function (data, callback) {
        mysqlDB.deleteTable(data, callback);
    }
};
