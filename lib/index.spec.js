'use strict'

function simpleCase () {
  const agathias = require(`${__dirname}/index`)

  agathias
    .init()
    .then(() => {
      console.log('Simple Case')
      agathias.debug('Hello')
      const agathiasChild = agathias.getChild('test')
      agathiasChild.error('Hello')
    })
    .catch(console.error)
}

function fileCase () {
  const agathias = require(`${__dirname}/index`)

  agathias
    .init({
      file: true,
      fileName: 'my-app.log',
      logDir: '/tmp/agathias-file'
    })
    .then(() => {
      console.log('File Case')
      agathias.error('Hello')
      const agathiasChild = agathias.getChild('test')
      agathiasChild.error('Hello')
    })
    .catch(console.error)
}

function middlewareCase () {
  const http = require('http')

  const express = require('express')
  const agathias = require(`${__dirname}/index`)

  const app = express()

  agathias
    .init({
      logDir: '/tmp/agathias-middleware'
    })
    .then(() => {
      console.log('Middleware Case')
      app.use(agathias.getMiddleware(true))

      app.get('/', (req, res) => res.send('Hello World'))

      let server = app.listen(5000)

      http.get('http://0.0.0.0:5000', (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          console.log(data)
          server.close()
        })
      })
    })
    .catch(console.error)
}

// TODO: Implement these tests with karma
simpleCase()
fileCase()
middlewareCase()
