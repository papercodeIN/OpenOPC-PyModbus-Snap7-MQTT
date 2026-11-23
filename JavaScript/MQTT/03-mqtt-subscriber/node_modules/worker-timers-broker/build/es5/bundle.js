(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('broker-factory'), require('fast-unique-numbers'), require('@babel/runtime/helpers/typeof')) :
    typeof define === 'function' && define.amd ? define(['exports', 'broker-factory', 'fast-unique-numbers', '@babel/runtime/helpers/typeof'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.workerTimersBroker = {}, global.brokerFactory, global.fastUniqueNumbers, global._typeof));
})(this, (function (exports, brokerFactory, fastUniqueNumbers, _typeof) { 'use strict';

    var createClearIntervalFactory = function createClearIntervalFactory(scheduledIntervalsState) {
      return function (clear) {
        return function (timerId) {
          if (_typeof(scheduledIntervalsState.get(timerId)) === 'symbol') {
            scheduledIntervalsState.set(timerId, null);
            clear(timerId).then(function () {
              scheduledIntervalsState["delete"](timerId);
            });
          }
        };
      };
    };

    var createClearTimeoutFactory = function createClearTimeoutFactory(scheduledTimeoutsState) {
      return function (clear) {
        return function (timerId) {
          if (_typeof(scheduledTimeoutsState.get(timerId)) === 'symbol') {
            scheduledTimeoutsState.set(timerId, null);
            clear(timerId).then(function () {
              scheduledTimeoutsState["delete"](timerId);
            });
          }
        };
      };
    };

    var createSetIntervalFactory = function createSetIntervalFactory(generateUniqueNumber, scheduledIntervalsState) {
      return function (set) {
        return function (func) {
          var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }
          var symbol = Symbol();
          var timerId = generateUniqueNumber(scheduledIntervalsState);
          scheduledIntervalsState.set(timerId, symbol);
          var _schedule = function schedule() {
            return set(delay, timerId).then(function () {
              var state = scheduledIntervalsState.get(timerId);
              if (state === undefined) {
                throw new Error('The timer is in an undefined state.');
              }
              if (state === symbol) {
                func.apply(void 0, args);
                // Doublecheck if the interval should still be rescheduled because it could have been cleared inside of func().
                if (scheduledIntervalsState.get(timerId) === symbol) {
                  _schedule();
                }
              }
            });
          };
          _schedule();
          return timerId;
        };
      };
    };

    var createSetTimeoutFactory = function createSetTimeoutFactory(generateUniqueNumber, scheduledTimeoutsState) {
      return function (set) {
        return function (func) {
          var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }
          var symbol = Symbol();
          var timerId = generateUniqueNumber(scheduledTimeoutsState);
          scheduledTimeoutsState.set(timerId, symbol);
          set(delay, timerId).then(function () {
            var state = scheduledTimeoutsState.get(timerId);
            if (state === undefined) {
              throw new Error('The timer is in an undefined state.');
            }
            if (state === symbol) {
              // A timeout can be savely deleted because it is only called once.
              scheduledTimeoutsState["delete"](timerId);
              func.apply(void 0, args);
            }
          });
          return timerId;
        };
      };
    };

    // Prefilling the Maps with a function indexed by zero is necessary to be compliant with the specification.
    var scheduledIntervalsState = new Map([[0, null]]); // tslint:disable-line no-empty
    var scheduledTimeoutsState = new Map([[0, null]]); // tslint:disable-line no-empty
    var createClearInterval = createClearIntervalFactory(scheduledIntervalsState);
    var createClearTimeout = createClearTimeoutFactory(scheduledTimeoutsState);
    var createSetInterval = createSetIntervalFactory(fastUniqueNumbers.generateUniqueNumber, scheduledIntervalsState);
    var createSetTimeout = createSetTimeoutFactory(fastUniqueNumbers.generateUniqueNumber, scheduledTimeoutsState);
    var wrap = brokerFactory.createBroker({
      clearInterval: function clearInterval(_ref) {
        var call = _ref.call;
        return createClearInterval(function (timerId) {
          return call('clear', {
            timerId: timerId,
            timerType: 'interval'
          });
        });
      },
      clearTimeout: function clearTimeout(_ref2) {
        var call = _ref2.call;
        return createClearTimeout(function (timerId) {
          return call('clear', {
            timerId: timerId,
            timerType: 'timeout'
          });
        });
      },
      setInterval: function setInterval(_ref3) {
        var call = _ref3.call;
        return createSetInterval(function (delay, timerId) {
          return call('set', {
            delay: delay,
            now: performance.timeOrigin + performance.now(),
            timerId: timerId,
            timerType: 'interval'
          });
        });
      },
      setTimeout: function setTimeout(_ref4) {
        var call = _ref4.call;
        return createSetTimeout(function (delay, timerId) {
          return call('set', {
            delay: delay,
            now: performance.timeOrigin + performance.now(),
            timerId: timerId,
            timerType: 'timeout'
          });
        });
      }
    });
    var load = function load(url) {
      var worker = new Worker(url);
      return wrap(worker);
    };

    exports.load = load;
    exports.wrap = wrap;

}));
