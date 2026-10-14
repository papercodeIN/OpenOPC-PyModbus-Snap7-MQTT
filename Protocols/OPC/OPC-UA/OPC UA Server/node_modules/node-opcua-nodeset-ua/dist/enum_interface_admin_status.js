"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumInterfaceAdminStatus = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |InterfaceAdminStatus                                        |
 * | isAbstract|false                                                       |
 */
var EnumInterfaceAdminStatus;
(function (EnumInterfaceAdminStatus) {
    /**
     * Ready to pass packets.
     */
    EnumInterfaceAdminStatus[EnumInterfaceAdminStatus["Up"] = 0] = "Up";
    /**
     * Not ready to pass packets and not in some test
     * mode.
     */
    EnumInterfaceAdminStatus[EnumInterfaceAdminStatus["Down"] = 1] = "Down";
    /**
     * In some test mode.
     */
    EnumInterfaceAdminStatus[EnumInterfaceAdminStatus["Testing"] = 2] = "Testing";
})(EnumInterfaceAdminStatus || (exports.EnumInterfaceAdminStatus = EnumInterfaceAdminStatus = {}));
//# sourceMappingURL=enum_interface_admin_status.js.map