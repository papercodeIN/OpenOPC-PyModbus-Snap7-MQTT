"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTsnStreamState = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |TsnStreamState                                              |
 * | isAbstract|false                                                       |
 */
var EnumTsnStreamState;
(function (EnumTsnStreamState) {
    /**
     * The related TSN Stream is currently disabled.
     */
    EnumTsnStreamState[EnumTsnStreamState["Disabled"] = 0] = "Disabled";
    /**
     * The related TSN Stream is in the process of
     * receiving configuration parameters from the TSN
     * Control Layer.
     */
    EnumTsnStreamState[EnumTsnStreamState["Configuring"] = 1] = "Configuring";
    /**
     * The related TSN Stream has successfully received
     * and applied the configuration from the TSN
     * Control Layer. The related TSN Stream is not
     * fully operational as long as local preconditions
     * (e.g. synchronization state) are not valid.
     */
    EnumTsnStreamState[EnumTsnStreamState["Ready"] = 2] = "Ready";
    /**
     * The related TSN Stream object is configured and
     * all other required preconditions (e.g.
     * synchronization state) for sending / receiving
     * data are valid.
     */
    EnumTsnStreamState[EnumTsnStreamState["Operational"] = 3] = "Operational";
    /**
     * The related TSN Stream object is in an error
     * state.
     */
    EnumTsnStreamState[EnumTsnStreamState["Error"] = 4] = "Error";
})(EnumTsnStreamState || (exports.EnumTsnStreamState = EnumTsnStreamState = {}));
//# sourceMappingURL=enum_tsn_stream_state.js.map