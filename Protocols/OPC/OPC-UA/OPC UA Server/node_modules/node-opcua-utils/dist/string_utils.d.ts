/**
 * @module node-opcua-utils
 */
export declare function capitalizeFirstLetter(str: string): string;
export declare function isUpperCaseChar(c: string): boolean;
export declare function isAlpha(c: string): boolean;
export declare function countUpperCaseSlow(str: string): number;
export declare function countAlphaSlow(str: string): number;
export declare function countUpperCase(str: string): number;
export declare function countAlpha(str: string): number;
/**
 *
 * lowerFirstLetter convert a OPCUA Identifier to a javascript Identifier
 *
 *
 * **rational**:
 *
 *  OPCUA and Javascript use two different rules to build identifiers.
 *
 *  OPCUA Identifier usually starts with a upper case letter and word are join together, this is known as
 *  the Pascal case, or CapitalizedWords convention.  (for instance HelloWorld)
 *  But sometime, OPCUA identifiers do not follow this convention strictly and we can find various
 *  other convention being applied such as underscore between word, or addition of ACRONYMIC prefixes.
 *  On it's own, this causes great confusion and inconsistency in programming style.
 *
 *  Javascript uses a slightly different convention called camelCase where word are joined together
 *  and inner words starts with a capital letter whereas first word starts with a lower case letter.
 *  (for instance helloWorld)
 *
 *  In node-opcua we have taken the opinionated decision to consistently use camelCase convention for
 *  object properties so that all the code look nice and consistent.
 *  the lowerFirstLetter method can be used to easily convert from the OPCUA  naming convention
 *  to javascript naming convention by applying the following rules.
 *
 *   * each ascii sequence in a identifier will be converted to lower camel case.
 *   * when an identifier only contains upper case letter then it will be untouched. ( i.e CQDF => CQFD)
 *     (this rules helps to preserve acronyms)
 *   * when a identifier starts with more than one UpperCase letter but still contain lowercase letter
 *     then the first Uppercase letter excluding the last one will be converted to lower case
 *     ( ie:  EURange = > euRange)
 *   * when a identifier contains several sequences delimited with underscores (_) the above rules
 *     will be applied to each of the element of the sequence
 *     ( ie: ALM_FlowOutOfTolerance => ALM_flowOutOfTolerance ( ALM=>ALM , FlowOutOfTolerance=>flowOutOfTolerance)
 *
 * **reference**:
 *
 *    * https://en.wikipedia.org/wiki/Camel_case
 *    * https://en.wikipedia.org/wiki/Hungarian_notation
 *    * http://wiki.c2.com/?UnderscoreVersusCapitalAndLowerCaseVariableNaming
 *
 *
 *
 * @example
 *  HelloWorld => helloWorld
 *  XAxis      => xAxis
 *  EURange    => euRange
 *  DATE       => DATE
 *  XYZ        => XYZ
 *  AB         => AB
 *  Ab         => ab
 *  A          => a
 *  T1ABC8     => T1ABC8
 *  F_ABC_D    => F_ABC_D
 *  ALM_Timeout    => ALM_timeout
 *  SV_GasOn       => SV_gasOn
 *  DI_VAL_FlowImp => DI_VAL_flowImp
 */
export declare function lowerFirstLetter(str: string): string;
