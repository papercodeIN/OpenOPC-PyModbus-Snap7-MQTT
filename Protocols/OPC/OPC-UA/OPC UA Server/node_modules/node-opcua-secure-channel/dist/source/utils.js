"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpSecurityHeader = exports.doTraceStatistics = exports.doTraceClientResponseContent = exports.doTraceClientRequestContent = exports.doTraceClientMessage = exports.doPerfMonitoring = exports.doTraceResponse = exports.doTraceRequest = exports.doTraceServerMessage = void 0;
exports._dump_transaction_statistics = _dump_transaction_statistics;
exports._dump_client_transaction_statistics = _dump_client_transaction_statistics;
exports.traceRequestMessage = traceRequestMessage;
exports.traceResponseMessage = traceResponseMessage;
exports.traceClientRequestContent = traceClientRequestContent;
exports.traceClientResponseContent = traceClientResponseContent;
exports.traceClientRequestMessage = traceClientRequestMessage;
exports.traceClientConnectionClosed = traceClientConnectionClosed;
exports.traceClientResponseMessage = traceClientResponseMessage;
/* eslint-disable max-statements */
/* eslint-disable complexity */
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const traceLog = (0, node_opcua_debug_1.make_traceLog)(__filename);
const clientFlag = (process.env?.NODEOPCUADEBUG?.match(/CLIENT{([^}]*)}/) || [])[1] || "";
const serverFlag = (process.env?.NODEOPCUADEBUG?.match(/SERVER{([^}]*)}/) || [])[1] || "";
const filter = new RegExp((process.env?.NODEOPCUADEBUG?.match(/FILTER{([^}]*)}/) || [])[1] || ".*");
// console.log("serverFlag", serverFlag);
// console.log("clientFlag", clientFlag);
exports.doTraceServerMessage = serverFlag.match(/TRACE/);
exports.doTraceRequest = serverFlag.match(/REQUEST/);
exports.doTraceResponse = serverFlag.match(/RESPONSE/);
exports.doPerfMonitoring = serverFlag.match(/PERF/);
// eslint-disable-next-line prefer-const
exports.doTraceClientMessage = clientFlag.match(/TRACE/);
// eslint-disable-next-line prefer-const
exports.doTraceClientRequestContent = clientFlag.match(/REQUEST/);
// eslint-disable-next-line prefer-const
exports.doTraceClientResponseContent = clientFlag.match(/RESPONSE/);
exports.doTraceStatistics = process.env.NODEOPCUADEBUG && !!process.env.NODEOPCUADEBUG.match("STATS");
// const doPerfMonitoring = process.env.NODEOPCUADEBUG && process.env.NODEOPCUADEBUG.indexOf("PERF") >= 0;
exports.dumpSecurityHeader = process.env.NODEOPCUADEBUG && !!process.env.NODEOPCUADEBUG.match("SECURITY");
// istanbul ignore next
function _dump_transaction_statistics(stats) {
    if (stats) {
        console.log("                Bytes Read : ", stats.bytesRead);
        console.log("             Bytes Written : ", stats.bytesWritten);
        if (exports.doPerfMonitoring) {
            console.log("   time to receive request : ", (stats.lap_reception / 1000).toFixed(3), " sec");
            console.log("   time to process request : ", (stats.lap_processing / 1000).toFixed(3), " sec");
            console.log("   time to send response   : ", (stats.lap_emission / 1000).toFixed(3), " sec");
        }
    }
}
function _dump_client_transaction_statistics(stats) {
    function w(str) {
        return str.toString().padStart(12, " ").substring(0, 12);
    }
    console.log(chalk_1.default.green.bold("--------------------------------------------------------------------->> Stats"));
    console.log("   request                   : ", chalk_1.default.yellow(stats.request.schema.name.toString()), " / ", chalk_1.default.yellow(stats.response.schema.name.toString()), " - ", stats.request.requestHeader.requestHandle, "/", stats.response.responseHeader.requestHandle, stats.response.responseHeader.serviceResult.toString());
    console.log("   Bytes Read                : ", w(stats.bytesRead), " bytes");
    console.log("   Bytes Written             : ", w(stats.bytesWritten), " bytes");
    if (exports.doPerfMonitoring) {
        console.log("   transaction duration      : ", w(stats.lap_transaction.toFixed(3)), " milliseconds");
        console.log("   time to send request      : ", w(stats.lap_sending_request.toFixed(3)), " milliseconds");
        console.log("   time waiting for response : ", w(stats.lap_waiting_response.toFixed(3)), " milliseconds");
        console.log("   time to receive response  : ", w(stats.lap_receiving_response.toFixed(3)), " milliseconds");
        console.log("   time processing response  : ", w(stats.lap_processing_response.toFixed(3)), " milliseconds");
    }
    console.log(chalk_1.default.green.bold("---------------------------------------------------------------------<< Stats"));
}
const nameLength = "TranslateBrowsePathsToNodeIdsResponse".length + 2;
function __get_extraInfo(req) {
    if (req instanceof node_opcua_types_1.ReadRequest) {
        return " nodesToRead.length    =" + req.nodesToRead?.length;
    }
    if (req instanceof node_opcua_types_1.ReadResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.WriteRequest) {
        return " nodesToWrite.length   =" + req.nodesToWrite?.length;
    }
    if (req instanceof node_opcua_types_1.WriteResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.BrowseRequest) {
        return " nodesToBrowse.length  =" + req.nodesToBrowse?.length;
    }
    if (req instanceof node_opcua_types_1.BrowseResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.BrowseNextRequest) {
        return "                        "; // nodesToBrowse.length" + req.?.length;
    }
    if (req instanceof node_opcua_types_1.BrowseNextResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.CreateSessionRequest) {
        return " " + req.sessionName + " to:" + req.requestedSessionTimeout + "ms";
    }
    if (req instanceof node_opcua_types_1.CreateSessionResponse) {
        return " " + req.sessionId + " to:" + req.revisedSessionTimeout + "ms";
    }
    if (req instanceof node_opcua_types_1.ActivateSessionRequest) {
        if (req.userIdentityToken instanceof node_opcua_types_1.AnonymousIdentityToken) {
            return " Anonymous";
        }
        else if (req.userIdentityToken instanceof node_opcua_types_1.UserNameIdentityToken) {
            return " UserName";
        }
        else if (req.userIdentityToken instanceof node_opcua_types_1.X509IdentityToken) {
            return " X509";
        }
    }
    if (req instanceof node_opcua_types_1.ActivateSessionResponse) {
        return (req.results || []).map((p) => p.toString()).join(" ");
    }
    if (req instanceof node_opcua_types_1.CreateMonitoredItemsRequest) {
        const str = " n  =" + req.itemsToCreate?.length;
        const str2 = req.subscriptionId ? " sid = " + req.subscriptionId : "";
        return str + " " + str2;
    }
    if (req instanceof node_opcua_types_1.CreateMonitoredItemsResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.TranslateBrowsePathsToNodeIdsRequest) {
        return " browsePaths.length    =" + req.browsePaths?.length;
    }
    if (req instanceof node_opcua_types_1.TranslateBrowsePathsToNodeIdsResponse) {
        return " results.length        =" + req.results?.length;
    }
    if (req instanceof node_opcua_types_1.RegisterNodesRequest) {
        return " nodesToRegister.length=" + req.nodesToRegister?.length;
    }
    if (req instanceof node_opcua_types_1.OpenSecureChannelRequest) {
        return (" " +
            node_opcua_types_1.SecurityTokenRequestType[req.requestType] +
            " " +
            node_opcua_types_1.MessageSecurityMode[req.securityMode] +
            " lt:" +
            req.requestedLifetime +
            "ms");
    }
    if (req instanceof node_opcua_types_1.CreateSubscriptionResponse) {
        return " subscriptionId = " + req.subscriptionId;
    }
    if (req instanceof node_opcua_types_1.RegisterNodesResponse) {
        return " nodesToRegister.length=" + req.registeredNodeIds?.length;
    }
    if (req instanceof node_opcua_types_1.PublishRequest) {
        return " " + req.requestHeader.timeoutHint + "ms";
    }
    if (req instanceof node_opcua_types_1.PublishResponse) {
        let t = "";
        if (req.notificationMessage.notificationData) {
            for (const n of req.notificationMessage.notificationData) {
                t += n?.constructor?.name + " ";
                if (n instanceof node_opcua_types_1.DataChangeNotification) {
                    t += n.monitoredItems?.length;
                }
                if (n instanceof node_opcua_types_1.EventNotificationList) {
                    t += n.events?.length;
                }
                if (n instanceof node_opcua_types_1.StatusChangeNotification) {
                    t += n.status.toString();
                }
                t += " ";
                t = t.replace(/Notification/g, "Nt°");
            }
        }
        return " " + t + " seq#=" + req.notificationMessage.sequenceNumber;
    }
    if (req instanceof node_opcua_types_1.RepublishRequest) {
        return " subscriptionId = " + req.subscriptionId.toString();
    }
    if (req instanceof node_opcua_types_1.DeleteSubscriptionsRequest) {
        return req.subscriptionIds?.map((i) => i.toString()).join(", ") || "";
    }
    if (req instanceof node_opcua_types_1.TransferSubscriptionsRequest) {
        return req.subscriptionIds?.map((i) => i.toString()).join(", ") || "";
    }
    if (req instanceof node_opcua_types_1.TransferSubscriptionsResponse) {
        return req.results?.map((r) => r.statusCode.toString()).join(",") || "";
    }
    return "";
}
function _get_extraInfo(req) {
    return __get_extraInfo(req).padEnd(30);
}
function evaluateBinarySize(r) {
    const e = r;
    const size = e.binaryStoreSize();
    return "s=" + ("" + size).padStart(6) + " ";
}
function statusCodeToString(s) {
    if (s === node_opcua_status_code_1.StatusCodes.Good) {
        return chalk_1.default.green(s.toString());
    }
    else if (s.isGoodish()) {
        return chalk_1.default.yellow(s.toString());
    }
    else {
        return chalk_1.default.red(s.toString());
    }
}
// istanbul ignore next
function traceRequestMessage(request, channelId, instance) {
    if (exports.doTraceServerMessage) {
        const extra = _get_extraInfo(request);
        const size = evaluateBinarySize(request);
        const requestId = request.requestHeader.requestHandle;
        console.log(chalk_1.default.green((0, node_opcua_utils_1.timestamp)(), "   >>>>> ------ S"), instance.toString().padStart(3), channelId.toString().padStart(3), requestId.toString().padStart(8), chalk_1.default.yellow(request.schema.name.padEnd(nameLength)), extra, size);
        if (exports.doTraceRequest && filter && request.constructor.name.match(filter)) {
            console.log(request.toString());
            console.log(chalk_1.default.cyan("   >>>>> ------ \n"));
        }
    }
}
// istanbul ignore next
function traceResponseMessage(response, tokenId, channelId, instance) {
    (0, node_opcua_assert_1.assert)(response.responseHeader.requestHandle >= 0);
    if (exports.doTraceServerMessage) {
        const extra = _get_extraInfo(response);
        const size = evaluateBinarySize(response);
        const requestId = response.responseHeader.requestHandle;
        console.log(chalk_1.default.green.bold((0, node_opcua_utils_1.timestamp)(), "   <<<<< ------ S"), instance.toString().padStart(3), channelId.toString().padStart(3), requestId.toString().padStart(8), tokenId.toString().padStart(3), chalk_1.default.green.bold(response.schema.name.padEnd(nameLength)), extra, size, statusCodeToString(response.responseHeader.serviceResult));
        if (exports.doTraceResponse && filter && response.constructor.name.match(filter)) {
            console.log(response.toString());
            console.log(chalk_1.default.cyan.bold("       <<<<< ------n"));
        }
    }
}
function traceClientRequestContent(request, channelId, securityToken) {
    traceLog(chalk_1.default.yellow.bold("------------------------------------- Client Sending a request  "), request.constructor.name, "h=", request.requestHeader.requestHandle, " channel id ", channelId, " securityToken=", securityToken ? securityToken.tokenId : "x");
    if (exports.doTraceClientRequestContent) {
        traceLog(request.toString());
    }
}
function traceClientResponseContent(response, channelId) {
    if (exports.doTraceClientResponseContent) {
        traceLog(response.toString());
    }
}
// istanbul ignore next
// istanbul ignore next
function traceClientRequestMessage(request, channelId, instance) {
    const extra = _get_extraInfo(request);
    const size = evaluateBinarySize(request);
    const requestId = request.requestHeader.requestHandle;
    console.log(chalk_1.default.cyan((0, node_opcua_utils_1.timestamp)(), "  >>>>>> ------ C"), instance.toString().padStart(3), channelId.toString().padStart(3), requestId.toString().padStart(8), request.schema.name.padEnd(nameLength), extra, size);
}
function traceClientConnectionClosed(err, channelId, instance) {
    const extra = err?.message ? chalk_1.default.red(err.message) : chalk_1.default.green("<expected>");
    const size = "";
    const requestId = "";
    console.log(chalk_1.default.cyan((0, node_opcua_utils_1.timestamp)(), "  >>>>>> ------ C"), instance.toString().padStart(3), channelId.toString().padStart(3), requestId.toString().padStart(8), chalk_1.default.cyan("<disconnection").padEnd(nameLength), extra, size);
}
function additionalInfo(response) {
    if (response instanceof node_opcua_types_1.BrowseNextResponse || response instanceof node_opcua_types_1.BrowseResponse) {
        const results = response.results;
        if (!results)
            return "";
        const someBad = results.find((r) => r.statusCode.isNotGood());
        if (!someBad) {
            return "";
        }
        return "!!" + someBad.toString();
    }
    if (response instanceof node_opcua_types_1.CreateSubscriptionResponse) {
        return response.subscriptionId.toString();
    }
    return "";
}
function traceClientResponseMessage(response, channelId, instance) {
    const extra = _get_extraInfo(response);
    const size = evaluateBinarySize(response);
    const requestId = response.responseHeader.requestHandle;
    console.log(chalk_1.default.cyan.bold((0, node_opcua_utils_1.timestamp)(), "  <<<<<< ------ C"), instance.toString().padStart(3), channelId.toString().padStart(3), requestId.toString().padStart(8), response.schema.name.padEnd(nameLength), extra, size, statusCodeToString(response.responseHeader.serviceResult), additionalInfo(response));
}
//# sourceMappingURL=utils.js.map