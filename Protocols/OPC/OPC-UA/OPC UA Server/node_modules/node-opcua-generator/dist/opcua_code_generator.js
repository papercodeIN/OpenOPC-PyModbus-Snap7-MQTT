"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
/**
 * @module node-opcua-generator
 */
// tslint:disable:no-console
const generator_1 = require("./generator");
console.log(process.argv);
async function main() {
    const className = "LocalizedText";
    (0, generator_1.generateTypeScriptCodeFromSchema)(className);
}
main().then().catch();
//# sourceMappingURL=opcua_code_generator.js.map