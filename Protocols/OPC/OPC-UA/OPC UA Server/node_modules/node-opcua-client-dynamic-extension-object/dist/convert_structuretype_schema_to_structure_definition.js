"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStructureTypeSchemaToStructureDefinition = convertStructureTypeSchemaToStructureDefinition;
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
function _getDataType(field) {
    switch (field.category) {
        case node_opcua_factory_1.FieldCategory.complex:
            return (0, node_opcua_nodeid_1.resolveNodeId)(field.schema.dataTypeNodeId);
        case node_opcua_factory_1.FieldCategory.basic:
            return (0, node_opcua_nodeid_1.resolveNodeId)(field.fieldType);
        case node_opcua_factory_1.FieldCategory.enumeration:
        default:
            return (0, node_opcua_nodeid_1.resolveNodeId)(field.dataType);
    }
}
function convertStructureTypeSchemaToStructureDefinition(st) {
    let structureType = node_opcua_types_1.StructureType.Invalid;
    let isUnion = false;
    if (st.baseType === "Union") {
        structureType = node_opcua_types_1.StructureType.Union;
        isUnion = true;
    }
    else {
        structureType = node_opcua_types_1.StructureType.Structure;
    }
    // convert partial field (not including base class)
    const structureDefinition = {
        fields: [],
        baseDataType: st.getBaseSchema()?.dataTypeNodeId,
        defaultEncodingId: st.encodingDefaultBinary,
        structureType
    };
    const fields = structureDefinition.fields || [];
    for (const f of st.fields) {
        const dataType = _getDataType(f);
        if (isUnion && f.originalName === "SwitchField") {
            continue;
        }
        fields.push({
            arrayDimensions: f.isArray ? [] : undefined,
            valueRank: f.isArray ? 1 : -1,
            dataType,
            isOptional: isUnion ? undefined : f.switchValue !== undefined,
            description: f.documentation || undefined,
            name: f.originalName
        });
    }
    return new node_opcua_types_1.StructureDefinition(structureDefinition);
}
//# sourceMappingURL=convert_structuretype_schema_to_structure_definition.js.map