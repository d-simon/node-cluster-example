node-cluster-example
====================

A very simple example demonstrating the [cluster][1] module. With the ability to run different types of workers.

## Use 

This example will automatically spawn an instance per logical core. If you want to override this number use *NODE_CPUS*

    NODE_CPUS=200 node server.js

## Links

[http://nodejs.org/api/cluster.html][2]

[http://dshaw.github.io/2012-05-jsday/#/10][3]



  [1]: http://nodejs.org/api/cluster.html
  [2]: http://nodejs.org/api/cluster.html
  [3]: http://dshaw.github.io/2012-05-jsday/#/10

