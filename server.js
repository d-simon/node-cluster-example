'use strict';

// Load all dependencies here for a clear dependency structure
var cluster = require('cluster'),
    express = require('express'),
    http = require('http'),
    path = require('path');

var master = require('./lib/server/master')(cluster),
    workers = require('./lib/server/workers')(),
    workerBackend = require('./lib/workers/worker-backend')(cluster),
    workerHttp = require('./lib/workers/worker-http')(cluster),
    main = require('./lib/controller/main')(cluster), 
    routes = require('./lib/routes')(main); // TODO: create a CONF to pass all controllers into routes


var numCPUs = process.env.NODE_CPUS || require('os').cpus().length;

var ENV = process.env.NODE_ENV || 'developement';

var workerConf = {
    'http': {
            init: workerHttp.start,
            args: [express, http, path, routes],
            minProcesses: 2
        },
    'backend': {
            init: workerBackend.start,
            args: null,
            minProcesses: 2
        }
    };


if (cluster.isMaster) {

    master.start(workerConf, numCPUs, ENV);

} else {
    
    workers.start(workerConf, numCPUs);
}