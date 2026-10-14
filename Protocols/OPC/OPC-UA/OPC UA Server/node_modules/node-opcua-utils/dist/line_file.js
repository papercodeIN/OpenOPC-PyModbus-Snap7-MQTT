"use strict";
/**
 * @module node-opcua-utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineFile = void 0;
class LineFile {
    constructor() {
        this._line = [];
    }
    write(...args) {
        let str = "";
        // tslint:disable:prefer-for-of
        for (let i = 0; i < args.length; i++) {
            str += args[i];
        }
        this._line.push(str);
    }
    toString(endOfLine = "\n") {
        return this._line.join(endOfLine);
    }
}
exports.LineFile = LineFile;
//# sourceMappingURL=line_file.js.map