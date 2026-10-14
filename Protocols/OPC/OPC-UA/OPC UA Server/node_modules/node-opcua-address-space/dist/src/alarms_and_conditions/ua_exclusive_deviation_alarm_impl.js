"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UAExclusiveDeviationAlarmImpl = void 0;
/**
 * @module node-opcua-address-space.AlarmsAndConditions
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const deviation_alarm_helper_1 = require("./deviation_alarm_helper");
const ua_exclusive_limit_alarm_impl_1 = require("./ua_exclusive_limit_alarm_impl");
const ua_limit_alarm_impl_1 = require("./ua_limit_alarm_impl");
class UAExclusiveDeviationAlarmImpl extends ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl {
    static instantiate(namespace, type, options, data) {
        const addressSpace = namespace.addressSpace;
        const exclusiveDeviationAlarmType = addressSpace.findEventType("ExclusiveDeviationAlarmType");
        /* istanbul ignore next */
        if (!exclusiveDeviationAlarmType) {
            throw new Error("cannot find ExclusiveDeviationAlarmType");
        }
        (0, node_opcua_assert_1.assert)(type === exclusiveDeviationAlarmType.browseName.toString());
        const alarm = ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl.instantiate(namespace, type, options, data);
        Object.setPrototypeOf(alarm, UAExclusiveDeviationAlarmImpl.prototype);
        (0, node_opcua_assert_1.assert)(alarm instanceof UAExclusiveDeviationAlarmImpl);
        (0, node_opcua_assert_1.assert)(alarm instanceof ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl);
        (0, node_opcua_assert_1.assert)(alarm instanceof ua_limit_alarm_impl_1.UALimitAlarmImpl);
        alarm._install_setpoint(options);
        return alarm;
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
    _setStateBasedOnInputValue(value) {
        const setpointValue = this.getSetpointValue();
        if (setpointValue === null) {
            return;
        }
        (0, node_opcua_assert_1.assert)(isFinite(setpointValue));
        // call base class implementation
        ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl.prototype._setStateBasedOnInputValue.call(this, value - setpointValue);
    }
}
exports.UAExclusiveDeviationAlarmImpl = UAExclusiveDeviationAlarmImpl;
/*
UAExclusiveDeviationAlarm.prototype.getSetpointNodeNode = DeviationAlarmHelper.getSetpointNodeNode;
UAExclusiveDeviationAlarm.prototype.getSetpointValue = DeviationAlarmHelper.getSetpointValue;
UAExclusiveDeviationAlarm.prototype._onSetpointDataValueChange = DeviationAlarmHelper._onSetpointDataValueChange;
UAExclusiveDeviationAlarm.prototype._install_setpoint = DeviationAlarmHelper._install_setpoint;
 */
//# sourceMappingURL=ua_exclusive_deviation_alarm_impl.js.map