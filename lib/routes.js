'use strict';

module.exports = function (main, admin) {

    var routes = {};

    routes.loadRoutes = function (app) {
        // define all routes
        app.get('/', main.index);
    };

    routes.loadAdminRoutes = function (app) {
        // define all routes
        app.get('/', admin.index);
    };

    return routes;
};