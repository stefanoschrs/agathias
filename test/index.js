'use strict'

/* globals it, describe */

// const expect = require('chai').expect
const agathias = require(`${__dirname}/../lib`)

describe('Default settings', () => {
  it('should initialize', () => {
    agathias
      .init()
      .then(() => {
        console.log(agathias)
      })
//  .then(() => agathias.debug('Hello'))
//  .catch(console.error)
  })
})
