'use strict';

module.exports = function (cluster) {

    var routes = {};

    routes.index = function (req, res, next) {
        res.send('Hello, you are being served by the worker #' + cluster.worker.id);
    };

    routes.admin = function (req, res, next) {
        res.send('Hello, you are being served by the worker #' + cluster.worker.id + ' ADMIN!');
    };

    return routes;
};