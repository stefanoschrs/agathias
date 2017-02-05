const fs = require('fs')

const bunyan = require('bunyan')

const CONFIG_DEFAULTS = {
  appName: 'BunWrap',
  consoleLevel: 'debug',
  console: true,
  file: false,
  fileName: 'app.log',
  logDir: `${__dirname}/log`,
  express: false
}

let logger

function init (config = {}) {
  return new Promise((resolve, reject) => {
    let streams = []

    if (config.console || CONFIG_DEFAULTS.console) {
      streams.push({
        stream: process.stdout,
        level: config.consoleLevel || CONFIG_DEFAULTS.consoleLevel
      })
    }

    if (config.file || CONFIG_DEFAULTS.file) {
      const logDir = config.logDir || CONFIG_DEFAULTS.logDir
      fs.existsSync(logDir) || fs.mkdirSync(logDir)

      streams.push({
        path: `${__dirname}/${config.fileName || CONFIG_DEFAULTS.fileName}`,
        type: 'rotating-file',
        level: config.fileLevel || CONFIG_DEFAULTS.fileLevel,
        period: 'id',
        count: 3
      })
    }

    try {
      logger = bunyan.createLogger({
        name: config.appName || CONFIG_DEFAULTS.appName,
        streams
      })

      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Log Levels
 * ----------
 * "fatal"  (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
 * "error"  (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
 * "warn"   (40): A note on something that should probably be looked at by an operator eventually.
 * "info"   (30): Detail on regular operation.
 * "debug"  (20): Anything else, i.e. too verbose to be included in "info" level.
 * "trace"  (10): Logging from external libraries used by your app or very detailed application logging.
 */
function logAppDebug (child, message) { return _logHelper('debug', child, message) }

// _private
function _logHelper (type, child, message) {
  if (!message) {
    message = child
    child = undefined
  }

  return !child
    ? logger[type](message)
    : logger.child({ child })[type](message)
}

module.exports = {
  init,
  // Log Levels
  debug: logAppDebug
}
