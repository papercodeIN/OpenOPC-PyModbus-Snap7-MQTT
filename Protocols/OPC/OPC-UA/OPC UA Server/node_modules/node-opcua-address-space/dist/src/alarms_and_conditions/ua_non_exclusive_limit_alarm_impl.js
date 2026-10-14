"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UANonExclusiveLimitAlarmImpl = void 0;
/* eslint-disable max-statements */
/**
 * @module node-opcua-address-space.AlarmsAndConditions
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const ua_two_state_variable_1 = require("../state_machine/ua_two_state_variable");
const condition_info_impl_1 = require("./condition_info_impl");
const ua_limit_alarm_impl_1 = require("./ua_limit_alarm_impl");
class UANonExclusiveLimitAlarmImpl extends ua_limit_alarm_impl_1.UALimitAlarmImpl {
    static instantiate(namespace, type, options, data) {
        const addressSpace = namespace.addressSpace;
        options.optionals = options.optionals || [];
        if (Object.prototype.hasOwnProperty.call(options, "lowLowLimit")) {
            options.optionals.push("LowLowLimit");
            options.optionals.push("LowLowState");
        }
        if (Object.prototype.hasOwnProperty.call(options, "lowLimit")) {
            options.optionals.push("LowLimit");
            options.optionals.push("LowState");
        }
        if (Object.prototype.hasOwnProperty.call(options, "highLimit")) {
            options.optionals.push("HighLimit");
            options.optionals.push("HighState");
        }
        if (Object.prototype.hasOwnProperty.call(options, "highHighLimit")) {
            options.optionals.push("HighHighLimit");
            options.optionals.push("HighHighState");
        }
        const nonExclusiveAlarmType = addressSpace.findEventType(type);
        /* istanbul ignore next */
        if (!nonExclusiveAlarmType) {
            throw new Error(" cannot find Alarm Condition Type for " + type);
        }
        const nonExclusiveLimitAlarmType = addressSpace.findEventType("NonExclusiveLimitAlarmType");
        /* istanbul ignore next */
        if (!nonExclusiveLimitAlarmType) {
            throw new Error("cannot find NonExclusiveLimitAlarmType");
        }
        // assert(type nonExclusiveLimitAlarmType.browseName.toString());
        const alarm = ua_limit_alarm_impl_1.UALimitAlarmImpl.instantiate(namespace, type, options, data);
        Object.setPrototypeOf(alarm, UANonExclusiveLimitAlarmImpl.prototype);
        (0, node_opcua_assert_1.assert)(alarm instanceof ua_limit_alarm_impl_1.UALimitAlarmImpl);
        (0, node_opcua_assert_1.assert)(alarm instanceof UANonExclusiveLimitAlarmImpl);
        // ---------------- install States
        if (alarm.lowLowState) {
            (0, ua_two_state_variable_1._install_TwoStateVariable_machinery)(alarm.lowLowState, {
                falseState: "LowLow inactive",
                trueState: "LowLow active"
            });
            alarm.lowLowState.setValue(false);
            (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(alarm, "lowLowLimit"));
        }
        if (alarm.lowState) {
            (0, ua_two_state_variable_1._install_TwoStateVariable_machinery)(alarm.lowState, {
                falseState: "Low inactive",
                trueState: "Low active"
            });
            alarm.lowState.setValue(false);
            (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(alarm, "lowLimit"));
        }
        if (alarm.highState) {
            (0, ua_two_state_variable_1._install_TwoStateVariable_machinery)(alarm.highState, {
                falseState: "High inactive",
                trueState: "High active"
            });
            alarm.highState.setValue(false);
            (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(alarm, "highLimit"));
        }
        if (alarm.highHighState) {
            (0, ua_two_state_variable_1._install_TwoStateVariable_machinery)(alarm.highHighState, {
                falseState: "HighHigh inactive",
                trueState: "HighHigh active"
            });
            alarm.highHighState.setValue(false);
            (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(alarm, "highHighLimit"));
        }
        alarm.activeState.setValue(false);
        alarm.updateState();
        return alarm;
    }
    _calculateConditionInfo(state, isActive, value, oldConditionInfo) {
        if (!isActive) {
            return new condition_info_impl_1.ConditionInfoImpl({
                message: "Back to normal",
                quality: node_opcua_status_code_1.StatusCodes.Good,
                retain: true,
                severity: 0
            });
        }
        else {
            return new condition_info_impl_1.ConditionInfoImpl({
                message: "Condition is " + value + " and state is " + state,
                quality: node_opcua_status_code_1.StatusCodes.Good,
                retain: true,
                severity: 150
            });
        }
    }
    _signalNewCondition2(states, isActive, value) {
        const alarm = this;
        if (typeof states === "string") {
            return;
        }
        function _install(name) {
            if (states[name] !== "unset") {
                alarm[name + "State"].setValue(states[name]);
            }
        }
        _install("highHigh");
        _install("high");
        _install("low");
        _install("lowLow");
        // build-up state string
        let state_str = Object.keys(states)
            .map((s) => (states[s] ? s : null))
            .filter((a) => a !== null)
            .join(";"); //
        state_str = JSON.stringify(states);
        ua_limit_alarm_impl_1.UALimitAlarmImpl.prototype._signalNewCondition.call(this, state_str, isActive, value);
    }
    _setStateBasedOnInputValue(value) {
        (0, node_opcua_assert_1.assert)(isFinite(value), "expecting a valid value here");
        let isActive = false;
        const states = {
            highHigh: this.highHighState ? this.highHighState.getValue() : "unset",
            high: this.highState ? this.highState.getValue() : "unset",
            low: this.lowState ? this.lowState.getValue() : "unset",
            lowLow: this.lowLowState ? this.lowLowState.getValue() : "unset"
        };
        let count = 0;
        function ___p(stateName, func_value) {
            if (states[stateName] !== "unset") {
                const val = func_value();
                isActive = isActive || val;
                if (states[stateName] !== val) {
                    states[stateName] = val;
                    count += 1;
                }
            }
        }
        ___p("highHigh", () => {
            return this.getHighHighLimit() < value;
        });
        ___p("high", () => {
            return this.getHighLimit() < value;
        });
        ___p("low", () => {
            return this.getLowLimit() > value;
        });
        ___p("lowLow", () => {
            return this.getLowLowLimit() > value;
        });
        if (count > 0) {
            this._signalNewCondition2(states, isActive, value.toFixed(3));
        }
    }
}
exports.UANonExclusiveLimitAlarmImpl = UANonExclusiveLimitAlarmImpl;
//# sourceMappingURL=ua_non_exclusive_limit_alarm_impl.js.map