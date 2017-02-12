'use strict'

const agathias = require(`${__dirname}/../lib`)

const config = {
  file: true,
  fileName: 'agathias-file-case.log',
  logDir: '/tmp'
}

agathias
  .init(config)
  .then(() => agathias.debug('Hello'))
  .catch(console.error)
