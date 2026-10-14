import { Xml2Json, XmlAttributes, IReaderState } from "./xml2json";
export declare class InternalFragmentClonerReaderState implements IReaderState {
    private _xw;
    value: any;
    initLevel: number;
    engine?: Xml2Json;
    _on_startElement(level: number, elementName: string, attrs: XmlAttributes): void;
    _on_endElement(level: number, elementName: string): void;
    _on_init(elementName: string, attrs: XmlAttributes, parent: IReaderState, level: number, engine: Xml2Json): void;
    _on_finish(): void;
    _on_endElement2(level: number, elementName: string): void;
    _on_text(text: string): void;
}
