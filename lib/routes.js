module.exports = function (main) {

    var routes = {};

    routes.loadRoutes = function (app) {
        // define all routes
        app.get('/', main.index);
    };

    return routes;
};