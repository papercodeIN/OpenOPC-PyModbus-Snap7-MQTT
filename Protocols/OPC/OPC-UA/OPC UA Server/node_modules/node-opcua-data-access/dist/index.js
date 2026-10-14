"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisScaleEnumeration = exports.AxisInformation = void 0;
/**
 * @module node-opcua-data-access
 */
__exportStar(require("./Range"), exports);
__exportStar(require("./EUInformation"), exports);
var node_opcua_types_1 = require("node-opcua-types");
Object.defineProperty(exports, "AxisInformation", { enumerable: true, get: function () { return node_opcua_types_1.AxisInformation; } });
Object.defineProperty(exports, "AxisScaleEnumeration", { enumerable: true, get: function () { return node_opcua_types_1.AxisScaleEnumeration; } });
//# sourceMappingURL=index.js.map