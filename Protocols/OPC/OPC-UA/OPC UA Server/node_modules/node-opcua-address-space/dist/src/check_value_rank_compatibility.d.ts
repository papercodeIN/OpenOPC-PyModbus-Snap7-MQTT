/**
 * This valueRank indicates whether the Value attribute of the Variable is an array and how many dimensions the array has.
 * It may have the following values:
 *   * n > 1: the Value is an array with the specified number of dimensions.
 *   * OneDimension (1): The value is an array with one dimension.
 *   * OneOrMoreDimensions (0): The value is an array with one or more dimensions.
 *   * Scalar (−1): The value is not an array.
 *   * Any (−2): The value can be a scalar or an array with any number of dimensions.
 *   * ScalarOrOneDimension (−3): The value can be a scalar or a one dimensional array.
 *   * All DataTypes are considered to be scalar, even if they have array-like semantics like ByteString and String.
 */
export declare function checkValueRankCompatibility(actualValueRank: number, baseTypeValueRank: number): {
    result: boolean;
    errorMessage?: string;
};
