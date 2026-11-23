(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/asyncToGenerator'), require('@babel/runtime/regenerator'), require('@babel/runtime/helpers/defineProperty'), require('fast-unique-numbers')) :
    typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/asyncToGenerator', '@babel/runtime/regenerator', '@babel/runtime/helpers/defineProperty', 'fast-unique-numbers'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.workerFactory = {}, global._asyncToGenerator, global._regeneratorRuntime, global._defineProperty, global.fastUniqueNumbers));
})(this, (function (exports, _asyncToGenerator, _regeneratorRuntime, _defineProperty, fastUniqueNumbers) { 'use strict';

    var JSON_RPC_ERROR_CODES = {
      INTERNAL_ERROR: -32603,
      INVALID_PARAMS: -32602,
      METHOD_NOT_FOUND: -32601
    };
    var createErrorWithMessageAndStatus = function createErrorWithMessageAndStatus(message, status) {
      return Object.assign(new Error(message), {
        status: status
      });
    };
    var renderMethodNotFoundError = function renderMethodNotFoundError(method) {
      return createErrorWithMessageAndStatus("The requested method called \"".concat(method, "\" is not supported."), JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND);
    };
    var renderMissingResponseError = function renderMissingResponseError(method) {
      return createErrorWithMessageAndStatus("The handler of the method called \"".concat(method, "\" returned no required result."), JSON_RPC_ERROR_CODES.INTERNAL_ERROR);
    };
    var renderUnexpectedResultError = function renderUnexpectedResultError(method) {
      return createErrorWithMessageAndStatus("The handler of the method called \"".concat(method, "\" returned an unexpected result."), JSON_RPC_ERROR_CODES.INTERNAL_ERROR);
    };
    var renderUnknownPortIdError = function renderUnknownPortIdError(portId) {
      return createErrorWithMessageAndStatus("The specified parameter called \"portId\" with the given value \"".concat(portId, "\" does not identify a port connected to this worker."), JSON_RPC_ERROR_CODES.INVALID_PARAMS);
    };

    var createMessageHandler = function createMessageHandler(receiver, workerImplementation) {
      return /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
          var _ref$data, id, method, params, messageHandler, response, synchronousResponse, result, _synchronousResponse$, transferables, message, _err$status, status, _t, _t2;
          return _regeneratorRuntime.wrap(function (_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _ref$data = _ref.data, id = _ref$data.id, method = _ref$data.method, params = _ref$data.params;
                messageHandler = workerImplementation[method];
                _context.prev = 1;
                if (!(messageHandler === undefined)) {
                  _context.next = 2;
                  break;
                }
                throw renderMethodNotFoundError(method);
              case 2:
                response = params === undefined ? messageHandler() : messageHandler(params);
                if (!(response === undefined)) {
                  _context.next = 3;
                  break;
                }
                throw renderMissingResponseError(method);
              case 3:
                if (!(response instanceof Promise)) {
                  _context.next = 5;
                  break;
                }
                _context.next = 4;
                return response;
              case 4:
                _t = _context.sent;
                _context.next = 6;
                break;
              case 5:
                _t = response;
              case 6:
                synchronousResponse = _t;
                if (!(id === null)) {
                  _context.next = 8;
                  break;
                }
                if (!(synchronousResponse.result !== undefined)) {
                  _context.next = 7;
                  break;
                }
                throw renderUnexpectedResultError(method);
              case 7:
                _context.next = 10;
                break;
              case 8:
                if (!(synchronousResponse.result === undefined)) {
                  _context.next = 9;
                  break;
                }
                throw renderUnexpectedResultError(method);
              case 9:
                result = synchronousResponse.result, _synchronousResponse$ = synchronousResponse.transferables, transferables = _synchronousResponse$ === void 0 ? [] : _synchronousResponse$;
                receiver.postMessage({
                  id: id,
                  result: result
                }, transferables);
              case 10:
                _context.next = 12;
                break;
              case 11:
                _context.prev = 11;
                _t2 = _context["catch"](1);
                message = _t2.message, _err$status = _t2.status, status = _err$status === void 0 ? -32603 : _err$status;
                receiver.postMessage({
                  error: {
                    code: status,
                    message: message
                  },
                  id: id
                });
              case 12:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 11]]);
        }));
        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }();
    };

    // Bug #1: Safari does currently not support to use transferables.
    var isSupportingTransferables = function isSupportingTransferables() {
      return new Promise(function (resolve) {
        var arrayBuffer = new ArrayBuffer(0);
        var _MessageChannel = new MessageChannel(),
          port1 = _MessageChannel.port1,
          port2 = _MessageChannel.port2;
        port1.onmessage = function (_ref) {
          var data = _ref.data;
          return resolve(data !== null);
        };
        port2.postMessage(arrayBuffer, [arrayBuffer]);
      });
    };

    function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
    function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
    var DESTROY_WORKER_FUNCTIONS = new Map();
    var extendWorkerImplementation = function extendWorkerImplementation(createWorker, partialWorkerImplementation, isSupportedFunction) {
      return _objectSpread(_objectSpread({}, partialWorkerImplementation), {}, {
        connect: function connect(_ref) {
          var port = _ref.port;
          port.start();
          var destroyWorker = createWorker(port, partialWorkerImplementation);
          var portId = fastUniqueNumbers.generateUniqueNumber(DESTROY_WORKER_FUNCTIONS);
          DESTROY_WORKER_FUNCTIONS.set(portId, function () {
            destroyWorker();
            port.close();
            DESTROY_WORKER_FUNCTIONS["delete"](portId);
          });
          return {
            result: portId
          };
        },
        disconnect: function disconnect(_ref2) {
          var portId = _ref2.portId;
          var destroyWorker = DESTROY_WORKER_FUNCTIONS.get(portId);
          if (destroyWorker === undefined) {
            throw renderUnknownPortIdError(portId);
          }
          destroyWorker();
          return {
            result: null
          };
        },
        isSupported: function () {
          var _isSupported = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
            var isSelfSupported, result, synchronousResult, _t;
            return _regeneratorRuntime.wrap(function (_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 1;
                  return isSupportingTransferables();
                case 1:
                  isSelfSupported = _context.sent;
                  if (!isSelfSupported) {
                    _context.next = 5;
                    break;
                  }
                  result = isSupportedFunction();
                  if (!(result instanceof Promise)) {
                    _context.next = 3;
                    break;
                  }
                  _context.next = 2;
                  return result;
                case 2:
                  _t = _context.sent;
                  _context.next = 4;
                  break;
                case 3:
                  _t = result;
                case 4:
                  synchronousResult = _t;
                  return _context.abrupt("return", {
                    result: synchronousResult
                  });
                case 5:
                  return _context.abrupt("return", {
                    result: false
                  });
                case 6:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          function isSupported() {
            return _isSupported.apply(this, arguments);
          }
          return isSupported;
        }()
      });
    };

    var _createWorker = function createWorker(receiver, workerImplementation) {
      var isSupportedFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return true;
      };
      var fullWorkerImplementation = extendWorkerImplementation(_createWorker, workerImplementation, isSupportedFunction);
      var messageHandler = createMessageHandler(receiver, fullWorkerImplementation);
      receiver.addEventListener('message', messageHandler);
      return function () {
        return receiver.removeEventListener('message', messageHandler);
      };
    };

    exports.createWorker = _createWorker;
    exports.isSupported = isSupportingTransferables;

}));
