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
exports.getDurationGoodData = exports.getDurationBadData = exports.getPercentBadData = exports.getPercentGoodData = exports.getCountData = exports.AggregateFunction = exports.addAggregateFunctionSupport = exports.addAggregateStandardFunctionSupport = exports.getAggregateConfiguration = exports.installAggregateConfigurationOptions = exports.addAggregateSupport = void 0;
/**
 * @module node-opca-aggregates
 */
var aggregates_1 = require("./aggregates");
Object.defineProperty(exports, "addAggregateSupport", { enumerable: true, get: function () { return aggregates_1.addAggregateSupport; } });
Object.defineProperty(exports, "installAggregateConfigurationOptions", { enumerable: true, get: function () { return aggregates_1.installAggregateConfigurationOptions; } });
Object.defineProperty(exports, "getAggregateConfiguration", { enumerable: true, get: function () { return aggregates_1.getAggregateConfiguration; } });
Object.defineProperty(exports, "addAggregateStandardFunctionSupport", { enumerable: true, get: function () { return aggregates_1.addAggregateStandardFunctionSupport; } });
Object.defineProperty(exports, "addAggregateFunctionSupport", { enumerable: true, get: function () { return aggregates_1.addAggregateFunctionSupport; } });
__exportStar(require("./interpolate"), exports);
__exportStar(require("./minmax"), exports);
__exportStar(require("./interval"), exports);
__exportStar(require("./common"), exports);
__exportStar(require("./average"), exports);
__exportStar(require("./read_processed_details"), exports);
var node_opcua_constants_1 = require("node-opcua-constants");
Object.defineProperty(exports, "AggregateFunction", { enumerable: true, get: function () { return node_opcua_constants_1.AggregateFunction; } });
var count_1 = require("./count");
Object.defineProperty(exports, "getCountData", { enumerable: true, get: function () { return count_1.getCountData; } });
var percent_good_1 = require("./percent_good");
Object.defineProperty(exports, "getPercentGoodData", { enumerable: true, get: function () { return percent_good_1.getPercentGoodData; } });
var percent_bad_1 = require("./percent_bad");
Object.defineProperty(exports, "getPercentBadData", { enumerable: true, get: function () { return percent_bad_1.getPercentBadData; } });
var duration_bad_1 = require("./duration_bad");
Object.defineProperty(exports, "getDurationBadData", { enumerable: true, get: function () { return duration_bad_1.getDurationBadData; } });
var duration_good_1 = require("./duration_good");
Object.defineProperty(exports, "getDurationGoodData", { enumerable: true, get: function () { return duration_good_1.getDurationGoodData; } });
//# sourceMappingURL=index.js.map