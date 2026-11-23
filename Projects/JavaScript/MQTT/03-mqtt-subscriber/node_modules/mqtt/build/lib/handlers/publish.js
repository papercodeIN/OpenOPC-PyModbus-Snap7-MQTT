"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const validReasonCodes = [0, 16, 128, 131, 135, 144, 145, 151, 153];
const TOPIC_ALIAS_INVALID = 148;
const PROTOCOL_ERROR = 130;
const rejectTopicAlias = (client, message, done, pump, reasonCode = TOPIC_ALIAS_INVALID) => {
    pump?.discardParsedPackets();
    if (!pump || pump.isCurrent()) {
        client['_cleanUp'](true);
    }
    done();
    client.emit('error', new shared_1.ErrorWithReasonCode(message, reasonCode));
};
const failCustomAck = (client, error, done) => {
    done();
    client.emit('error', error);
};
const handlePublish = (client, packet, done, pump) => {
    client.log('handlePublish: packet %o', packet);
    done = typeof done !== 'undefined' ? done : client.noop;
    let topic = packet.topic.toString();
    const message = packet.payload;
    const { qos } = packet;
    const { messageId } = packet;
    const { options } = client;
    if (client.options.protocolVersion === 5) {
        let alias;
        if (packet.properties) {
            alias = packet.properties.topicAlias;
        }
        if (typeof alias !== 'undefined') {
            const topicAliasRecv = client['topicAliasRecv'];
            if (!topicAliasRecv) {
                client.log('handlePublish :: received unexpected topic alias. alias: %d', alias);
                rejectTopicAlias(client, 'Received a PUBLISH Topic Alias but no Topic Alias Maximum was advertised', done, pump);
                return;
            }
            if (topic.length === 0) {
                if (alias > 0 && alias <= 0xffff) {
                    const gotTopic = topicAliasRecv.getTopicByAlias(alias);
                    if (gotTopic) {
                        topic = gotTopic;
                        client.log('handlePublish :: topic complemented by alias. topic: %s - alias: %d', topic, alias);
                    }
                    else {
                        client.log('handlePublish :: unregistered topic alias. alias: %d', alias);
                        rejectTopicAlias(client, 'Received unregistered Topic Alias', done, pump, PROTOCOL_ERROR);
                        return;
                    }
                }
                else {
                    client.log('handlePublish :: topic alias out of range. alias: %d', alias);
                    rejectTopicAlias(client, `Received Topic Alias ${alias} is outside the valid range 1-65535`, done, pump);
                    return;
                }
            }
            else if (topicAliasRecv.put(topic, alias)) {
                client.log('handlePublish :: registered topic: %s - alias: %d', topic, alias);
            }
            else {
                client.log('handlePublish :: topic alias outside the advertised maximum. alias: %d - max: %d', alias, topicAliasRecv.max);
                rejectTopicAlias(client, `Received Topic Alias ${alias} is outside the advertised Topic Alias Maximum range 1-${topicAliasRecv.max}`, done, pump);
                return;
            }
        }
    }
    client.log('handlePublish: qos %d', qos);
    switch (qos) {
        case 2: {
            options.customHandleAcks(topic, message, packet, (error, code) => {
                if (typeof error === 'number') {
                    code = error;
                    error = null;
                }
                if (error) {
                    return failCustomAck(client, error, done);
                }
                if (validReasonCodes.indexOf(code) === -1) {
                    return failCustomAck(client, new Error('Wrong reason code for pubrec'), done);
                }
                if (code) {
                    client['_sendPacket']({ cmd: 'pubrec', messageId, reasonCode: code }, done);
                }
                else {
                    if (!client['_trackIncomingQoS2Publish'](messageId, done, pump)) {
                        return;
                    }
                    client.incomingStore.put(packet, () => {
                        client['_sendPacket']({ cmd: 'pubrec', messageId }, done);
                    });
                }
            });
            break;
        }
        case 1: {
            options.customHandleAcks(topic, message, packet, (error, code) => {
                if (typeof error === 'number') {
                    code = error;
                    error = null;
                }
                if (error) {
                    return failCustomAck(client, error, done);
                }
                if (validReasonCodes.indexOf(code) === -1) {
                    return failCustomAck(client, new Error('Wrong reason code for puback'), done);
                }
                if (!code) {
                    client.emit('message', topic, message, packet);
                }
                client.handleMessage(packet, (err) => {
                    if (err) {
                        return done && done(err);
                    }
                    client['_sendPacket']({ cmd: 'puback', messageId, reasonCode: code }, done);
                });
            });
            break;
        }
        case 0:
            client.emit('message', topic, message, packet);
            client.handleMessage(packet, done);
            break;
        default:
            client.log('handlePublish: unknown QoS. Doing nothing.');
            break;
    }
};
exports.default = handlePublish;
//# sourceMappingURL=publish.js.map