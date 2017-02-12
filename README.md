<h1 align="center">
  Agathias
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
const agathias = require('agathias')

agathias
  .init()
  .then(() => agathias.debug('Hello'))
  .catch(console.error)
```
2. File Case
```javascript
const agathias = require('agathias')
const config = {
  file: true,
  fileName: 'my-app-file-case.log',
  logDir: '/tmp',
}

agathias
  .init(config)
  .then(() => agathias.debug('Hello'))
  .catch(console.error)
```
3. Middleware Case (ExpressJS)
```javascript
const http = require('http')
const express = require('express')
const agathias = require('agathias')
const app = express()
agathias
  .init({
    logDir: '/tmp'
  })
  .then(() => {
    app.use(agathias.getMiddleware(true))
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
4. Group logs by 'children'
```javascript
const agathias = require('agathias')

agathias
  .init()
  .then(() => {
    agathias.debug('Hello')
    const childNode1 = agathias.getChild('testing')
	childNode1.debug('Hello')
    const childNode2 = agathias.getChild('this is real')
	childNode2.debug('World')
  })
  .catch(console.error)
```


### Features
* Seamless integration with log rotate
* Optional express logging
