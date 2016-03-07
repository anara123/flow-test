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
    var emit = _this.emit.bind(_this)

    this.promiseChain = this.promiseChain.then(function (data) {
      return new Promise((resolve, reject) => {
        try {
          nextStep(data, resolve, errorOnReject(emit, reject), emit)
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

/**
 * Create proxy function which will on every reject emit 'error' event
 */
function errorOnReject (emit, reject) {
  return function (err) {
    emit('error', err)
    reject(err)
  }
}

Object.assign(Flow, EventEmitter.prototype)

module.exports = Flow
