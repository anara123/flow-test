var assert = require('chai').assert
var EventEmitter = require('events').EventEmitter

var Flow = require('../flow')

describe ('#flow test', function () {
  it ('flow should be type of EventEmitter', function () {
    var flow = Flow.create()
    assert.ok(
      flow.on && flow.emit,
      true)
  })

  it ('flow should have promiseChain', function () {
    var flow = Flow.create()
    assert.ok(flow.promiseChain)
  })

  describe ('#add add new step to the flow', function () {
    it ('should execute the step', function (done) {
      var flow = Flow.create()

      flow.add(function (args, resolve, reject, emit) {
        done()
      })
    })

    it ('should execute 2 steps in chain', function (done) {
      var flow = Flow.create()

      flow
        .add(function (args, resolve, reject, emit) {
          // step 1
          resolve()
        })
        .add(function (args, resolve, reject, emit) {
          // step 2
          done()
        })
    })

    it ('result of step 1 should be passed to step 2 after finished', function (done) {
      var flow = Flow.create()

      flow
        .add(function (args, resolve, reject, emit) {
          // step 1
          resolve({ result: 12 })
        })
        .add(function (args, resolve, reject, emit) {
          // step 2
          assert.equal(args.result, 12)
          done()
        })
    })

    it ('should return EventEmitter in order to hook to event', function () {
      var flow = Flow.create()

      var result = flow
        .add(function (args, resolve, reject, emit) {
          // step 1
          emit('start', 12)
          resolve()
        })

      assert.ok(result.on)
    })

    it ('should return instance of Flow', function () {
      var flow = Flow.create()

      var result = flow.add(function (args, resolve, reject, emit) {
        // step 1
        emit('start', 12)
        resolve()
      })

      assert.equal(
        Flow.isPrototypeOf(result),
        true)
    })

    it ('should be able to hook to event', function (done) {
      var flow = Flow.create()

      flow
        .add(function (args, resolve, reject, emit) {
          // step 1
          emit('start', 12)
          resolve(12)
        })
        .on('start', function (data) {
          assert.equal(data, 12)
          done()
        })
    })
  })

  describe ('#on - can hook/listen to any event happening inside of step', function () {
    it ('#on should return Flow instance', function () {
      var flow = Flow.create()
      var result = flow.on('start', () => {})

      assert.equal(
        Flow.isPrototypeOf(result),
        true)
    })
  })
})
