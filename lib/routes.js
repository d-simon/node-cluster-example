'use strict';

module.exports = function (main) {

    var routes = {};

    routes.loadRoutes = function (app) {
        // define all routes
        app.get('/', main.index);
    };

    routes.loadAdminRoutes = function (app) {
        // define all routes
        app.get('/', main.admin);
    };

    return routes;
};