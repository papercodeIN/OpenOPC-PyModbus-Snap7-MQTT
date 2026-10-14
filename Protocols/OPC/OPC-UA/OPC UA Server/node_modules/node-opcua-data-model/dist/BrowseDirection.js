"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationBrowseDirection = exports.schemaBrowseDirection = exports.BrowseDirection = void 0;
exports.encodeBrowseDirection = encodeBrowseDirection;
exports.decodeBrowseDirection = decodeBrowseDirection;
const node_opcua_factory_1 = require("node-opcua-factory");
var BrowseDirection;
(function (BrowseDirection) {
    BrowseDirection[BrowseDirection["Forward"] = 0] = "Forward";
    BrowseDirection[BrowseDirection["Inverse"] = 1] = "Inverse";
    BrowseDirection[BrowseDirection["Both"] = 2] = "Both";
    BrowseDirection[BrowseDirection["Invalid"] = 3] = "Invalid"; //
})(BrowseDirection || (exports.BrowseDirection = BrowseDirection = {}));
exports.schemaBrowseDirection = {
    name: "BrowseDirection",
    enumValues: BrowseDirection
    // decode: (stream: BinaryStream) => {
    //
    //     const value = stream.readInteger();
    //     if (value < 0 || value > 2) {
    //         return BrowseDirection.Invalid;
    //     }
    //     return BrowseDirection[value];
    // }
};
function encodeBrowseDirection(value, stream) {
    stream.writeUInt32(value);
}
function decodeBrowseDirection(stream, _value) {
    let value = stream.readUInt32();
    if (value < 0 || value > 3 || Number.isNaN(value)) {
        value = BrowseDirection.Invalid;
    }
    return value;
}
exports._enumerationBrowseDirection = (0, node_opcua_factory_1.registerEnumeration)(exports.schemaBrowseDirection);
//# sourceMappingURL=BrowseDirection.js.map