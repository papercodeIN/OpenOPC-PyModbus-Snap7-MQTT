/**
 * ValueRank indicates whether the Value Attribute of the Variable can be an Array and how many dimensions
 *  * n > 1                     : the Value is an array with the specified number of dimensions.
 *  * OneDimension (1):           The value is an array with one dimension.
 *  * OneOrMoreDimensions (0):    The value is an array with one or more dimensions.
 *  * Scalar (-1):                The value is not an array.
 *  * Any (-2):                   The value can be a scalar or an array with any number of dimensions.
 *  * ScalarOrOneDimension (-3):  The value can be a scalar or a one dimensional array.
 */
export declare function verifyRankAndDimensions(options: {
    valueRank?: number;
    arrayDimensions?: number[] | null;
}): void;
