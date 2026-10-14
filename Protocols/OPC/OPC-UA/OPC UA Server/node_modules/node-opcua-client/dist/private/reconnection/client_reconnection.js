"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntilReconnectionIsCanceled = waitUntilReconnectionIsCanceled;
const console_1 = require("console");
function waitUntilReconnectionIsCanceled(client, callback) {
    const interval = 100;
    const maxIntervalCount = 100;
    let intervalCount = 0;
    const timer = setInterval(() => {
        if (!client.isReconnecting || ++intervalCount > maxIntervalCount) {
            clearInterval(timer);
            if (intervalCount > maxIntervalCount) {
                (0, console_1.warn)("waitUntilReconnectionIsCanceled: timeout");
            }
            callback();
        }
    }, interval);
}
//# sourceMappingURL=client_reconnection.js.map