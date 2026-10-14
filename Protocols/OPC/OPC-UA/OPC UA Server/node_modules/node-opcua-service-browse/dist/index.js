"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseResponse = exports.BrowseRequest = exports.ViewDescription = exports.BrowseNextResponse = exports.BrowseNextRequest = exports.BrowseDescription = exports.BrowseResult = exports.ReferenceDescription = exports.BrowseDirection = void 0;
/**
 * @module node-opcua-service-browse
 */
const node_opcua_types_1 = require("node-opcua-types");
var node_opcua_data_model_1 = require("node-opcua-data-model");
Object.defineProperty(exports, "BrowseDirection", { enumerable: true, get: function () { return node_opcua_data_model_1.BrowseDirection; } });
var node_opcua_types_2 = require("node-opcua-types");
Object.defineProperty(exports, "ReferenceDescription", { enumerable: true, get: function () { return node_opcua_types_2.ReferenceDescription; } });
Object.defineProperty(exports, "BrowseResult", { enumerable: true, get: function () { return node_opcua_types_2.BrowseResult; } });
Object.defineProperty(exports, "BrowseDescription", { enumerable: true, get: function () { return node_opcua_types_2.BrowseDescription; } });
Object.defineProperty(exports, "BrowseNextRequest", { enumerable: true, get: function () { return node_opcua_types_2.BrowseNextRequest; } });
Object.defineProperty(exports, "BrowseNextResponse", { enumerable: true, get: function () { return node_opcua_types_2.BrowseNextResponse; } });
Object.defineProperty(exports, "ViewDescription", { enumerable: true, get: function () { return node_opcua_types_2.ViewDescription; } });
Object.defineProperty(exports, "BrowseRequest", { enumerable: true, get: function () { return node_opcua_types_2.BrowseRequest; } });
Object.defineProperty(exports, "BrowseResponse", { enumerable: true, get: function () { return node_opcua_types_2.BrowseResponse; } });
node_opcua_types_1.BrowseResult.schema.fields[1].defaultValue = null;
node_opcua_types_1.BrowseDescription.schema.fields[0].documentation = "The id of the node to browse.";
node_opcua_types_1.BrowseDescription.schema.fields[1].documentation = "The direction of the references to return.";
node_opcua_types_1.BrowseDescription.schema.fields[2].documentation = "The type of references to return." +
    "Specifies the NodeId of the ReferenceType to follow. Only instances of this ReferenceType or" +
    " its subtype are returned. If not specified then all ReferenceTypes are returned and includeSubtypes is ignored.";
node_opcua_types_1.BrowseDescription.schema.fields[3].documentation = "Includes subtypes of the reference type.";
// mask :
//  bit
//   0   Object
//   1   Variable
//   2   Method
//   3   ObjectType
//   4   VariableType
//   5   ReferenceType
//   6   DataType
//   7   View
node_opcua_types_1.BrowseDescription.schema.fields[4].documentation =
    "A mask indicating which node classes to return. 0 means return all nodes.";
// mask : (see ResultMask)
//  bit
//   0   ReferenceType
//   1   IsForward
//   2   NodeClass
//   3   BrowseName
//   4   DisplayName
//   5   TypeDefinition
node_opcua_types_1.BrowseDescription.schema.fields[5].documentation =
    "A mask indicating which fields in the ReferenceDescription should be returned in the results.";
node_opcua_types_1.BrowseNextRequest.schema.fields[0].documentation = "A standard header included in all requests sent to a server.";
/*
 *
 * A Boolean parameter with the following values:
 *   TRUE:   passed continuationPoints shall be reset to free resources in the Server. The continuation points
 *           are released and the results and diagnosticInfos arrays are empty.
 *   FALSE:  passed continuationPoints shall be used to get the next set of browse information.
 *
 * A Client shall always use the continuation point returned by a Browse or
 * BrowseNext response to free the resources for the continuation point in the
 * Server. If the Client does not want to get the next set of browse information,
 * BrowseNext shall be called with this parameter set to TRUE.
 */
node_opcua_types_1.BrowseNextRequest.schema.fields[1].documentation =
    "If TRUE the continuation points are released and no results are returned.";
/*
 * A list of Server-defined opaque values that represent continuation points. The value for a continuation point
 * was returned to the Client in a previous Browse or BrowseNext response. These values are used to identify the
 * previously processed Browse or BrowseNext request that is being continued and the point in the result set
 * from which the browse response is to continue
 * Clients may mix continuation points from different Browse or BrowseNext responses.
 */
