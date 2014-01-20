'use strict';

module.exports = function (cluster) {

    var worker = {};

    worker.start = function (express, http, path, routes) {
        
        // Configure Express
        var app = express();
            
        app.configure(function(){
            app.use(express.json());
            app.use(express.urlencoded());
            app.use(express.compress());
            app.use(express.cookieParser());
            app.use(app.router);
        });

        // Load Routes
        routes.loadRoutes(app);

        // Init Server
        var server = http.createServer(app),
            port = process.env.PORT || 9007;

        server.listen(port, function () {
            console.log('Worker %d HTTP #%d listening on port %d',
                        cluster.worker.process.pid, cluster.worker.id, port);
        });

       
        // Error Handling / Logging
        process.on('uncaughtException', function (err) {
            console.error('uncaughtException', err.message);
            console.error(err.stack);
            process.exit(1);
        });

        server.on('error', function (err) {
            console.log(err);
        });

        app.on('error', function (err) {
            console.log(err);
        });
    };

    worker.stop = function () {
        console.log('stopping worker')
        process.exit(1);
    };

    return worker;
};