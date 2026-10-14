"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_new_id = generate_new_id;
exports.next_available_id = next_available_id;
exports.is_internal_id = is_internal_id;
/**
 * @module node-opcua-factory
 */
const _FIRST_INTERNAL_ID = 0xfffe0000;
let _nextAvailableId = _FIRST_INTERNAL_ID;
function generate_new_id() {
    _nextAvailableId += 1;
    return _nextAvailableId;
}
function next_available_id() {
    return -1;
}
function is_internal_id(value) {
    return value >= _FIRST_INTERNAL_ID;
}
//# sourceMappingURL=id_generator.js.map