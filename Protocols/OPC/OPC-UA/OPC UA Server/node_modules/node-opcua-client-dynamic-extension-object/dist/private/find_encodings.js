"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._findEncodings = _findEncodings;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
async function _findEncodings(session, dataTypeNodeId) {
    const nodeToBrowse = {
        browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
        includeSubtypes: true,
        // strictly speaking HasEncoding points to an Object of DataTypeEncodingType, but
        // in some buggy server implementations  ObjectType is used instead. (see #1232)
        nodeClassMask: (0, node_opcua_data_model_1.makeNodeClassMask)("Object | ObjectType"),
        nodeId: dataTypeNodeId,
        referenceTypeId: (0, node_opcua_nodeid_1.resolveNodeId)("HasEncoding"),
        resultMask: (0, node_opcua_data_model_1.makeResultMask)("ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition")
    };
    const result = await (0, node_opcua_pseudo_session_1.browseAll)(session, nodeToBrowse);
    const references = result.references || [];
    if (references.length === 0) {
        // xx throw new Error("Cannot find encodings on type " + dataTypeNodeId.toString() + " statusCode " + result.statusCode.toString());
    }
    const encodings = {
        dataTypeNodeId,
        binaryEncodingNodeId: new node_opcua_nodeid_1.NodeId(),
        jsonEncodingNodeId: new node_opcua_nodeid_1.NodeId(),
        xmlEncodingNodeId: new node_opcua_nodeid_1.NodeId()
    };
    for (const ref of references) {
        switch (ref.browseName.name) {
            case "Default Binary":
                encodings.binaryEncodingNodeId = ref.nodeId;
                break;
            case "Default XML":
                encodings.xmlEncodingNodeId = ref.nodeId;
                break;
            case "Default JSON":
                encodings.jsonEncodingNodeId = ref.nodeId;
                break;
            default:
                // warningLog(" ignoring encoding ", ref.browseName.toString());
                break;
        }
    }
    return encodings;
}
//# sourceMappingURL=find_encodings.js.map