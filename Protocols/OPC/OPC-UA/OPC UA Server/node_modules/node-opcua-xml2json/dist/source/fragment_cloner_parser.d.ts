import { XmlAttributes } from "./xml2json";
export declare class FragmentClonerParser {
    value: any;
    private _cloneFragment?;
    private engine?;
    startElement(elementName: string, attrs: XmlAttributes): void;
    finish(): void;
}
