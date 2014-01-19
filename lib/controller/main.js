module.exports = function (cluster) {

    var routes = {};

    routes.index = function (req, res, next) {
        res.send('Hello, you are being served by the worker # %d', cluster.worker.id);
    };

    return routes;
};