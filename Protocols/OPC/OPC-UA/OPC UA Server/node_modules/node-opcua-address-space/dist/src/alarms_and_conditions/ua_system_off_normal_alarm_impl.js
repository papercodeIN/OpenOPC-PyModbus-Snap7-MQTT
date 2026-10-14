"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UASystemOffNormalAlarmImpl = void 0;
const ua_off_normal_alarm_impl_1 = require("./ua_off_normal_alarm_impl");
/**
 *
 * This Condition is used by a Server to indicate that an underlying system that is providing  Alarm information is
 * having a communication problem and that the Server may have invalid or incomplete Condition state in the
 * Subscription.
 *
 */
class UASystemOffNormalAlarmImpl extends ua_off_normal_alarm_impl_1.UAOffNormalAlarmImpl {
    static instantiate(namespace, limitAlarmTypeId, options, data) {
        return ua_off_normal_alarm_impl_1.UAOffNormalAlarmImpl.instantiate(namespace, limitAlarmTypeId, options, data);
    }
}
exports.UASystemOffNormalAlarmImpl = UASystemOffNormalAlarmImpl;
//# sourceMappingURL=ua_system_off_normal_alarm_impl.js.map