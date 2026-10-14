"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWrite = void 0;
const makeWrite = (f) => {
    const _f = (...args) => f.write(...args);
    _f.indent = () => {
        /** */
    };
    _f.pop = () => {
        /** */
    };
    return _f;
};
exports.makeWrite = makeWrite;
//# sourceMappingURL=write_func.js.map