"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const PROTOCOL_ERROR = 130;
const rejectAuth = (client, error, pump) => {
    client.log('handleAuth :: %s', error.message);
    pump?.discardParsedPackets();
    if (!pump || pump.isCurrent()) {
        client['_cleanUp'](true);
    }
    client.emit('error', error);
};
const handleAuth = (client, packet, pump) => {
    const { options } = client;
    const version = options.protocolVersion;
    const rc = version === 5 ? packet.reasonCode : packet.returnCode;
    if (version !== 5) {
        rejectAuth(client, new shared_1.ErrorWithReasonCode(`Protocol error: Auth packets are only supported in MQTT 5. Your version:${version}`, PROTOCOL_ERROR), pump);
        return;
    }
    const authenticationMethod = client['_authenticationMethod'];
    if (!authenticationMethod) {
        rejectAuth(client, new shared_1.ErrorWithReasonCode('Protocol error: Auth packet received but enhanced authentication was not requested', PROTOCOL_ERROR), pump);
        return;
    }
    if (packet.properties?.authenticationMethod !== authenticationMethod) {
        rejectAuth(client, new shared_1.ErrorWithReasonCode(`Protocol error: Auth packet Authentication Method does not match the "${authenticationMethod}" sent in CONNECT`, PROTOCOL_ERROR), pump);
        return;
    }
    client.handleAuth(packet, (err, packet2) => {
        if (err) {
            rejectAuth(client, err, pump);
            return;
        }
        if (rc === 0) {
            client.log('handleAuth :: authentication exchange completed successfully');
            return;
        }
        if (rc === 24) {
            if (!packet2) {
                rejectAuth(client, new shared_1.ErrorWithReasonCode('Protocol error: No auth packet to continue the authentication exchange', PROTOCOL_ERROR), pump);
                return;
            }
            client.reconnecting = false;
            client['_sendPacket'](packet2);
            return;
        }
        rejectAuth(client, new shared_1.ErrorWithReasonCode(`Protocol error: Auth packet reason code ${rc} is not one a broker may send`, PROTOCOL_ERROR), pump);
    });
};
exports.default = handleAuth;
//# sourceMappingURL=auth.js.map