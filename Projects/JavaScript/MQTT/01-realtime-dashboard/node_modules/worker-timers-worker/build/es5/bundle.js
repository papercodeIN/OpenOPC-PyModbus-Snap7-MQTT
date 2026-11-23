(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@babel/runtime/helpers/asyncToGenerator'), require('@babel/runtime/regenerator'), require('worker-factory'), require('@babel/runtime/helpers/slicedToArray')) :
    typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/asyncToGenerator', '@babel/runtime/regenerator', 'worker-factory', '@babel/runtime/helpers/slicedToArray'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global._asyncToGenerator, global._regeneratorRuntime, global.workerFactory, global._slicedToArray));
})(this, (function (_asyncToGenerator, _regeneratorRuntime, workerFactory, _slicedToArray) { 'use strict';

    var createClearTimer = function createClearTimer(clearTimeout, identifiersAndResolvers) {
      return function (timerId) {
        var identifiersAndResolver = identifiersAndResolvers.get(timerId);
        if (identifiersAndResolver === undefined) {
          return Promise.resolve(false);
        }
        var _identifiersAndResolv = _slicedToArray(identifiersAndResolver, 2),
          identifier = _identifiersAndResolv[0],
          resolveSetResponseResultPromise = _identifiersAndResolv[1];
        clearTimeout(identifier);
        identifiersAndResolvers["delete"](timerId);
        resolveSetResponseResultPromise(false);
        return Promise.resolve(true);
      };
    };

    var createSetTimeoutCallback = function createSetTimeoutCallback(performance, setTimeout) {
      var _setTimeoutCallback = function setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId) {
        var remainingDelay = expected - performance.now();
        if (remainingDelay > 0) {
          identifiersAndResolvers.set(timerId, [setTimeout(_setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId), resolveSetResponseResultPromise]);
        } else {
          identifiersAndResolvers["delete"](timerId);
          resolveSetResponseResultPromise(true);
        }
      };
      return _setTimeoutCallback;
    };

    var createSetTimer = function createSetTimer(identifiersAndResolvers, performance, setTimeout, setTimeoutCallback) {
      return function (delay, nowAndTimeOrigin, timerId) {
        var expected = delay + nowAndTimeOrigin - performance.timeOrigin;
        var remainingDelay = expected - performance.now();
        return new Promise(function (resolve) {
          identifiersAndResolvers.set(timerId, [setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolve, timerId), resolve]);
        });
      };
    };

    var intervalIdentifiersAndResolvers = new Map();
    var clearInterval = createClearTimer(globalThis.clearTimeout, intervalIdentifiersAndResolvers);
    var timeoutIdentifiersAndResolvers = new Map();
    var clearTimeout = createClearTimer(globalThis.clearTimeout, timeoutIdentifiersAndResolvers);
    var setTimeoutCallback = createSetTimeoutCallback(performance, globalThis.setTimeout);
    var setInterval = createSetTimer(intervalIdentifiersAndResolvers, performance, globalThis.setTimeout, setTimeoutCallback);
    var setTimeout = createSetTimer(timeoutIdentifiersAndResolvers, performance, globalThis.setTimeout, setTimeoutCallback);
    workerFactory.createWorker(self, {
      clear: function () {
        var _clear = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
          var timerId, timerType, _t;
          return _regeneratorRuntime.wrap(function (_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                timerId = _ref.timerId, timerType = _ref.timerType;
                _context.next = 1;
                return timerType === 'interval' ? clearInterval(timerId) : clearTimeout(timerId);
              case 1:
                _t = _context.sent;
                return _context.abrupt("return", {
                  result: _t
                });
              case 2:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        function clear(_x) {
          return _clear.apply(this, arguments);
        }
        return clear;
      }(),
      set: function () {
        var _set = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref2) {
          var delay, now, timerId, timerType, _t2;
          return _regeneratorRuntime.wrap(function (_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                delay = _ref2.delay, now = _ref2.now, timerId = _ref2.timerId, timerType = _ref2.timerType;
                _context2.next = 1;
                return (timerType === 'interval' ? setInterval : setTimeout)(delay, now, timerId);
              case 1:
                _t2 = _context2.sent;
                return _context2.abrupt("return", {
                  result: _t2
                });
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        function set(_x2) {
          return _set.apply(this, arguments);
        }
        return set;
      }()
    });

}));
