var api = require('../action/index');

module.exports = function (app) {
    /**
     * 重定向首页
     */
    app.get('/', function (req, res, next) {
        res.render('index');
    });
    api(app);
};