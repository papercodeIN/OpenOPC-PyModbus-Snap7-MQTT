"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module node-opcua-client
 */
const util_1 = require("util");
const node_opcua_alarm_condition_1 = require("node-opcua-alarm-condition");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const client_session_impl_1 = require("../private/client_session_impl");
client_session_impl_1.ClientSessionImpl.prototype.disableCondition = () => {
    /** */
};
client_session_impl_1.ClientSessionImpl.prototype.enableCondition = () => {
    /** */
};
client_session_impl_1.ClientSessionImpl.prototype.addCommentCondition = function (conditionId, eventId, comment, callback) {
    (0, util_1.callbackify)(node_opcua_alarm_condition_1.callMethodCondition)(this, "AddComment", conditionId, eventId, comment, callback);
};
/** @deprecated */
client_session_impl_1.ClientSessionImpl.prototype.findMethodId = function (nodeId, methodName, callback) {
    (0, node_opcua_pseudo_session_1.findMethodId)(this, nodeId, methodName)
        .then((data) => {
        if (data.methodId) {
            callback(null, data.methodId);
        }
        else {
            callback(data.err);
        }
    })
        .catch((err) => {
        callback(err);
    });
};
client_session_impl_1.ClientSessionImpl.prototype.confirmCondition = function (conditionId, eventId, comment, callback) {
    // ns=0;i=9113 AcknowledgeableConditionType#Confirm
    // note that confirm method is Optionals on condition
    (0, util_1.callbackify)(node_opcua_alarm_condition_1.confirmCondition)(this, conditionId, eventId, comment, callback);
};
client_session_impl_1.ClientSessionImpl.prototype.acknowledgeCondition = function (conditionId, eventId, comment, callback) {
    // ns=0;i=9111 AcknowledgeableConditionType#Acknowledge
    (0, util_1.callbackify)(node_opcua_alarm_condition_1.acknowledgeCondition)(this, conditionId, eventId, comment, callback);
};
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
client_session_impl_1.ClientSessionImpl.prototype.addCommentCondition = (0, thenify_ex_1.withCallback)(client_session_impl_1.ClientSessionImpl.prototype.addCommentCondition, opts);
client_session_impl_1.ClientSessionImpl.prototype.findMethodId = (0, thenify_ex_1.withCallback)(client_session_impl_1.ClientSessionImpl.prototype.findMethodId, opts);
client_session_impl_1.ClientSessionImpl.prototype.confirmCondition = (0, thenify_ex_1.withCallback)(client_session_impl_1.ClientSessionImpl.prototype.confirmCondition, opts);
client_session_impl_1.ClientSessionImpl.prototype.acknowledgeCondition = (0, thenify_ex_1.withCallback)(client_session_impl_1.ClientSessionImpl.prototype.acknowledgeCondition, opts);
//# sourceMappingURL=client_tools.js.map