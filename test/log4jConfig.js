let path = require('path');
let rtp = path.join(__dirname, 'runtime_dev', 'logs');
let logConf = {
  appenders: [
    {
      type: "file",
      filename: path.join(rtp, 'latest.log'),
      maxLogSize: 10*1024*1024, // = 10Mb
      append:true,
      numBackups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      mode: parseInt('0640', 8),
      flags: 'w+'
    },
    {
      type: "dateFile",
      compress: true,
      filename: path.join(rtp, 'common'),
      pattern: '_yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    {
      type: "stdout"
    }
  ],
  replaceConsole: true
};

exports.set = function () {
  require('log4js').configure(logConf);
  let logger = require('log4js').getLogger();
  logger.setLevel('TRACE');
}