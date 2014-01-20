'use strict';

module.exports = function (cluster) {

    var master = {};

    master.workerCount = 0;

    master.setWorkerCount = function (numCPUs) {
        var minProcessesCount = 0;
        
        for (var w in master.workerConf) {
            minProcessesCount += master.workerConf[w].minProcesses || 1;
        }

        master.workerCount = Math.max(minProcessesCount, numCPUs);
    };

    master.start = function (workerConf, numCPUs, ENV) {

        master.workerConf = workerConf;
        master.setWorkerCount(numCPUs);
       
        console.log('Master %d online running in %s mode', process.pid, ENV);

        // Forking workers
        for (var i = 0; i < master.workerCount; i++) {
            cluster.fork();
        }
        master.listenForRoleRequests();

        // Respawn workers on exit
        cluster.on('exit', function (worker, code, signal) {
            if (code != 0) {
                console.log('Worker %d died! (%d) Spawning a replacement.',  worker.process.pid, (signal || code));
                cluster.fork();
                master.listenForRoleRequests();
            }
        });

        cluster.on('disconnect', function (worker) {
            console.log('The worker %d has disconnected', worker.process.pid);
        });

    };

    master.eachWorker = function (callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    };

    master.getCurrentRoleCount = function () {
        var roleCount = {};
        
        // Setup roleCount Object (0 for every role)
        for (var r in master.workerConf) {
            roleCount[r] = 0;
        }

        // Count each worker role
        master.eachWorker(function (worker) {
            if (worker.role) {
                roleCount[worker.role]++;
            }
        });

        return roleCount;
    };

    master.getHighestPriorityRole = function () {
        var roleCount,
            returnRole,
            lowestRoleCount,
            lowestRole;

        roleCount = master.getCurrentRoleCount();

        // If there are no roles, start with the first one
        if (Object.keys(roleCount).length === 0) {
            for (var r in master.workerConf) {
                if (master.workerConf.hasOwnProperty(r)) {
                    returnRole = r;
                    break;
                }
            }
        // else prioritize after minProccesses (in order) or lowest count
        } else {
            for (var r in roleCount) {
                if (roleCount.hasOwnProperty(r)) {
                    // skip if it's the first one, or if we didn't reach minProcess count
                    if (lowestRole && ((master.workerConf[r].minProcesses || 1) <= roleCount[r])) {

                        // pick the one of which we have the least 
                        if (roleCount[r] >= lowestRoleCount) {
                            continue;
                        }

                        // if there is maxProcesses property, we should not go over maxProcesses
                        if (master.workerConf[r].maxProcesses && master.workerConf[r].maxProcesses <= roleCount[r]) { 
                            continue;
                        }

                        // if we have 0 workers of that type, take this type
                        if (lowestRoleCount === 0) { 
                            continue;
                        }

                        
                    }
                    lowestRoleCount = roleCount[r];
                    lowestRole = r;
                }
            }
            returnRole = lowestRole;
        }
        return returnRole;
    };

    master.listenForRoleRequests = function () {
        master.eachWorker(function (worker) {
            if (!worker.role) {
                worker.on('message', function (msg) {
                    if (msg.cmd === 'requestRole') {
                        var role = master.getHighestPriorityRole();
                        worker.send({ cmd: 'setRole', role: role });
                        worker.role = role;
                    }
                });
            }
        });
    };

    return master;
};