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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const worker_timers_1 = require("worker-timers");
const is_browser_1 = __importStar(require("./is-browser"));
const workerTimer = {
    set: worker_timers_1.setInterval,
    clear: worker_timers_1.clearInterval,
};
const nativeTimer = {
    set: (func, time) => setInterval(func, time),
    clear: (timerId) => clearInterval(timerId),
};
const getTimer = (variant) => {
    switch (variant) {
        case 'native': {
            return nativeTimer;
        }
        case 'worker': {
            return workerTimer;
        }
        case 'auto':
        default: {
            return is_browser_1.default && !is_browser_1.isWebWorker && !is_browser_1.isReactNativeBrowser
                ? workerTimer
                : nativeTimer;
        }
    }
};
exports.default = getTimer;
//# sourceMappingURL=get-timer.js.map