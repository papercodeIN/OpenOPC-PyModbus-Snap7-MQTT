"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraDataTypeManager = void 0;
/**
 * @module node-opcua-client-dynamic-extension-object
 */
const util_1 = require("util");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_factory_1 = require("node-opcua-factory");
class ExtraDataTypeManager {
    constructor() {
        this.namespaceArray = [];
        this.dataTypeFactoryMapByNamespace = {};
        /* */
    }
    setNamespaceArray(namespaceArray) {
        this.namespaceArray = namespaceArray;
    }
    hasDataTypeFactory(namespaceIndex) {
        return !!Object.prototype.hasOwnProperty.call(this.dataTypeFactoryMapByNamespace, namespaceIndex);
    }
    registerDataTypeFactory(namespaceIndex, dataTypeFactory) {
        /* istanbul ignore next */
        (0, node_opcua_assert_1.assert)(namespaceIndex !== 0, "registerTypeDictionary cannot be used for namespace 0");
        if (this.hasDataTypeFactory(namespaceIndex)) {
            throw new Error("Dictionary already registered");
        }
        this.dataTypeFactoryMapByNamespace[namespaceIndex] = dataTypeFactory;
    }
    getDataTypeFactoryForNamespace(namespaceIndex) {
        (0, node_opcua_assert_1.assert)(namespaceIndex !== 0, "getTypeDictionaryForNamespace cannot be used for namespace 0");
        return this.dataTypeFactoryMapByNamespace[namespaceIndex];
    }
    getDataTypeFactory(namespaceIndex) {
        if (namespaceIndex === 0) {
            return (0, node_opcua_factory_1.getStandardDataTypeFactory)();
        }
        return this.dataTypeFactoryMapByNamespace[namespaceIndex];
    }
    getExtensionObjectConstructorFromDataType(dataTypeNodeId) {
        const dataTypeFactory = this.getDataTypeFactory(dataTypeNodeId.namespace);
        if (!dataTypeFactory) {
            throw new Error("cannot find dataFactory for namespace=" + dataTypeNodeId.namespace + " when requested for " + dataTypeNodeId.toString());
        }
        // find schema corresponding to dataTypeNodeId in typeDictionary
        const Constructor = dataTypeFactory.findStructureInfoForDataType(dataTypeNodeId).constructor;
        if (!Constructor) {
            throw new Error("Cannot find Extension Object Constructor for Abstract dataType");
        }
        return Constructor;
    }
    getExtensionObjectConstructorFromBinaryEncoding(binaryEncodingNodeId) {
        const dataTypeFactory = this.getDataTypeFactoryForNamespace(binaryEncodingNodeId.namespace);
        const Constructor = dataTypeFactory.getConstructor(binaryEncodingNodeId);
        if (!Constructor) {
            throw new Error("getExtensionObjectConstructorFromBinaryEncoding cannot find constructor for binaryEncoding " +
                binaryEncodingNodeId.toString());
        }
        return Constructor;
    }
    toString() {
        const l = [];
        function write(...args) {
            l.push(util_1.format.apply(util_1.format, args));
        }
        write("ExtraDataTypeManager");
        for (let n = 0; n < this.namespaceArray.length; n++) {
            write("------------- namespace:", this.namespaceArray[n]);
            const dataFactory = this.dataTypeFactoryMapByNamespace[n];
            if (!dataFactory) {
                continue;
            }
            write(dataFactory.toString());
        }
        return l.join("\n");
    }
}
exports.ExtraDataTypeManager = ExtraDataTypeManager;
//# sourceMappingURL=extra_data_type_manager.js.map