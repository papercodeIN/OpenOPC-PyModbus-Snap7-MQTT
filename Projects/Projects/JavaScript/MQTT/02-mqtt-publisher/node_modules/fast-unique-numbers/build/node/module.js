"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUniqueNumber = exports.addUniqueNumber = void 0;
var _addUniqueNumber = require("./factories/add-unique-number");
var _cache = require("./factories/cache");
var _generateUniqueNumber = require("./factories/generate-unique-number");
const LAST_NUMBER_WEAK_MAP = new WeakMap();
const cache = (0, _cache.createCache)(LAST_NUMBER_WEAK_MAP);
const generateUniqueNumber = exports.generateUniqueNumber = (0, _generateUniqueNumber.createGenerateUniqueNumber)(cache, LAST_NUMBER_WEAK_MAP);
const addUniqueNumber = exports.addUniqueNumber = (0, _addUniqueNumber.createAddUniqueNumber)(generateUniqueNumber);