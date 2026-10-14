"use strict";
/**
 * @module node-opcua-address-space.AlarmsAndConditions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UANonExclusiveDeviationAlarmImpl = void 0;
const node_opcua_assert_1 = require("node-opcua-assert");
const deviation_alarm_helper_1 = require("./deviation_alarm_helper");
const ua_limit_alarm_impl_1 = require("./ua_limit_alarm_impl");
const ua_non_exclusive_limit_alarm_impl_1 = require("./ua_non_exclusive_limit_alarm_impl");
class UANonExclusiveDeviationAlarmImpl extends ua_non_exclusive_limit_alarm_impl_1.UANonExclusiveLimitAlarmImpl {
    static instantiate(namespace, type, options, data) {
        const addressSpace = namespace.addressSpace;
        const nonExclusiveDeviationAlarmType = addressSpace.findEventType("NonExclusiveDeviationAlarmType");
        /* istanbul ignore next */
        if (!nonExclusiveDeviationAlarmType) {
            throw new Error("cannot find ExclusiveDeviationAlarmType");
        }
        (0, node_opcua_assert_1.assert)(type === nonExclusiveDeviationAlarmType.browseName.toString());
        const alarm = ua_non_exclusive_limit_alarm_impl_1.UANonExclusiveLimitAlarmImpl.instantiate(namespace, type, options, data);
        Object.setPrototypeOf(alarm, UANonExclusiveDeviationAlarmImpl.prototype);
        (0, node_opcua_assert_1.assert)(alarm instanceof UANonExclusiveDeviationAlarmImpl);
        (0, node_opcua_assert_1.assert)(alarm instanceof ua_non_exclusive_limit_alarm_impl_1.UANonExclusiveLimitAlarmImpl);
        (0, node_opcua_assert_1.assert)(alarm instanceof ua_limit_alarm_impl_1.UALimitAlarmImpl);
        alarm._install_setpoint(options);
        return alarm;
    }
    _setStateBasedOnInputValue(value) {
        const setpointValue = this.getSetpointValue();
        if (setpointValue === null) {
            throw new Error("Cannot access setpoint Value");
        }
        (0, node_opcua_assert_1.assert)(isFinite(setpointValue), "expecting a valid setpoint value");
        // call base class implementation
        super._setStateBasedOnInputValue(value - setpointValue);
    }
    getSetpointNodeNode() {
        return deviation_alarm_helper_1.DeviationAlarmHelper_getSetpointNodeNode.call(this);
    }
    getSetpointValue() {
        return deviation_alarm_helper_1.DeviationAlarmHelper_getSetpointValue.call(this);
    }
    _onSetpointDataValueChange(dataValue) {
        deviation_alarm_helper_1.DeviationAlarmHelper_onSetpointDataValueChange.call(this, dataValue);
    }
    _install_setpoint(options) {
        return deviation_alarm_helper_1.DeviationAlarmHelper_install_setpoint.call(this, options);
    }
}
exports.UANonExclusiveDeviationAlarmImpl = UANonExclusiveDeviationAlarmImpl;
//# sourceMappingURL=ua_non_exclusive_deviation_alarm_impl.js.map