"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterContextOnAddressSpace = void 0;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_variant_1 = require("node-opcua-variant");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("Filter");
class FilterContextOnAddressSpace {
    constructor(sessionContext, eventData) {
        this.sessionContext = sessionContext;
        this.eventData = eventData;
        this.eventSource = this.eventData.$eventDataSource?.nodeId || node_opcua_nodeid_1.NodeId.nullNodeId;
    }
    getNodeClass(nodeId) {
        const addressSpace = this.getAddressSpace();
        const node = addressSpace.findNode(nodeId);
        return node ? node.nodeClass : node_opcua_data_model_1.NodeClass.Unspecified;
    }
    isSubtypeOf(nodeId, baseType) {
        const addressSpace = this.getAddressSpace();
        const node = addressSpace.findNode(nodeId);
        const baseTypeNode = addressSpace.findNode(baseType);
        if (!node || !baseTypeNode) {
            warningLog("invalid node - must be specifed ");
            return false;
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.ObjectType && baseTypeNode.nodeClass === node_opcua_data_model_1.NodeClass.ObjectType) {
            return node.isSubtypeOf(baseTypeNode);
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.VariableType && baseTypeNode.nodeClass === node_opcua_data_model_1.NodeClass.VariableType) {
            return node.isSubtypeOf(baseTypeNode);
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.ReferenceType && baseTypeNode.nodeClass === node_opcua_data_model_1.NodeClass.ReferenceType) {
            return node.isSubtypeOf(baseTypeNode);
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.DataType && baseTypeNode.nodeClass === node_opcua_data_model_1.NodeClass.DataType) {
            return node.isSubtypeOf(baseTypeNode);
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.Object && baseTypeNode.nodeClass === node_opcua_data_model_1.NodeClass.ObjectType) {
            const obj = node;
            return obj.typeDefinitionObj.isSubtypeOf(baseTypeNode);
        }
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.Variable && baseTypeNode.nodeClass !== node_opcua_data_model_1.NodeClass.VariableType) {
            const obj = node;
            return obj.typeDefinitionObj.isSubtypeOf(baseTypeNode);
        }
        return false;
    }
    getTypeDefinition(nodeId) {
        const addressSpace = this.getAddressSpace();
        const node = addressSpace.findNode(nodeId);
        if (!node)
            return null;
        if (node.nodeClass === node_opcua_data_model_1.NodeClass.Object || node.nodeClass === node_opcua_data_model_1.NodeClass.Variable) {
            return node.typeDefinition;
        }
        return null;
    }
    readNodeValue(nodeId) {
        nodeId = (0, node_opcua_nodeid_1.coerceNodeId)(nodeId);
        // use  cache/snapshot if available
        const value = this.eventData._readValue(nodeId);
        if (value) {
            return value;
        }
        const addressSpace = this.getAddressSpace();
        const node = addressSpace.findNode(nodeId);
        if (!node || node.nodeClass !== node_opcua_data_model_1.NodeClass.Variable) {
            return new node_opcua_variant_1.Variant();
        }
        return prepare(node.readValue(this.sessionContext));
    }
    getAddressSpace() {
        return this.eventData.$eventDataSource.addressSpace;
    }
    browsePath(browsePath) {
        // delegate to eventData if appropriate
        if ((0, node_opcua_nodeid_1.sameNodeId)(browsePath.startingNode, this.eventSource)) {
            const browseResult = this.eventData._browse(browsePath);
            if (browseResult &&
                browseResult.statusCode.isGood() &&
                browseResult.targets &&
                browseResult.targets.length === 1) {
                return browseResult.targets[0].targetId;
            }
        }
        // fallback to addressSpace otherwise
        const addressSpace = this.getAddressSpace();
        const browseResult = addressSpace.browsePath(browsePath);
        if (browseResult.statusCode.isNotGood() || !browseResult.targets || browseResult.targets.length !== 1) {
            return null;
        }
        return browseResult.targets[0].targetId;
    }
    setEventSource(eventSource) {
        this.eventSource = eventSource ? eventSource.nodeId : node_opcua_nodeid_1.NodeId.nullNodeId;
    }
}
exports.FilterContextOnAddressSpace = FilterContextOnAddressSpace;
function prepare(dataValue) {
    if (dataValue.statusCode.isGood()) {
        return dataValue.value;
    }
    return new node_opcua_variant_1.Variant({ dataType: node_opcua_variant_1.DataType.StatusCode, value: dataValue.statusCode });
}
//# sourceMappingURL=filter_context_on_address_space.js.map