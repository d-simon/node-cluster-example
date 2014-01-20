'use strict';

module.exports = function () {

    var workers = {}

    workers.start = function (workerConf) {

        workers.workerConf = workerConf

        // Request role
        process.send({ cmd: 'requestRole', pid: process.pid })

        // Receive role
        process.on('message', function (msg) {
            if (msg.cmd === 'setRole') {
                workers.spawn(msg.role);
            }
        })
    }

    workers.spawn = function (role) {

        // Start init of the current worker with the given 'role'
        for (var w in workers.workerConf) {
            var worker = workers.workerConf[w];
            if (w === role) {
                worker.init.apply(undefined, worker.args)
                return
            }
        }
        throw new Error('Workers - Invalid role received to spawn: ' + role)
    }


    return workers
}