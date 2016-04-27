// Documentation see http://techarena51.com/index.php/visualizing-linux-server-resource-usage-with-socket-io-and-d3-js-gauges/

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var cpu = require('./cpu.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('js'));
app.use(express.static('css'));

io.on('connection', function(socket){
  console.log('a user connected');

  // Total Memory

     socket.on('total', function(){

                var data = {'totalMemory':os.totalmem()};
                 io.emit('total', data);

                     });


   // Free Memory and CPU Percentage

     socket.on('server', function(){

        cpu().then(function(cpuPercentage) {


               //console.log(cpuPercentage);

                var data = {'freeMemory':os.freemem(), 'cpu':cpuPercentage};
                 io.emit('server', data);

                     });
             });

});

http.listen(5001, function(){
  console.log('listening on *:5001');

});
