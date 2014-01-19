// Load all dependencies here for a clear dependency structure
var cluster = require('cluster'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    worker = require('./worker')(cluster),
    main = require('./lib/controller/main')(cluster),
    routes = require('./lib/routes')(main);

var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    console.log('Master ' + process.pid + ' online');

    // Forking workers
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Respawn workers
    cluster.on('exit', function(worker, code, signal) {
        if (code != 0) {
            console.log('Worker %d died! (%d) Spawning a replacement.',  worker.process.pid, (signal || code));
            cluster.fork();
        }
    });

    cluster.on('disconnect', function(worker) {
        console.log('The worker %d has disconnected', worker.process.pid);
    });

} else {
    worker.start(express, http, path, routes);
}