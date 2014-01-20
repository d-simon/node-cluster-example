'use strict';

// Load all dependencies here for a clear dependency structure
var cluster = require('cluster'),
    express = require('express'),
    http = require('http'),
    path = require('path')

var master = require('./master')(cluster),
    workers = require('./workers')(),
    workerBackend = require('./worker-backend')(cluster),
    workerHttp = require('./worker-http')(cluster),

    main = require('./lib/controller/main')(cluster), 
    routes = require('./lib/routes')(main) // TODO: create a CONF to pass all controllers into routes


var numCPUs = require('os').cpus().length

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
    
    workers.start(workerConf, numCPUs)
}