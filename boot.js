let cluster = require('cluster');
// let numCPUS = require('os').cpus().length;
let numCPUS = 1
let path = require('path');

let conf = require('./app/conf');
conf.boot(path.resolve('./etc'), path.resolve('../etc'));
let server = require('./server.js');
let project = require('./app/project');


if (cluster.isMaster) {
  //Fork a worker to run the main program
  console.log(' Fork %s worker(s) from master', numCPUS);
  for (var i = 0; i < numCPUS; i++) cluster.fork();

  cluster.on('online', (worker) => {
  	console.log('worker is running on %s pid', worker.process.pid);
  })
cluster.on('exit', (worker, code, signal) => {
  	console.log('worker with %s is closed', worker.process.pid);
})

} else if(cluster.isWorker) {
  //Run main program
  console.log('worker (%s) is running', cluster.worker.process.pid);
  server.boot();
}

cluster.on('death', function(worker) {
  //If the worker died, fork a new worker
  console.log('worker ' + worker.pid + ' died. restart...');
  cluster.fork();
});

let fs = require('fs');
let lock = path.join(process.cwd(), 'runtime', 'lock');
let fsExistsSync = function (path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}
if (!fsExistsSync(lock)) {
  let fileWriteStream = fs.createWriteStream(lock);
  fileWriteStream.write('lock');
  fileWriteStream.end();
  project.RegisterTask();
}
