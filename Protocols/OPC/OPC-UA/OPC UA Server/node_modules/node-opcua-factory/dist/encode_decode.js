"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEncode = defaultEncode;
exports.defaultDecode = defaultDecode;
exports.defaultGuidValue = defaultGuidValue;
exports.toJSONGuid = toJSONGuid;
exports.encodeAny = encodeAny;
exports.decodeAny = decodeAny;
exports.encodeNull = encodeNull;
exports.decodeNull = decodeNull;
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
function defaultEncode(value, stream) {
    /** */
}
function defaultDecode(stream) {
    return null;
}
function defaultGuidValue() {
    return Buffer.alloc(0);
}
function toJSONGuid(value) {
    if (typeof value === "string") {
        return value;
    }
    (0, node_opcua_assert_1.default)(value instanceof Buffer);
    return value.toString("base64");
}
function encodeAny(value, stream) {
    (0, node_opcua_assert_1.default)(false, "type 'Any' cannot be encoded");
}
function decodeAny(stream) {
    (0, node_opcua_assert_1.default)(false, "type 'Any' cannot be decoded");
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function encodeNull(value, stream) { }
function decodeNull(stream) {
    return null;
}
//# sourceMappingURL=encode_decode.js.map