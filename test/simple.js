'use strict'

const agathias = require(`${__dirname}/../lib`)

agathias
  .init()
  .then(() => agathias.debug('Hello'))
  .catch(console.error)
