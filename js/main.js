var socket = io();
var gauges = [];

function createGauge(name, label, min, max) {

    var config = {
                    size: 220,
                    label: label,
                    min: undefined != min ? min : 0,
                    max: undefined != max ? max : 100,
                    minorTicks: 5
                }

                var range = config.max - config.min;
                config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
                config.redZones = [{ from: config.min + range*0.9, to: config.max }];

                gauges[name] = new Gauge(name + "GaugeContainer", config);
                gauges[name].render();
            }

function createGauges()

        {
        // Get the Total Memory and Create the Memory Gauge

        socket.emit('total', {});

        socket.on('total', function(data){

            createGauge("memory", "Memory", 0, Math.round(data.totalMemory/(1024*1024*1024)));

                 });

        // Create the CPU gauge with the default range
        createGauge("cpu", "CPU");

            }

function updateGauges() {

             socket.emit('server', {});

             socket.on('server', function(data){

             var freeMemory = data.freeMemory/(1024*1024*1024);

             var usedMemory = 2 - freeMemory.toFixed(2);

              console.log(usedMemory);

             var cpuPercentage = data.cpu;

             for (var key in gauges)
                {

                   if (key == "memory") {

                      gauges[key].redraw(usedMemory);

                    } else {

                    gauges[key].redraw(cpuPercentage); }

                }

            })

            }
             // Create the Gauges and Update them every 5 seconds
            function initialize()
            {
                createGauges();

                setInterval(updateGauges, 5000);
            }
