'use strict'
var uuid = require('uuid')
var assert = require('assert')

var Flow = require('./flow')
var ContainerRunnerFlow = Object.create(Flow)

Object.assign(ContainerRunnerFlow, {
  create: function (args) {
    return Object.create(ContainerRunnerFlow).init(args)
  },

  init: function (args) {
    this.initFlow(args)
    return this
  },

  cloneRepo: function (options) {
    return this.add(
      function (args, resolve, reject, emit) {
        emit('finish_clone')
        resolve()
      }
    )
  },

  buildContainer: function (options) {
    return this.add(
      function (args, resolve, reject, emit) {
        // build process running
        for (var i = 0; i < 5; i ++) {
          emit('log', { message: 'build process %' + i + ' complete'})
        }

        setTimeout(function () {
          var result = { containerName: uuid.v1() }
          emit('finish_build', result)
          resolve(result)
        }, 500)

      }
    )
  },

  runContainer: function (options) {
    return this.add(
      function (args, resolve, reject, emit) {
        assert.ok(args.containerName, 'runContainer requires containerName')

        emit('run_started')
        console.log('running container ', args.containerName)

        resolve()
      }
    )
  }
})

module.exports = ContainerRunnerFlow
