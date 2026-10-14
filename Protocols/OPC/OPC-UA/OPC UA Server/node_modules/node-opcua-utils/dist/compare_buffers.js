"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare_buffers = compare_buffers;
/**
 * @module node-opcua-utils
 */
// tslint:disable:no-console
const chalk_1 = __importDefault(require("chalk"));
const buffer_ellipsis_1 = require("./buffer_ellipsis");
function compare_buffers(buf1, buf2, max_length) {
    max_length = max_length || buf2.length;
    const block_length = 80;
    let cursor = 0;
    while (cursor < max_length) {
        const slice1 = buf1.subarray(cursor, cursor + block_length);
        const slice2 = buf2.subarray(cursor, cursor + block_length);
        if (slice2.toString("hex") !== slice1.toString("hex")) {
            console.log("pos = ", cursor);
            console.log("slice1 :", chalk_1.default.yellow((0, buffer_ellipsis_1.buffer_ellipsis)(slice1)));
            console.log("slice2 :", chalk_1.default.blue((0, buffer_ellipsis_1.buffer_ellipsis)(slice2)));
        }
        cursor += block_length;
    }
    // xx buf1.length.should.equal(max_length);
}
//# sourceMappingURL=compare_buffers.js.map