node_opcua_types_1.BrowseNextRequest.schema.fields[2].documentation = "The maximum number of references to return in the response.";
node_opcua_types_1.BrowseNextResponse.schema.documentation = "Browse the references for one or more nodes from the server address space.";
node_opcua_types_1.BrowseNextResponse.schema.fields[0].documentation = "A standard header included in all responses returned by servers.";
node_opcua_types_1.BrowseNextResponse.schema.fields[1].documentation = "The results for the browse operations.";
node_opcua_types_1.BrowseNextResponse.schema.fields[2].documentation = "The diagnostics associated with the results.";
node_opcua_types_1.BrowseRequest.schema.documentation = "Browse the references for one or more nodes from the server address space.";
node_opcua_types_1.BrowseRequest.schema.fields[0].documentation = "A standard header included in all requests sent to a server.";
/*
 * An empty ViewDescription value indicates the entire AddressSpace.
 * Use of the empty ViewDescription value causes all References of the nodesToBrowse to be returned. Use of any
 * other View causes only the References of the nodesToBrowse that are defined for that View to be returned.
 */
node_opcua_types_1.BrowseRequest.schema.fields[1].documentation = "The view to browse.";
// Indicates the maximum number of references to return for each starting Node
// specified in the request. The value 0 indicates that the Client is imposing no
// limitation (see 7.5 for Counter definition).
node_opcua_types_1.BrowseRequest.schema.fields[2].documentation = "The maximum number of references to return in the response.";
node_opcua_types_1.BrowseRequest.schema.fields[3].documentation = "The list of nodes to browse.";
node_opcua_types_1.BrowseResponse.schema.documentation = "Browse the references for one or more nodes from the server address space.";
node_opcua_types_1.BrowseResponse.schema.fields[0].documentation = "A standard header included in all responses returned by servers.";
node_opcua_types_1.BrowseResponse.schema.fields[1].documentation = "The results for the browse operations.";
node_opcua_types_1.BrowseResponse.schema.fields[2].documentation = "The diagnostics associated with the results.";
node_opcua_types_1.BrowseResult.schema.documentation = "The result of a browse operation.";
node_opcua_types_1.BrowseResult.schema.fields[0].documentation = "A code indicating any error during the operation.";
node_opcua_types_1.BrowseResult.schema.fields[1].documentation =
    "A value that indicates the operation is incomplete and can be continued by calling BrowseNext.";
node_opcua_types_1.BrowseResult.schema.fields[2].documentation = "A list of references that meet the criteria specified in the request.";
node_opcua_types_1.ReferenceDescription.schema.documentation = "The description of a reference.";
node_opcua_types_1.ReferenceDescription.schema.fields[0].documentation = "The type of references.";
node_opcua_types_1.ReferenceDescription.schema.fields[1].documentation = "TRUE if the reference is a forward reference.";
node_opcua_types_1.ReferenceDescription.schema.fields[2].documentation = "The id of the target node.";
node_opcua_types_1.ReferenceDescription.schema.fields[3].documentation = "The browse name of the target node.";
node_opcua_types_1.ReferenceDescription.schema.fields[4].documentation = "The display name of the target node.";
node_opcua_types_1.ReferenceDescription.schema.fields[5].documentation = "The node class of the target node.";
node_opcua_types_1.ReferenceDescription.schema.fields[6].documentation = "The type definition of the target node.";
node_opcua_types_1.ViewDescription.schema.documentation = "the view to browse.";
// ViewDescription : NodeId of the View to Query. A null value indicates the entire AddressSpace.
node_opcua_types_1.ViewDescription.schema.fields[0].documentation = "The node id of the view.";
// The time date desired. The corresponding version is the one with the closest
// previous creation timestamp. Either the Timestamp or the viewVersion
// parameter may be set by a Client, but not both. If ViewVersion is set this
// parameter shall be null.
node_opcua_types_1.ViewDescription.schema.fields[1].documentation = "Browses the view at or before this time.";
// The version number for the View desired. When Nodes are added to or removed from a View, the value of a
// View‟s ViewVersion Property is updated. Either the Timestamp or the viewVersion parameter may be set by
// a Client, but not both.
// The ViewVersion Property is defined in Part 3. If timestamp is set this parameter
// shall be 0. The current view is used if timestamp is null and viewVersion is 0.
node_opcua_types_1.ViewDescription.schema.fields[2].documentation = "Browses a specific version of the view .";
//# sourceMappingURL=index.js.map