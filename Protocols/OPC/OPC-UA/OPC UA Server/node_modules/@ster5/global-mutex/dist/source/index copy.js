"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withLock = exports.defaultStaleDuration = void 0;
const proper_lockfile_1 = require("proper-lockfile");
exports.defaultStaleDuration = 2 * 60 * 1000; // two minutes
function withLock(options, action) {
    return __awaiter(this, void 0, void 0, function* () {
        options.stale = options.stale || exports.defaultStaleDuration;
        const { lockfile } = options;
        yield (0, proper_lockfile_1.lock)(lockfile, options);
        try {
            return yield action();
        }
        finally {
            try {
                (0, proper_lockfile_1.unlock)(lockfile, options);
            }
            catch (err) {
                // istanbul ignore next
                console.log("Error in Unlock !!!", err.message);
            }
        }
    });
}
exports.withLock = withLock;
//# sourceMappingURL=index%20copy.js.map