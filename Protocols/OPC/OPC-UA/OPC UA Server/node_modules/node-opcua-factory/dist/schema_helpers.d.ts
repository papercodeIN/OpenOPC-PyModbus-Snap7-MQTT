import { DataTypeFactory } from "./datatype_factory";
import { FieldType, IStructuredTypeSchema, StructuredTypeField } from "./types";
/**
 * ensure correctness of a schema object.
 *

 * @param schema
 *
 */
export declare function check_schema_correctness(schema: IStructuredTypeSchema): void;
/**

 * @param value
 * @param defaultValue
 * @return {*}
 */
export declare function initialize_field(field: StructuredTypeField, value: unknown, factory?: DataTypeFactory): any;
/**

 * @param field
 * @param valueArray
 * @return
 */
export declare function initialize_field_array(field: FieldType, valueArray: any, factory?: DataTypeFactory): any;
