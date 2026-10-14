"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderState2 = void 0;
const node_opcua_utils_1 = require("node-opcua-utils");
const xml2json_1 = require("./xml2json");
class ReaderState2 extends xml2json_1.ReaderStateBase {
    constructor() {
        super();
        this.initLevel = 0;
        this._pojo = {};
        this._stack = [];
        this._element = {};
        this.text = "";
        this.parent = undefined;
        this._withPojo = (pojo) => {
            /* empty */
        };
    }
    _on_init(elementName, attrs, parent, level, engine) {
        this.parent = parent;
        this.engine = engine;
        this.initLevel = level;
        if (this._stack.length === 0) {
            this._pojo = {};
            this._element = this._pojo;
        }
    }
    _on_finish() {
        /* empy */
    }
    _on_startElement(level, elementName, attrs) {
        this._stack.push(this._element);
        if (elementName.match(/^ListOf/)) {
            elementName = elementName.substring(6);
            const elName = (0, node_opcua_utils_1.lowerFirstLetter)(elementName);
            if (this._element instanceof Array) {
                const array = [];
                this._element.push(array);
                this._element = array;
            }
            else {
                this._element[elName] = [];
                this._element = this._element[elName];
            }
        }
        else {
            const elName = (0, node_opcua_utils_1.lowerFirstLetter)(elementName);
            if (this._element instanceof Array) {
                const obj = {};
                this._element.push(obj);
                this._element = obj;
            }
            else {
                this._element[elName] = {};
                this._element = this._element[elName];
            }
        }
    }
    _on_endElement2(level, elementName) {
        /* empty */
    }
    _on_endElement(level, elementName) {
        this._element = this._stack.pop();
        if (this.text.length > 0 && this._element) {
            const elName = (0, node_opcua_utils_1.lowerFirstLetter)(elementName);
            this._element[elName] = this.text;
            // this.engine!._pojo = this._pojo;
        }
        else {
            const elName = (0, node_opcua_utils_1.lowerFirstLetter)(elementName);
            if (this.initLevel === level) {
                if (this._withPojo) {
                    if (this.text.length) {
                        this._withPojo.call(null, elName, this.text);
                    }
                    else {
                        this._withPojo.call(null, elName, this._pojo);
                    }
                }
            }
        }
        this.text = "";
    }
    _on_text(text) {
        this.text = text;
    }
}
exports.ReaderState2 = ReaderState2;
//# sourceMappingURL=xml2Json_pojo_tools.js.map