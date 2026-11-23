"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ack_1 = require("./ack");
const topic_alias_send_1 = __importDefault(require("../topic-alias-send"));
const shared_1 = require("../shared");
const handleConnack = (client, packet, pump) => {
    client.log('_handleConnack');
    const { options } = client;
    const version = options.protocolVersion;
    const rc = version === 5 ? packet.reasonCode : packet.returnCode;
    if (client['connackReceived']) {
        const err = new shared_1.ErrorWithReasonCode('Protocol error: duplicate CONNACK on the same network connection', 130);
        pump?.discardParsedPackets();
        client['_cleanUp'](true);
        client.emit('error', err);
        return;
    }
    client['connackReceived'] = true;
    clearTimeout(client['connackTimer']);
    delete client['topicAliasSend'];
    client['_serverProperties'] = packet.properties;
    if (packet.properties) {
        if (packet.properties.topicAliasMaximum) {
            if (packet.properties.topicAliasMaximum > 0xffff) {
                pump?.discardParsedPackets();
                client['_cleanUp'](true);
                client.emit('error', new Error('topicAliasMaximum from broker is out of range'));
                return;
            }
            if (packet.properties.topicAliasMaximum > 0) {
                client['topicAliasSend'] = new topic_alias_send_1.default(packet.properties.topicAliasMaximum);
            }
        }
    }
    if (rc === 0) {
        client.reconnecting = false;
        client['_onConnect'](packet);
    }
    else if (rc > 0) {
        client.log('_handleConnack :: connection refused with reason code %d', rc);
        const err = new shared_1.ErrorWithReasonCode(`Connection refused: ${ack_1.ReasonCodes[rc]}`, rc);
        pump?.discardParsedPackets();
        client['reconnectSuppressed'] = true;
        client['_cleanUp'](true);
        try {
            client.emit('error', err);
        }
        finally {
            if (options.reconnectOnConnackError) {
                client['reconnectSuppressed'] = false;
                client['_setupReconnect']();
            }
        }
    }
};
exports.default = handleConnack;
//# sourceMappingURL=connack.js.map