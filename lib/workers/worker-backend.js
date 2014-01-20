'use strict';

module.exports = function (cluster) {

    var worker = {};

    worker.start = function () {
        
        console.log('Worker %d BACK #%d running', cluster.worker.process.pid, cluster.worker.id);
       
        // Error Handling / Logging
        process.on('uncaughtException', function (err) {
            console.error('uncaughtException', err.message);
            console.error(err.stack);
            process.exit(1);
        });
    };

    worker.stop = function () {
        console.log('Worker %d BACK #%d STOPPEDc', cluster.worker.process.pid, cluster.worker.id);
        process.exit(1);
    };

    return worker;
};