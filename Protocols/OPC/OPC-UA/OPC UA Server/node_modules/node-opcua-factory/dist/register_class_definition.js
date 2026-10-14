"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClassDefinition = registerClassDefinition;
const get_standard_data_type_factory_1 = require("./get_standard_data_type_factory");
function registerClassDefinition(dataTypeNodeId, className, classConstructor) {
    return (0, get_standard_data_type_factory_1.getStandardDataTypeFactory)().registerClassDefinition(dataTypeNodeId, className, classConstructor);
}
//# sourceMappingURL=register_class_definition.js.map