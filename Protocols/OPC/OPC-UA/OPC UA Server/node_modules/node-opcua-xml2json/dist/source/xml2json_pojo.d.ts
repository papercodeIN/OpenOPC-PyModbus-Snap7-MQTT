import { ReaderState, ReaderStateParser, Xml2Json, XmlAttributes } from "./xml2json";
import { withPojoLambda } from "./xml2Json_pojo_tools";
export declare const json_parser: ReaderStateParser;
export declare function startPojo(pThis: ReaderState, elementName: string, attrs: XmlAttributes, withPojo: withPojoLambda): void;
export declare class Xml2JsonPojo extends Xml2Json {
    constructor();
}
