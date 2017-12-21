let path = require('path');
let appName = process.env.name
appName = appName?appName:'app'
let rtp = path.join(process.cwd(), 'logs', appName);

let logConf = {
  appenders:{
    STDOUT:{
      type:'stdout',
      layout: { type: 'ENCODER_PATTERN', separator: ',' },
      filter:{level:'error'}
    },
    FILE:{
      type:'dateFile',
      filename: path.join(rtp, 'common'),
      pattern: '_yyyy-MM-dd.log',
      compress:true,
      alwaysIncludePattern: true,
      layout: { type: 'ENCODER_PATTERN', separator: ',' }
    },
    error:{
      type:'dateFile',
      filename: path.join(rtp, 'error'),
      pattern: '_yyyy-MM-dd.log',
      compress:true,
      alwaysIncludePattern: true,
      levelFilter:{level:'error'},
      layout: { type: 'ENCODER_PATTERN', separator: ',' }
    },
    ERROR_FILE:{
      type:'logLevelFilter',
      appender:'error',
      level:'error'
    }
  },
  categories: { default: { appenders: ['STDOUT', 'FILE', 'ERROR_FILE'], level: 'info' } }
  /*
  appenders: [
  */
  /*
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
    */
    /*
    {
      type: "dateFile",
      compress: true,
      filename: path.join(rtp, 'common'),
      pattern: '_yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    {
      type: "stdout",
      encoder:{
        pattern:'%d{yyyy-MM-dd  HH:mm:ss.SSS} [%thread] %-5level %logger{80} - %msg%n'
      }
    }
  ],
  replaceConsole: true
  */
}

let moment = require('moment')
exports.set = function () {
  let log4js = require('log4js')
  // json template
  log4js.addLayout('ENCODER_PATTERN', config => {
    return function(logEvent) {
      // 16:13:59.195
      return moment(logEvent.startTime).format('YYYY-MM-DD HH:MM:ss.SSS') + ' [main] ' + logEvent.level.levelStr + ' ' + logEvent.categoryName + ' - ' + logEvent.data // JSON.stringify(logEvent)  + config.separator
    }
  })
  log4js.configure(logConf);
}




