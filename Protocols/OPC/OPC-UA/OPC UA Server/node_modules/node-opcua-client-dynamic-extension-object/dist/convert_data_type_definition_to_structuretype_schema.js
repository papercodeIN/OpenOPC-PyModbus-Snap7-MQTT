"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDataTypeDefinitionToStructureTypeSchema = convertDataTypeDefinitionToStructureTypeSchema;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
//import { DataTypeIds } from "node-opcua-constant";
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_2 = require("node-opcua-nodeid");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_extension_object_1 = require("node-opcua-extension-object");
//
const node_opcua_variant_1 = require("node-opcua-variant");
const find_encodings_1 = require("./private/find_encodings");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const doDebug = false;
async function memoize(cache, cacheName, nodeId, func) {
    const key = nodeId.toString();
    if (cache[cacheName]?.has(key)) {
        cache.hitCount = cache.hitCount === undefined ? 0 : cache.hitCount + 1;
        return cache[cacheName]?.get(key);
    }
    const value = await func();
    if (!cache[cacheName]) {
        cache[cacheName] = new Map();
    }
    cache[cacheName].set(key, value);
    return value;
}
function fromCache(cache, cacheName, nodeId) {
    const key = nodeId.toString();
    if (cache[cacheName]?.has(key)) {
        cache.hitCount = cache.hitCount === undefined ? 0 : cache.hitCount + 1;
        return cache[cacheName]?.get(key);
    }
    return null;
}
async function findSuperType(session, dataTypeNodeId, cache) {
    if (dataTypeNodeId.namespace === 0 && dataTypeNodeId.value === 24) {
        // BaseDataType !
        return (0, node_opcua_nodeid_2.coerceNodeId)(0);
    }
    return await memoize(cache, "superType", dataTypeNodeId, async () => {
        const nodeToBrowse3 = {
            browseDirection: node_opcua_data_model_1.BrowseDirection.Inverse,
            includeSubtypes: false,
            nodeClassMask: node_opcua_data_model_1.NodeClassMask.DataType,
            nodeId: dataTypeNodeId,
            referenceTypeId: (0, node_opcua_nodeid_2.resolveNodeId)("HasSubtype"),
            resultMask: (0, node_opcua_data_model_1.makeResultMask)("NodeId | ReferenceType | BrowseName | NodeClass")
        };
        const result3 = await (0, node_opcua_pseudo_session_1.browseAll)(session, nodeToBrowse3);
        /* istanbul ignore next */
        if (result3.statusCode.isNotGood()) {
            throw new Error("Cannot find superType for " + dataTypeNodeId.toString());
        }
        result3.references = result3.references || [];
        /* istanbul ignore next */
        if (result3.references.length !== 1) {
            errorLog("Invalid dataType with more than one (or 0) superType", result3.toString());
            throw new Error("Invalid dataType with more than one (or 0) superType " + dataTypeNodeId.toString() + " l=" + result3.references.length);
        }
        return result3.references[0].nodeId;
    });
}
async function findDataTypeCategory(session, dataTypeFactory, cache, dataTypeNodeId) {
    const subTypeNodeId = await findSuperType(session, dataTypeNodeId, cache);
    doDebug && debugLog("subTypeNodeId  of ", dataTypeNodeId.toString(), " is ", subTypeNodeId.toString());
    const fieldResolution = fromCache(cache, "fieldResolution", subTypeNodeId);
    if (fieldResolution) {
        return fieldResolution.category;
    }
    let category;
    const n = subTypeNodeId;
    if (n.identifierType === node_opcua_nodeid_1.NodeIdType.NUMERIC && n.namespace === 0 && n.value <= 29) {
        // well known node ID !
        switch (n.value) {
            case 22 /* Structure */:
                category = node_opcua_factory_1.FieldCategory.complex;
                break;
            case 29 /* Enumeration */:
                category = node_opcua_factory_1.FieldCategory.enumeration;
                break;
            default:
                category = node_opcua_factory_1.FieldCategory.basic;
                break;
        }
        return category;
    }
    // must drill down ...
    return await findDataTypeCategory(session, dataTypeFactory, cache, subTypeNodeId);
}
async function findDataTypeBasicType(session, cache, dataTypeNodeId) {
    const subTypeNodeId = await findSuperType(session, dataTypeNodeId, cache);
    debugLog("subTypeNodeId  of ", dataTypeNodeId.toString(), " is ", subTypeNodeId.toString());
    const fieldResolution = fromCache(cache, "fieldResolution", subTypeNodeId);
    if (fieldResolution) {
        return fieldResolution.schema;
    }
    const n = subTypeNodeId;
    if (n.identifierType === node_opcua_nodeid_1.NodeIdType.NUMERIC && n.namespace === 0 && n.value < 29) {
        switch (n.value) {
            case 22: /* Structure */
            case 29 /* Enumeration */:
                throw new Error("Not expecting Structure or Enumeration");
            default:
                break;
        }
        const nameDataValue = await session.read({
            attributeId: node_opcua_data_model_1.AttributeIds.BrowseName,
            nodeId: subTypeNodeId
        });
        const name = nameDataValue.value.value.name;
        return (0, node_opcua_factory_1.getBuiltInType)(name);
    }
    // must drill down ...
    const td = await findDataTypeBasicType(session, cache, subTypeNodeId);
    return td;
}
async function readBrowseNameWithCache(session, nodeId, cache) {
    return await memoize(cache, "browseNameCache", nodeId, async () => {
        const dataValue = await session.read({ nodeId, attributeId: node_opcua_data_model_1.AttributeIds.BrowseName });
        if (dataValue.statusCode.isNotGood()) {
            const message = "cannot extract BrowseName of nodeId = " + nodeId.toString() + " statusCode = " + dataValue.statusCode.toString();
            debugLog(message);
            throw new Error(message);
        }
        return dataValue.value.value.name;
    });
}
async function resolve2(session, dataTypeNodeId, dataTypeFactory, fieldTypeName, cache) {
    const category = await findDataTypeCategory(session, dataTypeFactory, cache, dataTypeNodeId);
    debugLog(" type " + fieldTypeName + " has not been seen yet, let resolve it => (category = ", category, " )");
    let schema = undefined;
    switch (category) {
        case node_opcua_factory_1.FieldCategory.basic:
            schema = await findDataTypeBasicType(session, cache, dataTypeNodeId);
            /* istanbul ignore next */
            if (!schema) {
                errorLog("Cannot find basic type " + fieldTypeName);
            }
            break;
        default:
        case node_opcua_factory_1.FieldCategory.complex:
            {
                const dataTypeDefinitionDataValue = await session.read({
                    attributeId: node_opcua_data_model_1.AttributeIds.DataTypeDefinition,
                    nodeId: dataTypeNodeId
                });
                /* istanbul ignore next */
                if (dataTypeDefinitionDataValue.statusCode.isNotGood()) {
                    throw new Error(" Cannot find dataType Definition ! with nodeId =" + dataTypeNodeId.toString());
                }
                const definition = dataTypeDefinitionDataValue.value.value;
                const convertIn64ToInteger = (a) => a[1];
                const convert = (fields) => {
                    const retVal = {};
                    fields && fields.forEach((field) => (retVal[field.name || ""] = convertIn64ToInteger(field.value)));
                    return retVal;
                };
                if (category === node_opcua_factory_1.FieldCategory.enumeration) {
                    if (definition instanceof node_opcua_types_1.EnumDefinition) {
                        const e = new node_opcua_factory_1.EnumerationDefinitionSchema(dataTypeNodeId, {
                            enumValues: convert(definition.fields),
                            name: fieldTypeName
                        });
                        dataTypeFactory.registerEnumeration(e);
                        schema = e;
                    }
                }
                else {
                    const isAbstract = false;
                    schema = await convertDataTypeDefinitionToStructureTypeSchema(session, dataTypeNodeId, fieldTypeName, definition, null, dataTypeFactory, isAbstract, cache);
                }
                // xx const schema1 = dataTypeFactory.getStructuredTypeSchema(fieldTypeName);
            }
            break;
    }
    return { schema, category };
}
const isExtensionObject = async (session, dataTypeNodeId, cache) => {
    if (dataTypeNodeId.namespace === 0 && dataTypeNodeId.value === node_opcua_variant_1.DataType.ExtensionObject) {
        return true;
    }
    const baseDataType = await findSuperType(session, dataTypeNodeId, cache);
    const bn = baseDataType;
    if (bn.identifierType === node_opcua_nodeid_1.NodeIdType.NUMERIC) {
        if (bn.namespace === 0 && bn.value === node_opcua_variant_1.DataType.ExtensionObject) {
            return true;
        }
        if (bn.namespace === 0 && bn.value < node_opcua_variant_1.DataType.ExtensionObject) {
            return false;
        }
    }
    return await isExtensionObject(session, baseDataType, cache);
};
// eslint-disable-next-line max-statements
async function resolveFieldType(session, dataTypeNodeId, dataTypeFactory, cache) {
    return await memoize(cache, "fieldResolution", dataTypeNodeId, async () => {
        if (dataTypeNodeId.namespace === 0 && dataTypeNodeId.value === 22) {
            // ERN   return null;
            const category = node_opcua_factory_1.FieldCategory.complex;
            const fieldTypeName = "Structure";
            const schema = node_opcua_extension_object_1.ExtensionObject.schema;
            return {
                category,
                fieldTypeName,
                schema,
                allowSubType: true,
                dataType: (0, node_opcua_nodeid_2.coerceNodeId)(node_opcua_variant_1.DataType.ExtensionObject)
            };
        }
        if (dataTypeNodeId.value === 0) {
            const v3 = {
                category: node_opcua_factory_1.FieldCategory.basic,
                fieldTypeName: "Variant",
                schema: dataTypeFactory.getBuiltInType("Variant")
            };
            return v3;
        }
        const readIsAbstract = async (dataTypeNodeId) => {
            return (await session.read({ nodeId: dataTypeNodeId, attributeId: node_opcua_data_model_1.AttributeIds.IsAbstract })).value.value;
        };
        const [isAbstract, fieldTypeName] = await Promise.all([
            readIsAbstract(dataTypeNodeId),
            readBrowseNameWithCache(session, dataTypeNodeId, cache)
        ]);
        if (isAbstract) {
            const _isExtensionObject = await isExtensionObject(session, dataTypeNodeId, cache);
            debugLog(" dataType " + dataTypeNodeId.toString() + " " + fieldTypeName + " is abstract => extObj ?= " + _isExtensionObject);
            if (_isExtensionObject) {
                // we could have complex => Structure
                const v3 = {
                    category: node_opcua_factory_1.FieldCategory.complex,
                    fieldTypeName: fieldTypeName,
                    schema: node_opcua_extension_object_1.ExtensionObject.schema,
                    allowSubType: true,
                    dataType: dataTypeNodeId
                };
                return v3;
            }
            else {
                // we could have basic => Variant
                const v3 = {
                    category: node_opcua_factory_1.FieldCategory.basic,
                    fieldTypeName: fieldTypeName,
                    schema: dataTypeFactory.getBuiltInType("Variant"),
                    allowSubType: true,
                    dataType: dataTypeNodeId
                };
                return v3;
            }
        }
        let schema;
        let category = node_opcua_factory_1.FieldCategory.enumeration;
        if (dataTypeFactory.hasStructureByTypeName(fieldTypeName)) {
            schema = dataTypeFactory.getStructuredTypeSchema(fieldTypeName);
            category = node_opcua_factory_1.FieldCategory.complex;
        }
        else if (dataTypeFactory.hasBuiltInType(fieldTypeName)) {
            category = node_opcua_factory_1.FieldCategory.basic;
            schema = dataTypeFactory.getBuiltInType(fieldTypeName);
        }
        else if (dataTypeFactory.hasEnumeration(fieldTypeName)) {
            category = node_opcua_factory_1.FieldCategory.enumeration;
            schema = dataTypeFactory.getEnumeration(fieldTypeName);
        }
        else {
            debugLog(" type " + fieldTypeName + " has not been seen yet, let resolve it");
            const res = await resolve2(session, dataTypeNodeId, dataTypeFactory, fieldTypeName, cache);
            schema = res.schema;
            category = res.category;
        }
        /* istanbul ignore next */
        if (!schema) {
            throw new Error("expecting a schema here fieldTypeName=" + fieldTypeName + " " + dataTypeNodeId.toString() + " category = " + category);
        }
        const v2 = {
            category,
            fieldTypeName,
            schema
        };
        return v2;
    });
}
async function _setupEncodings(session, dataTypeNodeId, dataTypeDescription, schema) {
    // read abstract flag
    const isAbstractDV = await session.read({ nodeId: dataTypeNodeId, attributeId: node_opcua_data_model_1.AttributeIds.IsAbstract });
    schema.dataTypeNodeId = dataTypeNodeId;
    if (isAbstractDV.statusCode.isGood() && isAbstractDV.value.value === false) {
        const encodings = (dataTypeDescription && dataTypeDescription.encodings) || (await (0, find_encodings_1._findEncodings)(session, dataTypeNodeId));
        schema.encodingDefaultBinary = (0, node_opcua_nodeid_2.makeExpandedNodeId)(encodings.binaryEncodingNodeId);
        schema.encodingDefaultXml = (0, node_opcua_nodeid_2.makeExpandedNodeId)(encodings.xmlEncodingNodeId);
        schema.encodingDefaultJson = (0, node_opcua_nodeid_2.makeExpandedNodeId)(encodings.jsonEncodingNodeId);
    }
    else {
        schema.isAbstract = true;
    }
    return schema;
}
async function findBasicDataTypeEx(session, dataTypeNodeId, cache) {
    return await memoize(cache, "dataTypes", dataTypeNodeId, async () => {
        const sessionEx = session;
        if (!sessionEx._$$cache2) {
            sessionEx._$$cache2 = new Map();
        }
        const key = dataTypeNodeId.toString();
        if (sessionEx._$$cache2.has(key)) {
            sessionEx._$$cacheHits = sessionEx._$$cacheHits == undefined ? 0 : sessionEx._$$cacheHits + 1;
            // console.log("cache hit 2", key);
            return sessionEx._$$cache2.get(key);
        }
        const d = await (0, node_opcua_pseudo_session_1.findBasicDataType)(session, dataTypeNodeId);
        sessionEx._$$cache2.set(key, d);
        return d;
    });
}
async function nonReentrant(cache, prefix, dataTypeNodeId, func) {
    const key = prefix + dataTypeNodeId.toString();
    if (cache.$$resolveStuff?.has(key)) {
        doDebug && console.log(" re-entering !" + key);
        return await new Promise((resolve, reject) => {
            cache.$$resolveStuff?.get(key).push([resolve, reject]);
        });
    }
    cache.$$resolveStuff = cache.$$resolveStuff || new Map();
    cache.$$resolveStuff.set(key, []);
    return await new Promise((_resolve, _reject) => {
        cache.$$resolveStuff.get(key).push([_resolve, _reject]);
        (async () => {
            try {
                const result = await func();
                const tmp = cache.$$resolveStuff.get(key);
                cache.$$resolveStuff.delete(key);
                for (const [resolve] of tmp) {
                    resolve(result);
                }
            }
            catch (err) {
                const tmp = cache.$$resolveStuff.get(key);
                cache.$$resolveStuff.delete(key);
                for (const [_resolve, reject] of tmp) {
                    reject(err);
                }
            }
        })();
    });
}
// eslint-disable-next-line max-statements, max-params
async function convertDataTypeDefinitionToStructureTypeSchema(session, dataTypeNodeId, name, definition, dataTypeDescription, dataTypeFactory, isAbstract, cache) {
    return await nonReentrant(cache, "convertDataTypeDefinitionToStructureTypeSchema", dataTypeNodeId, async () => {
        // warningLog(">> convertDataTypeDefinitionToStructureTypeSchema = ", dataTypeNodeId.toString());
        if (definition instanceof node_opcua_types_1.StructureDefinition) {
            let fieldCountToIgnore = 0;
            const structureInfo = dataTypeFactory.getStructureInfoForDataType(definition.baseDataType);
            const baseSchema = structureInfo?.schema;
            if (baseSchema) {
                const possibleFields = (0, node_opcua_factory_1.extractAllPossibleFields)(baseSchema);
                fieldCountToIgnore += possibleFields.length;
            }
            // while (base && !(base.dataTypeNodeId.value === DataType.ExtensionObject && base.dataTypeNodeId.namespace === 0)) {
            //     fieldCountToIgnore += base..length;
            //     base = base.getBaseSchema();
            // }
            const fields = [];
            const isUnion = definition.structureType === node_opcua_types_1.StructureType.Union;
            switch (definition.structureType) {
                case node_opcua_types_1.StructureType.Union:
                    fields.push({
                        fieldType: "UInt32",
                        name: "SwitchField"
                    });
                    break;
                case node_opcua_types_1.StructureType.Structure:
                case node_opcua_types_1.StructureType.StructureWithOptionalFields:
                    break;
            }
            let switchValue = 1;
            let switchBit = 0;
            const bitFields = isUnion ? undefined : [];
            const postActions = [];
            if (definition.fields) {
                for (let i = fieldCountToIgnore; i < definition.fields.length; i++) {
                    const fieldD = definition.fields[i];
                    // we need to skip fields that have already been handled in base class
                    // promises.push((
                    await (async () => {
                        let field;
                        ({ field, switchBit, switchValue } = createField(fieldD, switchBit, bitFields, isUnion, switchValue));
                        if (fieldD.dataType.value === dataTypeNodeId.value && fieldD.dataType.namespace === dataTypeNodeId.namespace) {
                            // this is a structure with a field of the same type
                            // push an empty placeholder that we will fill later
                            const fieldTypeName = await readBrowseNameWithCache(session, dataTypeNodeId, cache);
                            (field.fieldType = fieldTypeName), (field.category = node_opcua_factory_1.FieldCategory.complex);
                            fields.push(field);
                            const capturedField = field;
                            postActions.push((schema) => {
                                capturedField.schema = schema;
                            });
                            return;
                            ;
                        }
                        const rt = (await resolveFieldType(session, fieldD.dataType, dataTypeFactory, cache));
                        if (!rt) {
                            errorLog("convertDataTypeDefinitionToStructureTypeSchema cannot handle field", fieldD.name, "in", name, "because " + fieldD.dataType.toString() + " cannot be resolved");
                            return;
                        }
                        const { schema, category, fieldTypeName, dataType, allowSubType } = rt;
                        field.fieldType = fieldTypeName;
                        field.category = category;
                        field.schema = schema;
                        field.dataType = dataType || fieldD.dataType;
                        field.allowSubType = allowSubType || false;
                        field.basicDataType = await findBasicDataTypeEx(session, field.dataType, cache);
                        fields.push(field);
                    })();
                    // ));
                }
            }
            /// some server may provide definition.baseDataType to be i=22 (ExtensionObject)
            /// instead of 12756 Union;
            if (isUnion && (0, node_opcua_nodeid_1.sameNodeId)(definition.baseDataType, (0, node_opcua_nodeid_2.coerceNodeId)("i=22"))) {
                definition.baseDataType = (0, node_opcua_nodeid_2.resolveNodeId)("i=1276"); // aka DataTypeIds.Union
            }
            const a = await resolveFieldType(session, definition.baseDataType, dataTypeFactory, cache);
            const baseType = a ? a.fieldTypeName : isUnion ? "Union" : "ExtensionObject";
            const os = new node_opcua_factory_1.StructuredTypeSchema({
                baseType,
                bitFields,
                fields,
                name,
                dataTypeFactory
            });
            const structuredTypeSchema = await _setupEncodings(session, dataTypeNodeId, dataTypeDescription, os);
            postActions.forEach((action) => action(structuredTypeSchema));
            doDebug && console.log("DONE ! convertDataTypeDefinitionToStructureTypeSchema = ", dataTypeNodeId.toString());
            return structuredTypeSchema;
        }
        throw new Error("Not Implemented");
    });
    function createField(fieldD, switchBit, bitFields, isUnion, switchValue) {
        const field = {
            fieldType: "",
            name: fieldD.name,
            schema: undefined
        };
        if (fieldD.isOptional) {
            field.switchBit = switchBit++;
            bitFields?.push({ name: fieldD.name + "Specified", length: 1 });
        }
        if (isUnion) {
            field.switchValue = switchValue;
            switchValue += 1;
        }
        // (fieldD.valueRank === -1 || fieldD.valueRank === 1 || fieldD.valueRank === 0);
        if (fieldD.valueRank >= 1) {
            field.valueRank = fieldD.valueRank;
            field.isArray = true;
        }
        else {
            field.isArray = false;
        }
        return { field, switchBit, switchValue };
    }
}
//# sourceMappingURL=convert_data_type_definition_to_structuretype_schema.js.map