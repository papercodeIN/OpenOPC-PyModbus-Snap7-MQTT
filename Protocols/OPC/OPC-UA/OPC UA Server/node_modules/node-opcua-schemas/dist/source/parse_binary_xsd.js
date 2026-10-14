"use strict";
/**
 * @module node-opcua-schemas
 */
// tslint:disable:object-literal-sort-keys
// tslint:disable:no-empty
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalTypeDictionary = void 0;
exports.parseBinaryXSD = parseBinaryXSD;
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_xml2json_1 = require("node-opcua-xml2json");
const tools_1 = require("./tools");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
function w(s, l) {
    return s.padEnd(l).substring(0, l);
}
const predefinedType = {
    "opc:Bit": 1,
    "opc:Boolean": 1,
    "opc:Byte": 1,
    "opc:ByteString": 1,
    "opc:Char": 1,
    "opc:CharArray": 1,
    "opc:DateTime": 1,
    "opc:Double": 1,
    "opc:Float": 1,
    "opc:Guid": 1,
    "opc:Int16": 1,
    "opc:Int32": 1,
    "opc:Int64": 1,
    "opc:SByte": 1,
    "opc:String": 1,
    "opc:UInt16": 1,
    "opc:UInt32": 1,
    "opc:UInt64": 1,
    "ua:ByteStringNodeId": 1,
    "ua:DataValue": 1,
    "ua:DiagnosticInfo": 1,
    "ua:ExpandedNodeId": 1,
    "ua:ExtensionObject": 1,
    "ua:FourByteNodeId": 1,
    "ua:GuidNodeId": 1,
    "ua:LocalizedText": 1,
    "ua:NodeId": 1,
    "ua:NodeIdType": 1,
    "ua:NumericNodeId": 1,
    "ua:QualifiedName": 1,
    "ua:StatusCode": 1,
    "ua:StringNodeId": 1,
    "ua:TwoByteNodeId": 1,
    "ua:Variant": 1,
    "ua:XmlElement": 1,
};
class InternalTypeDictionary {
    constructor() {
        this.targetNamespace = "";
        this.defaultByteOrder = "";
        this.imports = [];
        this.structuredTypesRaw = {};
        this.enumeratedTypesRaw = {};
        // tns: "http://opcfoundation.org/a/b"
        this._namespaces = {};
        /**  */
    }
    addEnumeration(name, e) {
        this.enumeratedTypesRaw[name] = e;
    }
    getEnumerations() {
        return Object.values(this.enumeratedTypesRaw);
    }
    getStructures() {
        return Object.values(this.structuredTypesRaw);
    }
    addStructureRaw(structuredType) {
        this.structuredTypesRaw[structuredType.name] = structuredType;
    }
    getStructuredTypesRawByName(name) {
        name = name.split(":")[1] || name;
        return this.structuredTypesRaw[name];
    }
}
exports.InternalTypeDictionary = InternalTypeDictionary;
/* tslint:disable:object-literal-shorthand */
const state0 = {
    init: () => {
        const a = 1;
    },
    parser: {
        TypeDictionary: {
            init: function (name, attributes) {
                this.typeDictionary = this.engine.typeDictionary;
                this.typeDictionary.defaultByteOrder = attributes.DefaultByteOrder;
                this.typeDictionary.targetNamespace = attributes.TargetNamespace;
                for (const [k, v] of Object.entries(attributes)) {
                    if (k.match(/xmlns:/)) {
                        const ns = k.split(":")[1];
                        this.typeDictionary._namespaces[ns] = v;
                        this.typeDictionary._namespaces[v] = ns;
                    }
                }
            },
            parser: {
                Import: {
                    init: function (name, attributes) {
                        this.parent.typeDictionary.imports.push(attributes.Namespace);
                    },
                    finish: function () {
                        // _register_namespace_uri(this.text);
                        // istanbul ignore next
                        if (doDebug) {
                            debugLog("Import NameSpace = ", this.attrs.Namespace, " Location", this.attrs.Location);
                        }
                    }
                },
                EnumeratedType: {
                    init: function () {
                        this.typescriptDefinition = "";
                        // istanbul ignore next
                        if (doDebug) {
                            debugLog(chalk_1.default.cyan("EnumeratedType Name="), w(this.attrs.Name, 40), "LengthInBits=", this.attrs.LengthInBits);
                        }
                        this.enumeratedType = {
                            enumeratedValues: {},
                            lengthInBits: parseInt(this.attrs.LengthInBits, 10),
                            name: this.attrs.Name
                        };
                        this.typescriptDefinition += `enum ${this.enumeratedType.name} {`;
                    },
                    parser: {
                        Documentation: {
                            finish: function () {
                                this.parent.enumeratedType.documentation = this.text;
                            }
                        },
                        EnumeratedValue: {
                            finish: function () {
                                // istanbul ignore next
                                if (doDebug) {
                                    debugLog(" EnumeratedValue Name=", w(this.attrs.Name, 40), " Value=", this.attrs.Value);
                                }
                                const key = this.attrs.Name;
                                const value = parseInt(this.attrs.Value, 10);
                                const _enum = this.parent.enumeratedType.enumeratedValues;
                                _enum[(_enum[key] = value)] = key;
                                this.parent.typescriptDefinition += `\n  ${key} = ${value},`;
                            }
                        }
                    },
                    finish: function () {
                        this.typescriptDefinition += `\n}`;
                        this.parent.typeDictionary.addEnumeration(this.attrs.Name, this.enumeratedType);
                        // istanbul ignore next
                        if (doDebug) {
                            debugLog(" this.typescriptDefinition  = ", this.typescriptDefinition);
                        }
                    }
                },
                StructuredType: {
                    init: function () {
                        // istanbul ignore next
                        if (doDebug) {
                            debugLog(chalk_1.default.cyan("StructureType Name="), chalk_1.default.green(this.attrs.Name), " BaseType=", this.attrs.BaseType);
                        }
                        const baseType = this.attrs.BaseType;
                        const structuredType = {
                            name: this.attrs.Name,
                            baseType,
                            fields: []
                        };
                        this.structuredType = structuredType;
                    },
                    parser: {
                        Field: {
                            finish: function () {
                                if (this.attrs.SourceType) {
                                    // ignore  this field, This is a repetition of the base type field with same name
                                    return;
                                }
                                // istanbul ignore next
                                if (doDebug) {
                                    debugLog(chalk_1.default.yellow(" field Name="), w(this.attrs.Name, 40), chalk_1.default.yellow(" typeName="), w(this.attrs.TypeName, 40), this.attrs.LengthField
                                        ? chalk_1.default.yellow(" lengthField= ") + w(this.attrs.LengthField, 40)
                                        : "", this.attrs.SwitchField
                                        ? chalk_1.default.yellow(" SwitchField= ") + w(this.attrs.SwitchField, 40)
                                        : "", this.attrs.SwitchValue !== undefined
                                        ? chalk_1.default.yellow(" SwitchValue= ") + w(this.attrs.SwitchValue, 40)
                                        : ""
                                    // chalk.yellow(" lengthField="), w(this.attrs.LengthField, 40)
                                    );
                                }
                                const field = {
                                    name: this.attrs.Name,
                                    fieldType: this.attrs.TypeName
                                };
                                const structuredType = this.parent.structuredType;
                                if (field.fieldType === "opc:Bit") {
                                    // do something to collect bits but ignore them as field
                                    structuredType.bitFields = structuredType.bitFields || [];
                                    const length = this.attrs.Length || 1;
                                    structuredType.bitFields.push({ name: field.name, length });
                                    return;
                                }
                                if (this.attrs.LengthField) {
                                    field.isArray = true;
                                    const n = structuredType.fields.length - 1;
                                    structuredType.fields[n] = field;
                                }
                                else {
                                    structuredType.fields.push(field);
                                }
                                if (this.attrs.SwitchField) {
                                    // field is optional and can be omitted
                                    const switchField = this.attrs.SwitchField;
                                    if (this.attrs.SwitchValue) {
                                        // we are in a union
                                        field.switchValue = parseInt(this.attrs.SwitchValue, 10);
                                        // istanbul ignore next
                                        if (doDebug) {
                                            debugLog("field", field.name, " is part of a union  => ", switchField, " value #", field.switchValue);
                                        }
                                        // sometimes (like in Milo, baseType attribute is not specified)
                                        if (!this.parent.attrs.baseType) {
                                            this.parent.attrs.baseType = "Union";
                                            this.parent.structuredType.baseType = "Union";
                                        }
                                    }
                                    else {
                                        field.switchBit = structuredType.bitFields
                                            ? structuredType.bitFields.findIndex((x) => x.name === switchField)
                                            : -2;
                                        // istanbul ignore next
                                        if (doDebug) {
                                            debugLog("field", field.name, " is optional => ", switchField, "bit #", field.switchBit);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    finish: function () {
                        (0, node_opcua_assert_1.default)(this.attrs.Name === this.structuredType.name);
                        this.parent.typeDictionary.addStructureRaw(this.structuredType);
                    }
                }
            }
        }
    }
};
async function parseBinaryXSD(xmlString, idProvider, dataTypeFactory) {
    const parser = new node_opcua_xml2json_1.Xml2Json(state0);
    const typeDictionary = new InternalTypeDictionary();
    parser.typeDictionary = typeDictionary;
    if (!xmlString || xmlString.length === 0) {
        return;
    }
    parser.parseString(xmlString);
    // resolve and prepare enumerations
    for (const enumeratedType of typeDictionary.getEnumerations()) {
        if (Object.keys(enumeratedType.enumeratedValues).length >= 1) {
            const e = new node_opcua_factory_1.EnumerationDefinitionSchema(node_opcua_nodeid_1.NodeId.nullNodeId, {
                lengthInBits: enumeratedType.lengthInBits || 32,
                enumValues: enumeratedType.enumeratedValues,
                name: enumeratedType.name
            });
            dataTypeFactory.registerEnumeration(e);
        }
    }
    // istanbul ignore next
    if (doDebug) {
        debugLog("------------------------------- Resolving complex Type");
        typeDictionary.getStructures().map((x) => debugLog(x.name));
    }
    // create area in navigation order
    function createExplorationOrder() {
        const array = [];
        const _map = {};
        function alreadyVisited(name) {
            name = name.split(":")[1] || name;
            return !!_map[name];
        }
        function markAsVisited(name) {
            name = name.split(":")[1] || name;
            _map[name] = "1";
        }
        function visitStructure(structuredType) {
            if (!structuredType || structuredType.name === "ua:ExtensionObject") {
                return;
            }
            if (alreadyVisited(structuredType.name)) {
                return;
            }
            markAsVisited(structuredType.name);
            if (structuredType.baseType && structuredType.baseType !== "ua:ExtensionObject") {
                const base = typeDictionary.getStructuredTypesRawByName(structuredType.baseType);
                if (base && base.baseType) {
                    doDebug && debugLog("  investigating  base", chalk_1.default.cyan(base.name));
                    visitStructure(base);
                }
            }
            for (const f of structuredType.fields) {
                const s = typeDictionary.getStructuredTypesRawByName(f.fieldType);
                if (s !== structuredType && s) {
                    visitStructure(s);
                }
                else {
                    markAsVisited(f.fieldType);
                }
            }
            doDebug && debugLog("processing ", chalk_1.default.cyan(structuredType.name));
            array.push(structuredType);
        }
        for (const structuredType of typeDictionary.getStructures()) {
            visitStructure(structuredType);
        }
        return array;
    }
    // resolve complex types
    const schemaInVisitingOrder = createExplorationOrder();
    for (const structuredType of schemaInVisitingOrder) {
        (0, tools_1.getOrCreateStructuredTypeSchema)(structuredType.name, typeDictionary, dataTypeFactory, idProvider);
    }
}
//# sourceMappingURL=parse_binary_xsd.js.map