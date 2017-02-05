function simpleCase(){
  const bunWrap = require(`${__dirname}/index`)

  bunWrap
    .init()
    .then(() => {
      console.log('Simple Case')
      bunWrap.debug('Hello')
      const bunWrapChild = bunWrap.getChild('test')
      bunWrapChild.error('Hello')
    })
    .catch(console.error)
}

function fileCase(){
  const bunWrap = require(`${__dirname}/index`)

  bunWrap
    .init({
      file: true,
      fileName: 'my-app.log',
      logDir: '/tmp/bunyan-wrapper-file',
    })
    .then(() => {
      console.log('File Case')
      bunWrap.error('Hello')
      const bunWrapChild = bunWrap.getChild('test')
      bunWrapChild.error('Hello')
    })
    .catch(console.error)
}

function middlewareCase(){
  const http = require('http')

  const express = require('express')
  const bunWrap = require(`${__dirname}/index`)

  const app = express();

  bunWrap
    .init({
      logDir: '/tmp/bunyan-wrapper-middleware',
    })
    .then(() => {

      console.log('Middleware Case')
      app.use(bunWrap.getMiddleware(true))

      app.get('/', (req, res) => res.send('Hello'))

      let server = app.listen(5000)

      http.get('http://0.0.0.0:5000', (res) => {
        let data = ''
        res.on('data', (chunk) => data += chunk)
        res.on('end', () => {
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
