"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeFactory = void 0;
/**
 * @module node-opcua-factory
 */
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_constants_1 = require("node-opcua-constants");
const builtin_types_1 = require("./builtin_types");
const enumerations_1 = require("./enumerations");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
class DataTypeFactory {
    constructor(baseDataFactories) {
        this.imports = [];
        this._structureInfoByName = new Map();
        this._structureInfoByDataTypeMap = new Map();
        this._structureInfoByEncodingMap = new Map();
        this._enumerations = new Map();
        this.defaultByteOrder = "LittleEndian";
        this.targetNamespace = "";
        this.baseDataFactories = baseDataFactories;
    }
    getStructureIterator() {
        return this._structureInfoByDataTypeMap.values();
    }
    getEnumIterator() {
        return this._enumerations.values();
    }
    repairBaseDataFactories(baseDataFactories) {
        this.baseDataFactories = baseDataFactories;
    }
    hasBuiltInType(name) {
        return (0, builtin_types_1.hasBuiltInType)(name);
    }
    getBuiltInType(name) {
        return (0, builtin_types_1.getBuiltInType)(name);
    }
    getBuiltInTypeByDataType(nodeId) {
        return (0, builtin_types_1.getBuiltInType)(node_opcua_constants_1.DataTypeIds[nodeId.value]);
    }
    // -----------------------------
    // EnumerationDefinitionSchema
    registerEnumeration(enumeration) {
        (0, node_opcua_assert_1.assert)(!this._enumerations.has(enumeration.name), "enumeration already registered");
        this._enumerations.set(enumeration.name, enumeration);
    }
    hasEnumeration(enumName) {
        if (this._enumerations.has(enumName)) {
            return true;
        }
        for (const factory of this.baseDataFactories) {
            const e = factory.hasEnumeration(enumName);
            if (e) {
                return true;
            }
        }
        if ((0, enumerations_1.hasBuiltInEnumeration)(enumName)) {
            return true;
        }
        return false;
    }
    getEnumeration(enumName) {
        if (this._enumerations.has(enumName)) {
            return this._enumerations.get(enumName) || null;
        }
        for (const factory of this.baseDataFactories) {
            const hasEnum = factory.hasEnumeration(enumName);
            if (hasEnum) {
                const e = factory.getEnumeration(enumName);
                return e;
            }
        }
        const ee = (0, enumerations_1.getBuiltInEnumeration)(enumName);
        return ee;
    }
    //  ----------------------------
    findStructureInfoForDataType(dataTypeNodeId) {
        const structureInfo = this.getStructureInfoForDataType(dataTypeNodeId);
        if (structureInfo) {
            return structureInfo;
        }
        this.getStructureInfoForDataType(dataTypeNodeId);
        throw new Error("Cannot find StructureType constructor for dataType " + dataTypeNodeId.toString());
    }
    getStructureInfoForDataType(dataTypeNodeId) {
        const structureInfo = this._structureInfoByDataTypeMap.get(dataTypeNodeId.toString());
        if (structureInfo) {
            return structureInfo;
        }
        for (const factory of this.baseDataFactories) {
            const structureInfo2 = factory.getStructureInfoForDataType(dataTypeNodeId);
            if (structureInfo2) {
                return structureInfo2;
            }
        }
        return null;
    }
    // ----------------------------------------------------------------------------------------------------
    // Access by typeName
    // ----------------------------------------------------------------------------------------------------
    structuredTypesNames() {
        return this._structureInfoByName.keys();
    }
    enumerations() {
        return this._enumerations.keys();
    }
    getStructureInfoByTypeName(typeName) {
        const structureInfo = this._structureInfoByName.get(typeName);
        if (structureInfo) {
            return structureInfo;
        }
        for (const factory of this.baseDataFactories) {
            if (!factory.hasStructureByTypeName(typeName)) {
                continue;
            }
            const structureInfo2 = factory.getStructureInfoByTypeName(typeName);
            if (structureInfo2) {
                return structureInfo2;
            }
        }
        // istanbul ignore next
        if (doDebug) {
            debugLog([...this.structuredTypesNames()].join(" "));
        }
        // istanbul ignore next
        throw new Error("Cannot find StructureType constructor for " + typeName + " - it may be abstract, or it could be a basic type");
    }
    hasStructureByTypeName(typeName) {
        if (this._structureInfoByName.has(typeName)) {
            return true;
        }
        for (const factory of this.baseDataFactories) {
            if (factory.hasStructureByTypeName(typeName)) {
                return true;
            }
        }
        return false;
    }
    getStructuredTypeSchema(typeName) {
        const structureInfo = this.getStructureInfoByTypeName(typeName);
        return structureInfo.schema;
    }
    // istanbul ignore next
    dump() {
        warningLog(" dumping registered factories");
        warningLog(" Factory ", [...this.structuredTypesNames()].sort().forEach((e) => e));
        warningLog(" done");
    }
    registerAbstractStructure(dataTypeNodeId, className, schema) {
        schema.isAbstract = true;
        this._registerFactory(dataTypeNodeId, className, null, schema);
    }
    registerClassDefinition(dataTypeNodeId, className, classConstructor) {
        this._registerFactory(dataTypeNodeId, className, classConstructor, classConstructor.schema);
        if (classConstructor.schema.isAbstract) {
            return;
        }
        if (classConstructor.encodingDefaultBinary && classConstructor.encodingDefaultBinary.value !== 0) {
            this.associateWithBinaryEncoding(className, classConstructor.encodingDefaultBinary);
        }
        else {
            // for instance in DI FetchResultDataType should be abstract but is not
            // this is valid as long as the class is not instantiated directly but only 
            // used inside another class.
            // xx warningLog("warning ", dataTypeNodeId.toString(), "name=", className, " does not have binary encoding");
        }
    }
    // ----------------------------------------------------------------------------------------------------
    // Access by binaryEncodingNodeId
    // ----------------------------------------------------------------------------------------------------
    getConstructor(binaryEncodingNodeId) {
        const expandedNodeIdKey = makeExpandedNodeIdKey(binaryEncodingNodeId);
        const structureInfo = this._structureInfoByEncodingMap.get(expandedNodeIdKey);
        if (!structureInfo)
            return null;
        const Constructor = structureInfo.constructor;
        if (Constructor) {
            return Constructor;
        }
        for (const factory of this.baseDataFactories) {
            const Constructor2 = factory.getConstructor(binaryEncodingNodeId);
            if (Constructor2) {
                return Constructor2;
            }
        }
        debugLog(chalk_1.default.red("#getConstructor : cannot find constructor for expandedId "), binaryEncodingNodeId.toString());
        return null;
    }
    hasConstructor(binaryEncodingNodeId) {
        if (!binaryEncodingNodeId) {
            return false;
        }
        verifyExpandedNodeId(binaryEncodingNodeId);
        const expandedNodeIdKey = makeExpandedNodeIdKey(binaryEncodingNodeId);
        const constructor = this._structureInfoByEncodingMap.get(expandedNodeIdKey);
        if (constructor) {
            return true;
        }
        for (const factory of this.baseDataFactories) {
            const constructor2 = factory.getConstructor(binaryEncodingNodeId);
            if (constructor2) {
                return true;
            }
        }
        return false;
    }
    constructObject(binaryEncodingNodeId) {
        verifyExpandedNodeId(binaryEncodingNodeId);
        const Constructor = this.getConstructor(binaryEncodingNodeId);
        if (!Constructor) {
            debugLog("Cannot find constructor for " + binaryEncodingNodeId.toString());
            throw new Error("Cannot find constructor for " + binaryEncodingNodeId.toString());
        }
        return new Constructor();
    }
    associateWithBinaryEncoding(className, expandedNodeId) {
        const structureInfo = this.getStructureInfoByTypeName(className);
        // if (doDebug) {
        //     debugLog(" associateWithBinaryEncoding ", className, expandedNodeId.toString());
        // }
        verifyExpandedNodeId(expandedNodeId);
        const expandedNodeIdKey = makeExpandedNodeIdKey(expandedNodeId);
        /* istanbul ignore next */
        if (this._structureInfoByEncodingMap.has(expandedNodeIdKey)) {
            throw new Error(" Class " +
                className +
                " with ID " +
                expandedNodeId +
                "  already in constructorMap for  " +
                this._structureInfoByEncodingMap.get(expandedNodeIdKey).schema.name);
        }
        this._structureInfoByEncodingMap.set(expandedNodeIdKey, structureInfo);
    }
    toString() {
        const l = [];
        function write(...args) {
            l.push(util_1.default.format.apply(util_1.default.format, args));
        }
        dumpDataFactory(this, write);
        return l.join("\n");
    }
    _registerFactory(dataTypeNodeId, typeName, constructor, schema) {
        /* istanbul ignore next */
        if (this._structureInfoByName.has(typeName)) {
            warningLog("target namespace = `" + this.targetNamespace + "`");
            warningLog("registerFactory  : " + typeName + " already registered. dataTypeNodeId=", dataTypeNodeId.toString());
            return;
        }
        debugLog("registering typeName ", typeName, dataTypeNodeId.toString(), "isAbstract ", schema.isAbstract);
        const structureInfo = { constructor, schema };
        this._structureInfoByName.set(typeName, structureInfo);
        if (dataTypeNodeId.value !== 0) {
            this._structureInfoByDataTypeMap.set(dataTypeNodeId.toString(), structureInfo);
        }
    }
}
exports.DataTypeFactory = DataTypeFactory;
function dumpSchema(schema, write) {
    write("name           ", schema.name);
    write("dataType       ", schema.dataTypeNodeId.toString());
    write("binaryEncoding ", schema.encodingDefaultBinary.toString());
    for (const f of schema.fields) {
        write("          ", f.name.padEnd(30, " "), f.isArray ? true : false, f.fieldType);
    }
}
function dumpDataFactory(dataFactory, write) {
    for (const structureTypeName of dataFactory.structuredTypesNames()) {
        const schema = dataFactory.getStructuredTypeSchema(structureTypeName);
        write("structureTypeName =", structureTypeName);
        if (!dataFactory.getStructureInfoForDataType(schema.dataTypeNodeId)) {
            write("  ( No constructor for " + schema.name + "  " + schema.dataTypeNodeId.toString());
        }
        if (!schema.encodingDefaultBinary) {
            write(" (Schema has no encoding defaultBinary )");
        }
        else {
            if (dataFactory.hasConstructor(schema.encodingDefaultBinary)) {
                write("ERROR: cannot find constructor for encodingDefaultBinary");
                write("schema             name:", schema.name, "(abstract=", schema.isAbstract, ")");
                write("        dataType NodeId:", schema.dataTypeNodeId.toString());
                write("encoding Default Binary:", schema.encodingDefaultBinary ? schema.encodingDefaultBinary.toString() : " ");
                write("encoding Default Xml   :", schema.encodingDefaultXml ? schema.encodingDefaultXml.toString() : " ");
                // return;
                // throw new Error("Not  in Binary Encoding Map!!!!!  " + schema.encodingDefaultBinary);
            }
        }
        dumpSchema(schema, write);
    }
}
function verifyExpandedNodeId(expandedNodeId) {
    /* istanbul ignore next */
    if (expandedNodeId.value instanceof Buffer) {
        throw new Error("getConstructor not implemented for opaque nodeid");
    }
    return true;
}
function makeExpandedNodeIdKey(expandedNodeId) {
    return expandedNodeId.toString();
}
//# sourceMappingURL=datatype_factory.js.map