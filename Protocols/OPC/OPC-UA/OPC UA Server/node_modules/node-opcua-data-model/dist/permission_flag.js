"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPermissions = exports.PermissionFlag = void 0;
exports.makePermissionFlag = makePermissionFlag;
exports.permissionFlagToString = permissionFlagToString;
/**
 * @module node-opcua-data-model
 */
const _make_flag_1 = require("./_make_flag");
/**
 * https://reference.opcfoundation.org/v104/Core/docs/Part3/8.55/
 */
// same as PermissionType in node-opcua-types
var PermissionFlag;
(function (PermissionFlag) {
    PermissionFlag[PermissionFlag["None"] = 0] = "None";
    /**
     * The Client is allowed to see the references to and from the Node.
     * This implies that the Client is able to Read to Attributes other than the Value or the RolePermissions Attribute.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["Browse"] = 1] = "Browse";
    /**
     * The Client is allowed to read the RolePermissions Attribute.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["ReadRolePermissions"] = 2] = "ReadRolePermissions";
    /**
     * The Client is allowed to write to Attributes other than the Value,
     * Historizing or RolePermissions Attribute if the WriteMask indicates that
     * the Attribute is writeable.
     * This bit affects the value of a UserWriteMask Attribute.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["WriteAttribute"] = 4] = "WriteAttribute";
    /**
     * The Client is allowed to write to the RolePermissions Attribute if the WriteMask
     * indicates that the Attribute is writeable.
     * This bit affects the value of the UserWriteMask Attribute.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["WriteRolePermissions"] = 8] = "WriteRolePermissions";
    /**
     * The Client is allowed to write to the Historizing Attributes if the WriteMask indicates that the Attribute is writeable.
     * This bit affects the value of the UserWriteMask Attribute.
     * This Permission is only valid for Variables.
     */
    PermissionFlag[PermissionFlag["WriteHistorizing"] = 16] = "WriteHistorizing";
    /**
     * The Client is allowed to read the Value Attribute.
     * This bit affects the CurrentRead bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables.
     */
    PermissionFlag[PermissionFlag["Read"] = 32] = "Read";
    /**
     * The Client is allowed to write the Value Attribute.
     * This bit affects the CurrentWrite bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables.
     */
    PermissionFlag[PermissionFlag["Write"] = 64] = "Write";
    /**
     * The Client is allowed to read the history associated with a Node.
     * This bit affects the HistoryRead bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables, Objects or Views.
     */
    PermissionFlag[PermissionFlag["ReadHistory"] = 128] = "ReadHistory";
    /**
     * The Client is allowed to insert the history associated with a Node.
     * This bit affects the HistoryWrite bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables, Objects or Views.
     */
    PermissionFlag[PermissionFlag["InsertHistory"] = 256] = "InsertHistory";
    /**
     * The Client is allowed to modify the history associated with a Node.
     * This bit affects the HistoryWrite bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables, Objects or Views.
     */
    PermissionFlag[PermissionFlag["ModifyHistory"] = 512] = "ModifyHistory";
    /**
     * The Client is allowed to delete the history associated with a Node.
     * This bit affects the HistoryWrite bit of the UserAccessLevel Attribute.
     * This Permission is only valid for Variables, Objects or Views.
     */
    PermissionFlag[PermissionFlag["DeleteHistory"] = 1024] = "DeleteHistory";
    /**
     * A Client only receives an Event if this bit is set on the Node identified
     * by the EventTypeId field and on the Node identified by the SourceNode field.
     * This Permission is only valid for EventType Nodes or SourceNodes.
     */
    PermissionFlag[PermissionFlag["ReceiveEvents"] = 2048] = "ReceiveEvents";
    /**
     * The Client is allowed to call the Method if this bit is set on the Object or
     * ObjectType Node passed in the Call request and the Method Instance associated
     * with that Object or ObjectType.
     * This bit affects the UserExecutable Attribute when set on Method Node.
     * This Permission is only valid for Objects, ObjectType or Methods.
     */
    PermissionFlag[PermissionFlag["Call"] = 4096] = "Call";
    /**
     * 	The Client is allowed to add references to the Node.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["AddReference"] = 8192] = "AddReference";
    /**
     * The Client is allowed to remove references from the Node.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["RemoveReference"] = 16384] = "RemoveReference";
    /**
     * The Client is allowed to delete the Node.
     * This Permission is valid for all NodeClasses.
     */
    PermissionFlag[PermissionFlag["DeleteNode"] = 32768] = "DeleteNode";
    /**
     * The Client is allowed to add Nodes to the Namespace.
     * This Permission is only used in the DefaultRolePermissions and
     * DefaultUserRolePermissions Properties of a NamespaceMetadata Object
     */
    PermissionFlag[PermissionFlag["AddNode"] = 65536] = "AddNode";
})(PermissionFlag || (exports.PermissionFlag = PermissionFlag = {}));
exports.allPermissions = PermissionFlag.Browse |
    PermissionFlag.Browse |
    PermissionFlag.ReadRolePermissions |
    PermissionFlag.WriteAttribute |
    PermissionFlag.WriteRolePermissions |
    PermissionFlag.WriteHistorizing |
    PermissionFlag.Read |
    PermissionFlag.Write |
    PermissionFlag.ReadHistory |
    PermissionFlag.InsertHistory |
    PermissionFlag.ModifyHistory |
    PermissionFlag.DeleteHistory |
    PermissionFlag.ReceiveEvents |
    PermissionFlag.Call |
    PermissionFlag.AddReference |
    PermissionFlag.RemoveReference |
    PermissionFlag.DeleteNode |
    PermissionFlag.AddNode;
// @example
//      makePermissionFlag("ReceiveEvents | RemoveReference");
function makePermissionFlag(str) {
    if (str === "All") {
        return exports.allPermissions;
    }
    return (0, _make_flag_1._make_flag)(str, PermissionFlag.None, PermissionFlag);
}
function permissionFlagToString(permissionFlag) {
    const retVal = [];
    for (const [key, value] of Object.entries(PermissionFlag)) {
        const numKey = parseInt(key, 10);
        if (numKey.toString() !== key || numKey === 0) {
            continue;
        }
        if ((permissionFlag & numKey) === numKey) {
            retVal.push(value);
        }
    }
    if (retVal.length === 0) {
        retVal.push("None");
    }
    return retVal.join(" | ");
}
//# sourceMappingURL=permission_flag.js.map