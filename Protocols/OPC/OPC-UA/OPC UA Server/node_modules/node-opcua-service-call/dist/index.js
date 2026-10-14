"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module node-opcua-service-browse
 */
/**
 *
 * This Service is used to call (invoke) a list of Methods. Each method call is invoked within the context
 * of an existing Session. If the Session is terminated, the results of the method’s execution cannot be
 * returned to the Client and are discarded. This is independent of the task actually performed at the
 * Server.
 * This Service provides for passing input and output arguments to/from a method. These arguments
 * are defined by Properties of the method.
 *
 */
/*
 *
 *
 * extract from OPCUA Specification Part 4 Release 1.02 page 61:
 *
 * 5.11 **Method Service Set**
 *
 * 5.11.1 Overview
 *   Methods represent the function calls of Objects. They are defined in Part 3. Methods are invoked
 *   and return only after completion (successful or unsuccessful). Execution times for methods may
 *   vary, depending on the function that they perform.
 *   The Method Service Set defines the means to invoke methods. A method shall be a component of an
 *   Object. Discovery is provided through the Browse and Query Services. Clients discover the methods
 *   supported by a Server by browsing for the owning Objects References that identify their supported
 *   methods.
 *   Because Methods may control some aspect of plant operations, method invocation may depend on
 *   environmental or other conditions. This may be especially true when attempting to re -invoke a
 *   method immediately after it has completed execution. Conditions that are required to invoke the
 *   method might not yet have returned to the state that permits the method to start again.
 *
 *
 */
__exportStar(require("./imports"), exports);
//# sourceMappingURL=index.js.map