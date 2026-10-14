"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateStructuredTypeSchema = getOrCreateStructuredTypeSchema;
/* eslint-disable max-depth */
/* eslint-disable max-statements */
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const dynamic_extension_object_1 = require("./dynamic_extension_object");
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const doDebug = true; // process.env.DEBUG && process.env.DEBUG.includes("node-opcua-schemas");
function _removeNamespacePart(str) {
    if (!str) {
        return str || "";
    }
    const data = str.split(":");
    return data.length > 1 ? data[1] : str;
}
function _getNamespacePart(str) {
    return str.split(":")[0];
}
function _adjustFieldTypeName(fieldTypeName) {
    // special cases
    if (fieldTypeName === "UAString" || fieldTypeName === "CharArray") {
        fieldTypeName = "String";
    }
    if (fieldTypeName === "UABoolean") {
        fieldTypeName = "Boolean";
    }
    return fieldTypeName;
}
function getOrCreateStructuredTypeSchema(name, typeDictionary, dataTypeFactory, idProvider) {
    function _getOrCreateStructuredTypeSchema(_name) {
        if (dataTypeFactory.hasStructureByTypeName(_name)) {
            return dataTypeFactory.getStructuredTypeSchema(_name);
        }
        if (dataTypeFactory.hasEnumeration(_name)) {
            return dataTypeFactory.getEnumeration(_name);
        }
        if (dataTypeFactory.hasBuiltInType(_name)) {
            return dataTypeFactory.getBuiltInType(_name);
        }
        // construct it !
        const structuredType = typeDictionary.getStructuredTypesRawByName(_name);
        if (!structuredType) {
            throw new Error("Cannot find structuredType " + _name);
        }
        structuredType.baseType = _removeNamespacePart(structuredType.baseType);
        structuredType.baseType = structuredType.baseType ? structuredType.baseType : "ExtensionObject";
        const baseSchema = typeDictionary.getStructuredTypesRawByName(structuredType.baseType);
        // remove redundant fields
        // Note: Some files do not have SourceType property and may be replicated here,
        //       but they belong to the base class and shall be removed.
        //       For instance, DataTypeSchemaHeader => UABinaryFileDataType
        if (baseSchema && baseSchema.fields && baseSchema.name !== "ExtensionObject") {
            structuredType.fields = structuredType.fields.filter((field) => {
                const name = field.name;
                const index = baseSchema.fields.findIndex((f) => f.name === name);
                // istanbul ignore next
                if (index >= 0) {
                    errorLog("Warning : find duplicated field from base structure : field name ", name, "baseSchema = ", baseSchema.name, "schema =", structuredType.name);
                }
                return index < 0;
            });
        }
        applyOnFields();
        const schema = new node_opcua_factory_1.StructuredTypeSchema({
            ...structuredType,
            dataTypeFactory
        });
        const ids = idProvider.getDataTypeAndEncodingId(schema.name);
        if (!ids) {
            // This may happen if the type is abstract or if the type refers to an internal ExtensionObject
            // that can only exist inside another extension object. This Type of extension object cannot
            // be instantiated as a standalone object and does not have encoding nodeIds...
            const Constructor = (0, dynamic_extension_object_1.createDynamicObjectConstructor)(schema, dataTypeFactory);
            return schema;
        }
        schema.dataTypeNodeId = ids.dataTypeNodeId;
        if (schema.dataTypeNodeId.namespace === 0 && schema.dataTypeNodeId.value === 0) {
            // this extension object is from namespace 0  may exist already in the dataTypeFactory
            const existing = dataTypeFactory.hasStructureByTypeName(schema.name);
            if (existing) {
                return schema;
            }
        }
        schema.encodingDefaultXml = node_opcua_nodeid_1.ExpandedNodeId.fromNodeId(ids.xmlEncodingNodeId);
        schema.encodingDefaultJson = node_opcua_nodeid_1.ExpandedNodeId.fromNodeId(ids.jsonEncodingNodeId);
        schema.encodingDefaultBinary = node_opcua_nodeid_1.ExpandedNodeId.fromNodeId(ids.binaryEncodingNodeId);
        // note: it is valid to have consructed element that have no encoding
        //       when those elements are abstract or only used internaly
        const Constructor = (0, dynamic_extension_object_1.createDynamicObjectConstructor)(schema, dataTypeFactory);
        Constructor.encodingDefaultBinary = schema.encodingDefaultBinary;
        Constructor.encodingDefaultXml = schema.encodingDefaultXml;
        Constructor.encodingDefaultJson = schema.encodingDefaultJson;
        return schema;
        function applyOnFields() {
            for (const field of structuredType.fields) {
                const fieldType = field.fieldType;
                if (!field.schema) {
                    const prefix = _getNamespacePart(fieldType);
                    const fieldTypeName = _adjustFieldTypeName(_removeNamespacePart(fieldType));
                    switch (prefix) {
                        case "ua":
                            field.fieldType = fieldTypeName;
                            if ((0, node_opcua_factory_1.hasBuiltInType)(fieldTypeName)) {
                                field.category = node_opcua_factory_1.FieldCategory.basic;
                                field.schema = (0, node_opcua_factory_1.getBuiltInType)(fieldTypeName);
                            }
                            else if (dataTypeFactory.hasStructureByTypeName(fieldTypeName)) {
                                field.category = node_opcua_factory_1.FieldCategory.complex;
                                field.schema = dataTypeFactory.getStructuredTypeSchema(fieldTypeName);
                            }
                            else {
                                field.category = node_opcua_factory_1.FieldCategory.basic;
                                // try in this
                                field.schema = _getOrCreateStructuredTypeSchema(fieldTypeName);
                                // istanbul ignore next
                                if (!field.schema) {
                                    errorLog("What should I do ??", fieldTypeName, " ", dataTypeFactory.hasStructureByTypeName(fieldTypeName));
                                }
                                else {
                                    if ((0, node_opcua_factory_1.hasBuiltInType)(fieldTypeName)) {
                                        field.category = node_opcua_factory_1.FieldCategory.basic;
                                    }
                                    else {
                                        field.category = node_opcua_factory_1.FieldCategory.complex;
                                    }
                                }
                            }
                            break;
                        case "opc":
                            if ((fieldTypeName === "UAString" || fieldTypeName === "String") && field.name === "IndexRange") {
                                field.fieldType = "NumericRange";
                            }
                            else {
                                field.fieldType = fieldTypeName;
                            }
                            if (!(0, node_opcua_factory_1.hasBuiltInType)(fieldTypeName)) {
                                throw new Error("Unknown basic type " + fieldTypeName);
                            }
                            field.category = node_opcua_factory_1.FieldCategory.basic;
                            break;
                        default:
                            field.fieldType = fieldTypeName;
                            if (dataTypeFactory.hasEnumeration(fieldTypeName)) {
                                field.category = node_opcua_factory_1.FieldCategory.enumeration;
                                const enumeratedType = dataTypeFactory.getEnumeration(fieldTypeName);
                                field.schema = enumeratedType;
                            }
                            else if (dataTypeFactory.hasStructureByTypeName(fieldTypeName)) {
                                field.category = node_opcua_factory_1.FieldCategory.complex;
                                const schema1 = dataTypeFactory.getStructuredTypeSchema(fieldTypeName);
                                field.schema = schema1;
                            }
                            break;
                    }
                }
            }
        }
    }
    return _getOrCreateStructuredTypeSchema(name);
}
//# sourceMappingURL=tools.js.map