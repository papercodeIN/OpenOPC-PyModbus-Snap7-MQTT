"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UADiscreteAlarmImpl = void 0;
/**
 * @module node-opcua-address-space.AlarmsAndConditions
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const ua_alarm_condition_impl_1 = require("./ua_alarm_condition_impl");
/**
 * The DiscreteAlarmType is used to classify Types into Alarm Conditions where the input for the
 * Alarm may take on only a certain number of possible values (e.g. true/false,
 * running/stopped/terminating).
 */
class UADiscreteAlarmImpl extends ua_alarm_condition_impl_1.UAAlarmConditionImpl {
    static instantiate(namespace, discreteAlarmTypeId, options, data) {
        const addressSpace = namespace.addressSpace;
        const discreteAlarmType = addressSpace.findEventType(discreteAlarmTypeId);
        /* istanbul ignore next */
        if (!discreteAlarmType) {
            throw new Error(" cannot find Condition Type for " + discreteAlarmType);
        }
        const discreteAlarmTypeBase = addressSpace.findObjectType("DiscreteAlarmType");
        (0, node_opcua_assert_1.assert)(discreteAlarmTypeBase, "expecting DiscreteAlarmType - please check you nodeset xml file!");
        /* eventTypeNode should be subtypeOf("DiscreteAlarmType"); */
        /* istanbul ignore next */
        if (!discreteAlarmType.isSubtypeOf(discreteAlarmTypeBase)) {
            throw new Error("UADiscreteAlarm.instantiate : event found is not subType of DiscreteAlarmType");
        }
        const alarmNode = ua_alarm_condition_impl_1.UAAlarmConditionImpl.instantiate(namespace, discreteAlarmType.nodeId, options, data);
        Object.setPrototypeOf(alarmNode, UADiscreteAlarmImpl.prototype);
        return alarmNode;
    }
}
exports.UADiscreteAlarmImpl = UADiscreteAlarmImpl;
//# sourceMappingURL=ua_discrete_alarm_impl.js.map