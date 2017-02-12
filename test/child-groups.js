'use strict'

const agathias = require(`${__dirname}/../lib`)

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
