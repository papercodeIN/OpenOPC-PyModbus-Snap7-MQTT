"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumNamingRule = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |NamingRuleType                                              |
 * | isAbstract|false                                                       |
 */
var EnumNamingRule;
(function (EnumNamingRule) {
    /**
     * The BrowseName must appear in all instances of
     * the type.
     */
    EnumNamingRule[EnumNamingRule["Mandatory"] = 1] = "Mandatory";
    /**
     * The BrowseName may appear in an instance of the
     * type.
     */
    EnumNamingRule[EnumNamingRule["Optional"] = 2] = "Optional";
    /**
     * The modelling rule defines a constraint and the
     * BrowseName is not used in an instance of the type.
     */
    EnumNamingRule[EnumNamingRule["Constraint"] = 3] = "Constraint";
})(EnumNamingRule || (exports.EnumNamingRule = EnumNamingRule = {}));
//# sourceMappingURL=enum_naming_rule.js.map