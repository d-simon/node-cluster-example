'use strict';

module.exports = function (cluster) {

    var routes = {};

    routes.index = function (req, res, next) {
        res.send('Hello, you are being served by the HTTP-ADMIN worker ID ' + cluster.worker.id);
    };

    return routes;
};