"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UAExclusiveLevelAlarmImpl = void 0;
const ua_exclusive_limit_alarm_impl_1 = require("./ua_exclusive_limit_alarm_impl");
class UAExclusiveLevelAlarmImpl extends ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl {
    static instantiate(namespace, type, options, data) {
        const addressSpace = namespace.addressSpace;
        return ua_exclusive_limit_alarm_impl_1.UAExclusiveLimitAlarmImpl.instantiate(namespace, type, options, data);
    }
}
exports.UAExclusiveLevelAlarmImpl = UAExclusiveLevelAlarmImpl;
//# sourceMappingURL=ua_exclusive_level_alarm_impl.js.map