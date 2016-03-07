'use strict'

var EventEmitter = require('events').EventEmitter

var Flow = {
  create: function (args) {
    return Object.create(Flow).initFlow(args)
  },

  initFlow: function (args) {
    this.promiseChain = Promise.resolve()

    return this
  },

  add: function (nextStep) {
    var _this = this
    this.promiseChain = this.promiseChain.then(function (data) {
      return new Promise((resolve, reject) => {
        try {
          nextStep(data, resolve, reject, _this.emit.bind(_this))
        }
        catch (err) {
          _this.emit('error', err)
          reject(err)
        }
      })
    })

    return this
  }
}

Object.assign(Flow, EventEmitter.prototype)

module.exports = Flow
