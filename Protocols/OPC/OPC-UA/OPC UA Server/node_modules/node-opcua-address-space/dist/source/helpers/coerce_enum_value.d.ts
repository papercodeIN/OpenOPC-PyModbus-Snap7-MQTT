import { Int64 } from "node-opcua-basic-types";
import { EnumValueType } from "node-opcua-types";
import { EnumValueTypeOptionsLike } from "../address_space_ts";
export declare function coerceEnumValues(enumValues: EnumValueTypeOptionsLike[] | {
    [key: string]: number | Int64;
}): EnumValueType[];
