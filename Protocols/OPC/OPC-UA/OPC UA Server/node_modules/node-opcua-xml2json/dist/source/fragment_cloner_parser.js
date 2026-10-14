"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragmentClonerParser = void 0;
const fragment_cloner_1 = require("./fragment_cloner");
class FragmentClonerParser {
    startElement(elementName, attrs) {
        this._cloneFragment = new fragment_cloner_1.InternalFragmentClonerReaderState();
        this.engine._promote(this._cloneFragment, this.engine.currentLevel, elementName, attrs);
    }
    finish() {
        this.value = this._cloneFragment.value;
        this._cloneFragment.value = null;
    }
}
exports.FragmentClonerParser = FragmentClonerParser;
//# sourceMappingURL=fragment_cloner_parser.js.map