'use strict'

var assert = require('chai').assert

var ContainerRunnerFlow = require('../container-runner-flow')

describe('ContainerRunnerFlow test', function () {
  it ('should create instanceof ContainerRunnerFlow', function () {
    var flow = ContainerRunnerFlow.create()

    assert.equal(
      ContainerRunnerFlow.isPrototypeOf(flow),
      true
    )
  })

  it ('should execute cloneRepo step', function (done) {
    var flow = ContainerRunnerFlow.create()

    flow
      .cloneRepo({ url: 'http://github.com/anara123/project' })
      .on('finish_clone', () => {
        done()
      })
  })

  it ('should execute buildContainer step after cloneRepo and resolve containerName', function (done) {
    var flow = ContainerRunnerFlow.create()
    var invoked = false

    flow
      .cloneRepo({ url: 'http://github.com/anara123/project' }).on('finish_clone', () => { invoked = true })
      .buildContainer({ dockerFilePath: '/builds/' }).on('log', console.log)
      .on('finish_build', (data) => {
          assert.ok(data.containerName)
          assert.ok(invoked)
          done()
      })
  })

  it ('should execute runContainer', function (done) {
    var flow = ContainerRunnerFlow.create()

    flow
    .cloneRepo({ url: 'http://github.com/anara123/project' })
    .buildContainer({ dockerFilePath: '/builds/' })
    .runContainer()
    .on('run_started', () => {
      done()
    })
    .on('error', (err) => {
      done(err)
    })
  })

  it ('should emit error event when buildContainer doesn\'t executed before runContainer', function () {
    var flow = ContainerRunnerFlow.create()

    flow
    .cloneRepo({ url: 'http://github.com/anara123/project' })
    .runContainer()
    .on('error', (err) => {
      assert.ok(err)
      done()
    })
  })
})
