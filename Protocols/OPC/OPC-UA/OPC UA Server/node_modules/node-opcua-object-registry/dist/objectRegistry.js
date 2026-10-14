"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRegistry = void 0;
/**
 * @module node-opcua-object-registry
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const gRegistries = [];
let hashCounter = 1;
class ObjectRegistry {
    constructor() {
        this._cache = {};
        gRegistries.push(this);
    }
    getClassName() {
        return this._objectTypeName ? this._objectTypeName : "<???>";
    }
    register(obj) {
        if (!this._objectTypeName) {
            this._objectTypeName = obj.constructor.name;
        }
        if (!obj._____hash) {
            obj._____hash = hashCounter;
            hashCounter += 1;
            this._cache[obj._____hash] = obj;
        }
        // istanbul ignore next
        if (ObjectRegistry.doDebug) {
            obj._____trace = (0, node_opcua_debug_1.traceFromThisProjectOnly)();
        }
    }
    unregister(obj) {
        this._cache[obj._____hash] = null;
        obj._____trace = null;
        delete this._cache[obj._____hash];
    }
    count() {
        return Object.keys(this._cache).length;
    }
    toString() {
        const className = this.getClassName();
        let str = " className :" + className + " found => " + this.count() + " object leaking\n";
        for (const obj of Object.values(this._cache)) {
            str += obj.constructor.name + " " + obj.toString() + "\n";
        }
        if (ObjectRegistry.doDebug) {
            for (const [key, cachedObject] of Object.entries(this._cache)) {
                (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(cachedObject, "_____trace"));
                str += "   " + key + cachedObject._____trace + "\n";
            }
        }
        return str;
    }
}
exports.ObjectRegistry = ObjectRegistry;
ObjectRegistry.doDebug = false;
ObjectRegistry.registries = gRegistries;
ObjectRegistry.doDebug = typeof process === "object" ? (process?.env?.NODEOPCUA_REGISTRY?.match(/DEBUG/) ? true : false) : false;
if (ObjectRegistry.doDebug) {
    console.log("ObjectRegistry.doDebug = ", ObjectRegistry.doDebug);
}
//# sourceMappingURL=objectRegistry.js.map