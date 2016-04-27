//via https://gist.github.com/bag-man/5570809
// Explanation at https://github.com/Leo-G/DevopsWiki/wiki/How-Linux-CPU-usage-time-and-Percentage-can-be-calculated

var os = require('os');

//Create function to get CPU information
function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

//Grab first CPU Measure
var startMeasure = cpuAverage();

module.exports = function () {

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    // http://stackoverflow.com/questions/24928846/get-return-value-from-settimeout
    var promise = new Promise(function (resolve, reject) {

//Set delay for second Measure
 setTimeout(function() {

  //Grab second Measure
  var endMeasure = cpuAverage();

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  resolve(percentageCPU);

  //Output result to console
 // console.log(percentageCPU + "%");

}, 100);

});

return promise;
}
