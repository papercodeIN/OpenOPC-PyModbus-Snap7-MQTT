"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStandardDataTypeFactory = getStandardDataTypeFactory;
exports.getStructureTypeConstructor = getStructureTypeConstructor;
exports.dump = dump;
const datatype_factory_1 = require("./datatype_factory");
let globalFactory;
function getStandardDataTypeFactory() {
    if (!globalFactory) {
        globalFactory = new datatype_factory_1.DataTypeFactory([]);
        globalFactory.targetNamespace = "http://opcfoundation.org/UA/";
    }
    return globalFactory;
}
function getStructureTypeConstructor(typeName) {
    const structureInfo = getStandardDataTypeFactory().getStructureInfoByTypeName(typeName);
    if (!structureInfo) {
        throw new Error("cannot find Structure Information for " + typeName);
    }
    if (!structureInfo.constructor) {
        throw new Error("cannot  Structure is Abstract ! " + typeName);
    }
    return structureInfo.constructor;
}
/* istanbul ignore next */
function dump() {
    getStandardDataTypeFactory().dump();
}
//# sourceMappingURL=get_standard_data_type_factory.js.map