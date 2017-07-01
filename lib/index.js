'use strict'

const fs = require('fs')

const fileStreamRotator = require('file-stream-rotator')
const morgan = require('morgan')
const bunyan = require('bunyan')

const CONFIG_DEFAULTS = {
  appName: 'BunWrap',
  consoleLevel: 'debug',
  console: true,
  file: false,
  fileName: 'app.log',
  fileLevel: 'debug',
  logDir: `${__dirname}/log`,
  express: false
}

let logger
let myConfig

/**
 * Make a Stream function thats when called it adds entries to streams
 * @returns {Function}
 */
function makeStream () {
  let buffer = []

  return (streamEntry = null) => {
    if (streamEntry) {
      buffer.push(streamEntry)
    }

    return buffer
  }
}

/**
 * Create a new consoleLevel entry
 * @param {string} level - Logger level
 * @returns {Object}
 */
function consoleLevelStream (level) {
  return {
    stream: process.stdout,
    level: level
  }
}

/**
 * Create a new fileLevel entry
 * @param {string} logDir - Logger directory
 * @param {string} fileName - Logger file name
 * @param {string} level - Logger level
 * @returns {Object}
 */
function fileLevelStream (logDir, fileName, level) {
  return {
    path: `${logDir}/${fileName}`,
    type: 'rotating-file',
    level: level,
    period: '1d',
    count: 3
  }
}

/**
 * Initialize logger
 * @param {Object} config - Logger configuration
 * @returns {Promise}
 */
function init (config = {}) {
  return new Promise((resolve, reject) => {
    myConfig = Object.assign(CONFIG_DEFAULTS, config)
    let streams = makeStream()

    if (myConfig.console) {
      streams(consoleLevelStream(myConfig.consoleLevel))
    }

    if (myConfig.file) {
      const { logDir } = myConfig
      fs.existsSync(logDir) || fs.mkdirSync(logDir)
      streams(fileLevelStream(logDir, myConfig.fileName, myConfig.fileLevel))
    }

    try {
      logger = bunyan.createLogger({
        name: myConfig.appName,
        streams: streams()
      })

      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Create a new child logger
 * @param {string} child - Logger child name
 * @returns {*|XMLList}
 */
function getChild (child) {
  if (logger) return logger.child({ child })

  return bunyan.createLogger({name: child || 'app'})
}

/**
 * Express middleware using the morgan package
 * @param {boolean} isDev - Is Development
 * @returns {Function}
 */
function getMiddleware (isDev) {
  const { logDir } = myConfig
  fs.existsSync(logDir) || fs.mkdirSync(logDir)

  const morganAccessLogStream = fileStreamRotator.getStream({
    filename: `${logDir}/http-%DATE%.log`,
    frequency: 'daily',
    verbose: false,
    date_format: 'DD-MM-YYYY'
  })

  return isDev
    ? morgan('dev')
    : morgan('combined', {
      stream: morganAccessLogStream,
      skip: (req, res) => res.statusCode < 400
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
function logAppFatal (message) { return _logHelper('fatal', message) }
function logAppError (message) { return _logHelper('error', message) }
function logAppWarn (message) { return _logHelper('warn', message) }
function logAppInfo (message) { return _logHelper('info', message) }
function logAppDebug (message) { return _logHelper('debug', message) }
function logAppTrace (message) { return _logHelper('trace', message) }

/**
 * Helper function
 * @param {string} type - Logging level
 * @param {string} message - Message
 * @returns {*}
 * @private
 */
function _logHelper (type, message) {
  if (!logger) {
    return init().then(() => logger[type](message))
  }

  return logger[type](message)
}

module.exports = {
  init,
  getChild,
  getMiddleware,
  // Log Levels
  fatal: logAppFatal,
  error: logAppError,
  warn: logAppWarn,
  info: logAppInfo,
  debug: logAppDebug,
  trace: logAppTrace
}
