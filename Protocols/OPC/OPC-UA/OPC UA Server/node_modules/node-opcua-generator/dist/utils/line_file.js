"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineFile1 = void 0;
/**
 * @module node-opcua-utils
 */
const fs_1 = require("fs");
const node_opcua_utils_1 = require("node-opcua-utils");
class LineFile1 extends node_opcua_utils_1.LineFile {
    constructor() {
        super();
        this.write("// --------- This code has been automatically generated !!! " + new Date().toISOString());
        this.write("/**");
        this.write(" * @module node-opcua-types");
        this.write(" */");
    }
    save(filename) {
        (0, fs_1.writeFileSync)(filename, this.toString(), "utf-8");
    }
    saveFormat(filename, formatter) {
        const code = formatter(this.toString());
        (0, fs_1.writeFileSync)(filename, code, "utf-8");
    }
}
exports.LineFile1 = LineFile1;
//# sourceMappingURL=line_file.js.map