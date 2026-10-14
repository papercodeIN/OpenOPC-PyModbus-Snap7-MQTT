"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumInterfaceOperStatus = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |InterfaceOperStatus                                         |
 * | isAbstract|false                                                       |
 */
var EnumInterfaceOperStatus;
(function (EnumInterfaceOperStatus) {
    /**
     * Ready to pass packets.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["Up"] = 0] = "Up";
    /**
     * The interface does not pass any packets.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["Down"] = 1] = "Down";
    /**
     * In some test mode. No operational packets can be
     * passed.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["Testing"] = 2] = "Testing";
    /**
     * Status cannot be determined for some reason.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["Unknown"] = 3] = "Unknown";
    /**
     * Waiting for some external event.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["Dormant"] = 4] = "Dormant";
    /**
     * Some component (typically hardware) is missing.
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["NotPresent"] = 5] = "NotPresent";
    /**
     * Down due to state of lower-layer interface(s).
     */
    EnumInterfaceOperStatus[EnumInterfaceOperStatus["LowerLayerDown"] = 6] = "LowerLayerDown";
})(EnumInterfaceOperStatus || (exports.EnumInterfaceOperStatus = EnumInterfaceOperStatus = {}));
//# sourceMappingURL=enum_interface_oper_status.js.map