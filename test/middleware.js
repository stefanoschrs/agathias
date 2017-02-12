'use strict'

const http = require('http')

const express = require('express')
const agathias = require(`${__dirname}/../lib`)

const app = express()

agathias
  .init({
    logDir: '/tmp'
  })
  .then(() => {
    app.use(agathias.getMiddleware())
    app.get('/', (req, res) => res.send('Hello World'))

    let server = app.listen(process.env.PORT || 5000)
    http.get('http://0.0.0.0:5000/hello-world', (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        agathias.debug(data)
        server.close()
      })
    })
  })
  .catch(console.error)
