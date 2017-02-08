require('babel-register')

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
const makeStream = () => {
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
const consoleLevelStream = (level) => {
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
const fileLevelStream = (logDir, fileName, level) => {
  return {
    path: `${logDir}/${fileName}`,
    type: 'rotating-file',
    level: level,
    period: '1d',
    count: 3
  }
}

// /**
//  * Initialize logger
//  * @param {Object} config - Logger configuration
//  * @returns {Promise}
//  */
function init (config = {}) {
  return new Promise((resolve, reject) => {
    myConfig = Object.assign(config, CONFIG_DEFAULTS)
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
const getChild = (child) => logger.child({ child })

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

  const morganConfig = do {
    if (isDev) {
      morgan('dev')
    } else {
      morgan('combined', {
        stream: morganAccessLogStream,
        skip: (req, res) => res.statusCode < 400
      })
    }
  }

  return morganConfig
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
const logAppFatal = (message) => _logHelper('fatal', message)
const logAppError = (message) => _logHelper('error', message)
const logAppWarn = (message) => _logHelper('warn', message)
const logAppInfo = (message) => _logHelper('info', message)
const logAppDebug = (message) => _logHelper('debug', message)
const logAppTrace = (message) => _logHelper('trace', message)

/**
 * Helper function
 * @param {string} type - Logging level
 * @param {string} message - Message
 * @returns {*}
 * @private
 */
const _logHelper = (type, message) => logger[type](message)

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
