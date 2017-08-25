var api = require('../models/api');
var moment = require('moment');

module.exports = function (app) {

    /**
     * 保存接口数据
     */
    app.post('/apisave', function (req, res, next) {
        var link = req.body.link;
        var explain = req.body.explain;
        var method = req.body.method;
        var author = req.body.author;
        var params = req.body.params;
        var response = req.body.response;
        if (link) {
            api.getApi(link, function (data) {
                if (data.status) {
                    if (data.data.length > 0 && data.data[0].link == link) {
                        var id = data.data[0].id;
                        api.updateApi({
                            sql: "update api SET `explain`=?,method=?,author=?,params=?,response=?,time=? WHERE id = ?",
                            params: [
                                explain,
                                method,
                                author,
                                params,
                                response,
                                moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                                id
                            ]
                        }, function (data) {
                            res.send(data);
                        });
                    } else {
                        api.saveApi({
                            data: {
                                link: link,
                                explain: explain,
                                method: method,
                                author: author,
                                params: params,
                                response: response,
                                from: 'api',
                                time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            },
                            sql: "INSERT INTO api SET ?"
                        }, function (data) {
                            res.send(data);
                        });
                    }
                }
            })
        }
    });
    /**
     * 获取接口数据
     */
    app.get('/getapi', function (req, res) {
        var p = req.query.p;
        var limit = 5;
        var count;
        var totalPages;
        api.getApiCount(function (data) {
            if (data) {
                count = data.data[0].count;
                totalPages = Math.ceil(data.data[0].count / limit);
            }
            api.getApiPage((p - 1) * limit, limit, function (data) {
                if (data.status) {
                    res.send({list: data, maxPage: totalPages, currage: p, count: count, limit: limit});
                } else {
                    res.send(500);
                }
            });
        });

    });
    /**
     * 删除接口api
     */
    app.post('/delapi', function (req, res, next) {
        var id = req.body.id;
        if (id) {
            api.deleteApi({
                sql: "DELETE FROM api WHERE id = " + id
            }, function (data) {
                res.send(data);
            });
        }
    });

}