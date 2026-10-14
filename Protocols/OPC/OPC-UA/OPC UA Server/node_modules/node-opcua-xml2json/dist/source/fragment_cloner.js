"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalFragmentClonerReaderState = void 0;
const XMLWriter = require("xml-writer");
class InternalFragmentClonerReaderState {
    constructor() {
        this._xw = new XMLWriter(true);
        this.initLevel = 0;
    }
    _on_startElement(level, elementName, attrs) {
        this._xw.startElement(elementName);
        for (const [attName, attValue] of Object.entries(attrs)) {
            this._xw.writeAttribute(attName, attValue);
        }
    }
    _on_endElement(level, elementName) {
        this._xw.endElement();
        if (this.initLevel === level) {
            this.value = this._xw.toString();
            this.engine._demote(this, this.engine.currentLevel, elementName);
            this.engine = undefined;
            this._on_finish();
        }
    }
    _on_init(elementName, attrs, parent, level, engine) {
        this.engine = engine;
        this.initLevel = level;
        this._xw = new XMLWriter(true);
        this._xw.startElement(elementName);
        for (const [attName, attValue] of Object.entries(attrs)) {
            this._xw.writeAttribute(attName, attValue);
        }
    }
    _on_finish() {
        /** */
    }
    _on_endElement2(level, elementName) {
        /** */
    }
    _on_text(text) {
        this._xw.text(text);
    }
}
exports.InternalFragmentClonerReaderState = InternalFragmentClonerReaderState;
//# sourceMappingURL=fragment_cloner.js.map