import { IReaderState, ReaderStateBase, Xml2Json, XmlAttributes } from "./xml2json";
export type withPojoLambda = (name: string, pojo: any) => void;
export declare class ReaderState2 extends ReaderStateBase {
    _stack: any;
    _pojo: any;
    _element: any;
    text: string;
    _withPojo: withPojoLambda;
    private parent?;
    private engine?;
    private initLevel;
    constructor();
    _on_init(elementName: string, attrs: XmlAttributes, parent: IReaderState, level: number, engine: Xml2Json): void;
    _on_finish(): void;
    _on_startElement(level: number, elementName: string, attrs: XmlAttributes): void;
    _on_endElement2(level: number, elementName: string): void;
    _on_endElement(level: number, elementName: string): void;
    _on_text(text: string): void;
}
