"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSession = exports.MockContinuationPointManager = void 0;
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
class MockContinuationPointManager {
    registerHistoryReadRaw(maxElements, dataValues, cnt) {
        throw new Error("Method not implemented.");
    }
    getNextHistoryReadRaw(numValues, cnt) {
        throw new Error("Method not implemented.");
    }
    registerReferences(maxElements, values, cnt) {
        throw new Error("Method not implemented.");
    }
    getNextReferences(numValue, cnt) {
        throw new Error("Method not implemented.");
    }
}
exports.MockContinuationPointManager = MockContinuationPointManager;
exports.mockSession = {
    getSessionId() {
        return new node_opcua_nodeid_1.NodeId();
    },
    continuationPointManager: new MockContinuationPointManager()
};
//# sourceMappingURL=mock_session.js.map