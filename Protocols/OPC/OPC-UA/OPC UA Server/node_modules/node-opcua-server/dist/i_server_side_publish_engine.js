"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferredSubscription = void 0;
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
class TransferredSubscription {
    constructor(options) {
        this.id = options.id;
        this._sequence_number_generator = options.generator;
        this.publishEngine = options.publishEngine;
    }
    get hasPendingNotifications() {
        return !!this._pending_notification;
    }
    dispose() {
        this._pending_notification = undefined;
        this.publishEngine = null;
    }
    _publish_pending_notifications() {
        (0, node_opcua_assert_1.default)(this._pending_notification);
        const notificationMessage = this._pending_notification;
        this._pending_notification = undefined;
        const moreNotifications = false;
        const subscriptionId = this.id;
        const response = new node_opcua_types_1.PublishResponse({
            moreNotifications,
            notificationMessage: {
                notificationData: [notificationMessage],
                publishTime: new Date(),
                sequenceNumber: 0xffffffff
            },
            subscriptionId
        });
        // apply sequence number and store in sent_notifications queue
        (0, node_opcua_assert_1.default)(response.notificationMessage.sequenceNumber === 0xffffffff);
        response.notificationMessage.sequenceNumber = this._get_next_sequence_number();
        // xxx    this._sent_notifications.push(response.notificationMessage);
        // get available sequence number;
        const availableSequenceNumbers = [response.notificationMessage.sequenceNumber];
        (0, node_opcua_assert_1.default)(!response.notificationMessage ||
            availableSequenceNumbers[availableSequenceNumbers.length - 1] === response.notificationMessage.sequenceNumber);
        response.availableSequenceNumbers = availableSequenceNumbers;
        this.publishEngine._send_response(this, response);
    }
    _get_next_sequence_number() {
        return this._sequence_number_generator ? this._sequence_number_generator.next() : 0;
    }
}
exports.TransferredSubscription = TransferredSubscription;
//# sourceMappingURL=i_server_side_publish_engine.js.map