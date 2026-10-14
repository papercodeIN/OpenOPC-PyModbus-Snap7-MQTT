"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizedText = void 0;
exports.coerceLocalizedText = coerceLocalizedText;
exports.encodeLocalizedText = encodeLocalizedText;
exports.decodeLocalizedText = decodeLocalizedText;
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_factory_1 = require("node-opcua-factory");
function coerceLocalizedText(value) {
    if (value === undefined || value === null) {
        return null;
    }
    if (value instanceof LocalizedText) {
        return value;
    }
    return new LocalizedText(value);
}
// --------------------------------------------------------------------------------------------
// see Part 3 - $8.5 page 63
const schemaLocalizedText = (0, node_opcua_factory_1.buildStructuredType)({
    name: "LocalizedText",
    baseType: "BaseUAObject",
    category: node_opcua_factory_1.FieldCategory.basic,
    fields: [
        {
            name: "Locale",
            fieldType: "LocaleId",
            defaultValue: null
        },
        {
            name: "Text",
            fieldType: "String",
            defaultValue: null
        }
    ]
});
schemaLocalizedText.coerce = coerceLocalizedText;
class LocalizedText extends node_opcua_factory_1.BaseUAObject {
    static get schema() {
        return schemaLocalizedText;
    }
    get schema() {
        return schemaLocalizedText;
    }
    static coerce(value) {
        return coerceLocalizedText(value);
    }
    constructor(options) {
        super();
        if (options === null) {
            this.locale = null;
            this.text = null;
            return;
        }
        if (typeof options === "string") {
            this.locale = null;
            this.text = options;
            return;
        }
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            const schema = schemaLocalizedText;
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        this.locale = options?.locale || null;
        this.text = options?.text || null;
    }
    toString() {
        return "locale=" + this.locale + " text=" + this.text;
    }
    // OPCUA Part 6 $ 5.2.2.14 : localizedText have a special encoding
    encode(stream) {
        // tslint:disable:no-bitwise
        const encodingMask = getLocalizeText_EncodingByte(this);
        (0, node_opcua_basic_types_1.encodeByte)(encodingMask, stream);
        if ((encodingMask & 0x01) === 0x01) {
            (0, node_opcua_basic_types_1.encodeString)(this.locale, stream);
        }
        if ((encodingMask & 0x02) === 0x02) {
            (0, node_opcua_basic_types_1.encodeString)(this.text, stream);
        }
    }
    decodeDebug(stream, options) {
        let cursorBefore;
        const tracer = options.tracer;
        tracer.trace("start", options.name + "(" + "LocalizedText" + ")", stream.length, stream.length);
        cursorBefore = stream.length;
        const encodingMask = (0, node_opcua_basic_types_1.decodeByte)(stream);
        tracer.trace("member", "encodingByte", "0x" + encodingMask.toString(16), cursorBefore, stream.length, "Mask");
        cursorBefore = stream.length;
        if ((encodingMask & 0x01) === 0x01) {
            this.locale = (0, node_opcua_basic_types_1.decodeString)(stream);
            tracer.trace("member", "locale", this.locale, cursorBefore, stream.length, "locale");
            cursorBefore = stream.length;
        }
        else {
            this.locale = null;
        }
        if ((encodingMask & 0x02) === 0x02) {
            this.text = (0, node_opcua_basic_types_1.decodeString)(stream);
            tracer.trace("member", "text", this.text, cursorBefore, stream.length, "text");
            // cursor_before = stream.length;
        }
        else {
            this.text = null;
        }
        tracer.trace("end", options.name, stream.length, stream.length);
    }
    decode(stream) {
        const encodingMask = (0, node_opcua_basic_types_1.decodeByte)(stream);
        if ((encodingMask & 0x01) === 0x01) {
            this.locale = (0, node_opcua_basic_types_1.decodeString)(stream);
        }
        else {
            this.locale = null;
        }
        if ((encodingMask & 0x02) === 0x02) {
            this.text = (0, node_opcua_basic_types_1.decodeString)(stream);
        }
        else {
            this.text = null;
        }
    }
}
exports.LocalizedText = LocalizedText;
LocalizedText.possibleFields = ["locale", "text"];
// not an extension object registerClassDefinition("LocalizedText", LocalizedText);
(0, node_opcua_factory_1.registerSpecialVariantEncoder)(LocalizedText);
function getLocalizeText_EncodingByte(localizedText) {
    let encodingMask = 0;
    if (localizedText.locale) {
        encodingMask |= 0x01;
    }
    if (localizedText.text) {
        encodingMask |= 0x02;
    }
    return encodingMask;
}
const emptyLocalizedText = new LocalizedText({});
function encodeLocalizedText(value, stream) {
    if (value) {
        value.encode(stream);
    }
    else {
        emptyLocalizedText.encode(stream);
    }
}
function decodeLocalizedText(stream, value) {
    value = value || new LocalizedText(null);
    value.decode(stream);
    return value;
}
//# sourceMappingURL=localized_text.js.map