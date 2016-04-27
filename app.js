'use strict'
var http = require('http').Server();
var io = require('socket.io')(http);
var os = require('os');
var cpu = require('./cpu.js');
 
// Listen for incoming socket requests on the special “connection” event
io.on('connection', function(socket){

// Log to console when a user is connected

  console.log('a user connected');

  // Create the “total” event”  and send the total memory data
     socket.on('total', function(){

                var data = {'totalMemory':os.totalmem()};
                 io.emit('total', data);

                     });

   // Create a “server” event and emit real time cpu and memory usage
     socket.on('server', function(){

        cpu().then(function(cpuPercentage) {

                var data = {'freeMemory':os.freemem(), 'cpu':cpuPercentage};
                 io.emit('server', data);

                     });
             });

});

http.listen(443, function(){
  console.log('listening on *:443');

});
