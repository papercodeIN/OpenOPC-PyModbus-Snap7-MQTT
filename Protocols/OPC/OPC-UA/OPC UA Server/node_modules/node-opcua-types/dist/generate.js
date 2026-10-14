"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module node-opcua-types
 */
// tslint:disable:no-console
const path_1 = __importDefault(require("path"));
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_generator_1 = require("node-opcua-generator");
const node_opcua_numeric_range_1 = require("node-opcua-numeric-range");
const node_opcua_variant_1 = require("node-opcua-variant");
const force_inclusion = node_opcua_numeric_range_1.NumericRange;
const force_inclusion_QualifiedName = node_opcua_data_model_1.QualifiedName;
const force_inclusion_LocalizedText = node_opcua_data_model_1.LocalizedText;
const force_inclusion_Variant = node_opcua_variant_1.Variant;
const force_inclusion_DataValue = node_opcua_data_value_1.DataValue;
async function main() {
    try {
        // await build_generated_folder();
        const filename = path_1.default.join(__dirname, "../xmlschemas/Opc.Ua.Types.bsd");
        const generatedTypescriptFilename = path_1.default.join(__dirname, "_generated_opcua_types.ts");
        await (0, node_opcua_generator_1.generate)(filename, generatedTypescriptFilename);
    }
    catch (err) {
        console.log(err);
    }
}
main().then().catch();
//# sourceMappingURL=generate.js.map