<h1 align="center">
  <img src="https://github.com/stefanoschrs/agathias/blob/master/assets/logo.png" alt="Agathias">
</h1>

<p align="center">
  <a href="https://travis-ci.org/stefanoschrs/agathias"><img src="https://travis-ci.org/stefanoschrs/agathias.svg?branch=master" alt="Travis Build"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="https://github.com/stefanoschrs/agathias/blob/master/LICENSE"><img src="https://img.shields.io/github/license/stefanoschrs/agathias.svg" alt="MIT License"></a>
</p>

<h4 align="center">
	Another Logging Library
</h4>

<br>

Easy to use logging

### Install
`npm i --save agathias`

### Usage
1. Simple Case
```javascript
const logger = require('agathias')

logger.info('Hello')
logger.debug('World')
```

2. Simple Case w/ config
```javascript
const logger = require('agathias')
const config = {
  appName: 'Simple App'
}

logger
  .init(config)
  .then(() => logger.debug('Hello'))
  .catch(console.error)
```

3. File Case
```javascript
const logger = require('agathias')
const config = {
  file: true,
  fileName: 'my-app-file-case.log',
  logDir: '/tmp', // Path must have an absolute value, you can use __dirname
}

logger
  .init(config)
  .then(() => logger.debug('Hello'))
  .catch(console.error)
```

4. Middleware Case (ExpressJS)
```javascript
const http = require('http')
const express = require('express')
const logger = require('agathias')
const app = express()

logger
  .init({
    logDir: '/tmp'
  })
  .then(() => {
    app.use(logger.getMiddleware(true))
    app.get('/', (req, res) => res.send('Hello World'))

    let server = app.listen(process.env.PORT || 5000)
    http.get('http://0.0.0.0:5000/no', (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => server.close())
    })
  })
  .catch(console.error)
```

5. Group logs by 'children'
```javascript
const logger = require('agathias')

logger
  .init()
  .then(() => {
    logger.debug('Hello')
    const childNode1 = logger.getChild('testing')
	childNode1.debug('Hello')
    const childNode2 = logger.getChild('this is real')
	childNode2.debug('World')
  })
  .catch(console.error)
```

### Features
* Seamless integration with log rotate
* Optional express logging
