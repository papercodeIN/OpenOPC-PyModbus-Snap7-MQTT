"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.unregisterObject = exports.registerObject = exports.generateTypeScriptCodeFromSchema = void 0;
/* istanbul ignore file */
/**
 * @module node-opcua-generator
 */
var generator_1 = require("./generator");
Object.defineProperty(exports, "generateTypeScriptCodeFromSchema", { enumerable: true, get: function () { return generator_1.generateTypeScriptCodeFromSchema; } });
Object.defineProperty(exports, "registerObject", { enumerable: true, get: function () { return generator_1.registerObject; } });
Object.defineProperty(exports, "unregisterObject", { enumerable: true, get: function () { return generator_1.unregisterObject; } });
var generate_extension_object_code_1 = require("./generate_extension_object_code");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generate_extension_object_code_1.generate; } });
//# sourceMappingURL=index.js.map