"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNotifierFlags = void 0;
var EventNotifierFlags;
(function (EventNotifierFlags) {
    EventNotifierFlags[EventNotifierFlags["SubscribeToEvents"] = 1] = "SubscribeToEvents";
    EventNotifierFlags[EventNotifierFlags["Reserved"] = 2] = "Reserved";
    EventNotifierFlags[EventNotifierFlags["HistoryRead"] = 4] = "HistoryRead";
    EventNotifierFlags[EventNotifierFlags["HistoryWrite"] = 8] = "HistoryWrite";
    EventNotifierFlags[EventNotifierFlags["None"] = 0] = "None";
})(EventNotifierFlags || (exports.EventNotifierFlags = EventNotifierFlags = {}));
//# sourceMappingURL=event_notifier_flags.js.map