/**
 * @module node-opcua-types
 */
import { Byte, ByteString, DateTime, Double, Float, Guid, Int16, Int32, Int64, SByte, UABoolean, UAString, UInt16, UInt32 } from "node-opcua-basic-types";
import { Enum } from "node-opcua-enum";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BrowseDirection, DiagnosticInfo, LocalizedText, LocalizedTextLike, QualifiedName, QualifiedNameLike } from "node-opcua-data-model";
import { DataValue, DataValueLike, TimestampsToReturn } from "node-opcua-data-value";
import { ExtensionObject } from "node-opcua-extension-object";
import { IStructuredTypeSchema } from "node-opcua-factory";
import { ExpandedNodeId, NodeId, NodeIdLike } from "node-opcua-nodeid";
import { NumericRange } from "node-opcua-numeric-range";
import { StatusCode } from "node-opcua-status-code";
import { Variant, VariantLike } from "node-opcua-variant";
export interface EUInformationOptions {
    namespaceUri?: UAString;
    unitId?: Int32;
    displayName?: (LocalizedTextLike | null);
    description?: (LocalizedTextLike | null);
}
export declare class EUInformation extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    namespaceUri: UAString;
    unitId: Int32;
    displayName: LocalizedText;
    description: LocalizedText;
    constructor(options?: EUInformationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RangeOptions {
    low?: Double;
    high?: Double;
}
export declare class Range extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    low: Double;
    high: Double;
    constructor(options?: RangeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum AxisScaleEnumeration {
    Linear = 0,
    Log = 1,
    Ln = 2,
    Invalid = 4294967295
}
export declare const _enumerationAxisScaleEnumeration: Enum;
export interface AxisInformationOptions {
    engineeringUnits?: EUInformationOptions;
    euRange?: RangeOptions;
    title?: (LocalizedTextLike | null);
    axisScaleType?: AxisScaleEnumeration;
    axisSteps?: Double[] | null;
}
export declare class AxisInformation extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    engineeringUnits: EUInformation;
    euRange: Range;
    title: LocalizedText;
    axisScaleType: AxisScaleEnumeration;
    axisSteps: Double[] | null;
    constructor(options?: AxisInformationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setAxisScaleType(value: any): AxisScaleEnumeration;
    get schema(): IStructuredTypeSchema;
}
export interface FilterOperandOptions {
}
export declare class FilterOperand extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: FilterOperandOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SimpleAttributeOperandOptions extends FilterOperandOptions {
    typeDefinitionId?: (NodeIdLike | null);
    browsePath?: (QualifiedNameLike | null)[] | null;
    attributeId?: UInt32;
    indexRange?: NumericRange;
}
export declare class SimpleAttributeOperand extends FilterOperand {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    typeDefinitionId: NodeId;
    browsePath: QualifiedName[] | null;
    attributeId: UInt32;
    indexRange: NumericRange;
    constructor(options?: SimpleAttributeOperandOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ActionMethodDataTypeOptions {
    objectId?: (NodeIdLike | null);
    methodId?: (NodeIdLike | null);
}
export declare class ActionMethodDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    objectId: NodeId;
    methodId: NodeId;
    constructor(options?: ActionMethodDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ActionTargetDataTypeOptions {
    actionTargetId?: UInt16;
    name?: UAString;
    description?: (LocalizedTextLike | null);
}
export declare class ActionTargetDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    actionTargetId: UInt16;
    name: UAString;
    description: LocalizedText;
    constructor(options?: ActionTargetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RequestHeaderOptions {
    authenticationToken?: (NodeIdLike | null);
    timestamp?: DateTime;
    requestHandle?: UInt32;
    returnDiagnostics?: UInt32;
    auditEntryId?: UAString;
    timeoutHint?: UInt32;
    additionalHeader?: (ExtensionObject | null);
}
export declare class RequestHeader extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    authenticationToken: NodeId;
    timestamp: DateTime;
    requestHandle: UInt32;
    returnDiagnostics: UInt32;
    auditEntryId: UAString;
    timeoutHint: UInt32;
    additionalHeader: (ExtensionObject | null);
    constructor(options?: RequestHeaderOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SignatureDataOptions {
    algorithm?: UAString;
    signature?: ByteString;
}
export declare class SignatureData extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    algorithm: UAString;
    signature: ByteString;
    constructor(options?: SignatureDataOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SignedSoftwareCertificateOptions {
    certificateData?: ByteString;
    signature?: ByteString;
}
export declare class SignedSoftwareCertificate extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    certificateData: ByteString;
    signature: ByteString;
    constructor(options?: SignedSoftwareCertificateOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ActivateSessionRequestOptions {
    requestHeader?: RequestHeaderOptions;
    clientSignature?: SignatureDataOptions;
    clientSoftwareCertificates?: SignedSoftwareCertificateOptions[] | null;
    localeIds?: UAString[] | null;
    userIdentityToken?: (ExtensionObject | null);
    userTokenSignature?: SignatureDataOptions;
}
export declare class ActivateSessionRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    clientSignature: SignatureData;
    clientSoftwareCertificates: SignedSoftwareCertificate[] | null;
    localeIds: UAString[] | null;
    userIdentityToken: (ExtensionObject | null);
    userTokenSignature: SignatureData;
    constructor(options?: ActivateSessionRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ResponseHeaderOptions {
    timestamp?: DateTime;
    requestHandle?: UInt32;
    serviceResult?: StatusCode;
    serviceDiagnostics?: (DiagnosticInfo | null);
    stringTable?: UAString[] | null;
    additionalHeader?: (ExtensionObject | null);
}
export declare class ResponseHeader extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    timestamp: DateTime;
    requestHandle: UInt32;
    serviceResult: StatusCode;
    serviceDiagnostics: (DiagnosticInfo | null);
    stringTable: UAString[] | null;
    additionalHeader: (ExtensionObject | null);
    constructor(options?: ResponseHeaderOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ActivateSessionResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    serverNonce?: ByteString;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ActivateSessionResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    serverNonce: ByteString;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ActivateSessionResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum NodeClass {
    Unspecified = 0,
    Object = 1,
    Variable = 2,
    Method = 4,
    ObjectType = 8,
    VariableType = 16,
    ReferenceType = 32,
    DataType = 64,
    View = 128
}
export declare const _enumerationNodeClass: Enum;
export interface AddNodesItemOptions {
    parentNodeId?: ExpandedNodeId;
    referenceTypeId?: (NodeIdLike | null);
    requestedNewNodeId?: ExpandedNodeId;
    browseName?: (QualifiedNameLike | null);
    nodeClass?: NodeClass;
    nodeAttributes?: (ExtensionObject | null);
    typeDefinition?: ExpandedNodeId;
}
export declare class AddNodesItem extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    parentNodeId: ExpandedNodeId;
    referenceTypeId: NodeId;
    requestedNewNodeId: ExpandedNodeId;
    browseName: QualifiedName;
    nodeClass: NodeClass;
    nodeAttributes: (ExtensionObject | null);
    typeDefinition: ExpandedNodeId;
    constructor(options?: AddNodesItemOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setNodeClass(value: any): NodeClass;
    get schema(): IStructuredTypeSchema;
}
export interface AddNodesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    nodesToAdd?: AddNodesItemOptions[] | null;
}
export declare class AddNodesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    nodesToAdd: AddNodesItem[] | null;
    constructor(options?: AddNodesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AddNodesResultOptions {
    statusCode?: StatusCode;
    addedNodeId?: (NodeIdLike | null);
}
export declare class AddNodesResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    addedNodeId: NodeId;
    constructor(options?: AddNodesResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AddNodesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: AddNodesResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class AddNodesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: AddNodesResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: AddNodesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AddReferencesItemOptions {
    sourceNodeId?: (NodeIdLike | null);
    referenceTypeId?: (NodeIdLike | null);
    isForward?: UABoolean;
    targetServerUri?: UAString;
    targetNodeId?: ExpandedNodeId;
    targetNodeClass?: NodeClass;
}
export declare class AddReferencesItem extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sourceNodeId: NodeId;
    referenceTypeId: NodeId;
    isForward: UABoolean;
    targetServerUri: UAString;
    targetNodeId: ExpandedNodeId;
    targetNodeClass: NodeClass;
    constructor(options?: AddReferencesItemOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTargetNodeClass(value: any): NodeClass;
    get schema(): IStructuredTypeSchema;
}
export interface AddReferencesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    referencesToAdd?: AddReferencesItemOptions[] | null;
}
export declare class AddReferencesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    referencesToAdd: AddReferencesItem[] | null;
    constructor(options?: AddReferencesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AddReferencesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class AddReferencesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: AddReferencesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface KeyValuePairOptions {
    key?: (QualifiedNameLike | null);
    value?: (VariantLike | null);
}
export declare class KeyValuePair extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    key: QualifiedName;
    value: Variant;
    constructor(options?: KeyValuePairOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AdditionalParametersTypeOptions {
    parameters?: KeyValuePairOptions[] | null;
}
export declare class AdditionalParametersType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    parameters: KeyValuePair[] | null;
    constructor(options?: AdditionalParametersTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AggregateConfigurationOptions {
    useServerCapabilitiesDefaults?: UABoolean;
    treatUncertainAsBad?: UABoolean;
    percentDataBad?: Byte;
    percentDataGood?: Byte;
    useSlopedExtrapolation?: UABoolean;
}
export declare class AggregateConfiguration extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    useServerCapabilitiesDefaults: UABoolean;
    treatUncertainAsBad: UABoolean;
    percentDataBad: Byte;
    percentDataGood: Byte;
    useSlopedExtrapolation: UABoolean;
    constructor(options?: AggregateConfigurationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoringFilterOptions {
}
export declare class MonitoringFilter extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: MonitoringFilterOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AggregateFilterOptions extends MonitoringFilterOptions {
    startTime?: DateTime;
    aggregateType?: (NodeIdLike | null);
    processingInterval?: Double;
    aggregateConfiguration?: AggregateConfigurationOptions;
}
export declare class AggregateFilter extends MonitoringFilter {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    startTime: DateTime;
    aggregateType: NodeId;
    processingInterval: Double;
    aggregateConfiguration: AggregateConfiguration;
    constructor(options?: AggregateFilterOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoringFilterResultOptions {
}
export declare class MonitoringFilterResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: MonitoringFilterResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AggregateFilterResultOptions extends MonitoringFilterResultOptions {
    revisedStartTime?: DateTime;
    revisedProcessingInterval?: Double;
    revisedAggregateConfiguration?: AggregateConfigurationOptions;
}
export declare class AggregateFilterResult extends MonitoringFilterResult {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    revisedStartTime: DateTime;
    revisedProcessingInterval: Double;
    revisedAggregateConfiguration: AggregateConfiguration;
    constructor(options?: AggregateFilterResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AliasNameDataTypeOptions {
    aliasName?: (QualifiedNameLike | null);
    referencedNodes?: ExpandedNodeId[] | null;
}
export declare class AliasNameDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    aliasName: QualifiedName;
    referencedNodes: ExpandedNodeId[] | null;
    constructor(options?: AliasNameDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AnnotationOptions {
    message?: UAString;
    userName?: UAString;
    annotationTime?: DateTime;
}
export declare class Annotation extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    message: UAString;
    userName: UAString;
    annotationTime: DateTime;
    constructor(options?: AnnotationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AnnotationDataTypeOptions {
    annotation?: UAString;
    discipline?: UAString;
    uri?: UAString;
}
export declare class AnnotationDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    annotation: UAString;
    discipline: UAString;
    uri: UAString;
    constructor(options?: AnnotationDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface UserIdentityTokenOptions {
    policyId?: UAString;
}
export declare class UserIdentityToken extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    policyId: UAString;
    constructor(options?: UserIdentityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AnonymousIdentityTokenOptions extends UserIdentityTokenOptions {
}
export declare class AnonymousIdentityToken extends UserIdentityToken {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: AnonymousIdentityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum ApplicationType {
    Server = 0,
    Client = 1,
    ClientAndServer = 2,
    DiscoveryServer = 3,
    Invalid = 4294967295
}
export declare const _enumerationApplicationType: Enum;
export interface ApplicationDescriptionOptions {
    applicationUri?: UAString;
    productUri?: UAString;
    applicationName?: (LocalizedTextLike | null);
    applicationType?: ApplicationType;
    gatewayServerUri?: UAString;
    discoveryProfileUri?: UAString;
    discoveryUrls?: UAString[] | null;
}
export declare class ApplicationDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    applicationUri: UAString;
    productUri: UAString;
    applicationName: LocalizedText;
    applicationType: ApplicationType;
    gatewayServerUri: UAString;
    discoveryProfileUri: UAString;
    discoveryUrls: UAString[] | null;
    constructor(options?: ApplicationDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setApplicationType(value: any): ApplicationType;
    get schema(): IStructuredTypeSchema;
}
export interface ArgumentOptions {
    name?: UAString;
    dataType?: (NodeIdLike | null);
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    description?: (LocalizedTextLike | null);
}
export declare class Argument extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[] | null;
    description: LocalizedText;
    constructor(options?: ArgumentOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RelativePathElementOptions {
    referenceTypeId?: (NodeIdLike | null);
    isInverse?: UABoolean;
    includeSubtypes?: UABoolean;
    targetName?: (QualifiedNameLike | null);
}
export declare class RelativePathElement extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    referenceTypeId: NodeId;
    isInverse: UABoolean;
    includeSubtypes: UABoolean;
    targetName: QualifiedName;
    constructor(options?: RelativePathElementOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RelativePathOptions {
    elements?: RelativePathElementOptions[] | null;
}
export declare class RelativePath extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    elements: RelativePathElement[] | null;
    constructor(options?: RelativePathOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface AttributeOperandOptions extends FilterOperandOptions {
    nodeId?: (NodeIdLike | null);
    alias?: UAString;
    browsePath?: RelativePathOptions;
    attributeId?: UInt32;
    indexRange?: NumericRange;
}
export declare class AttributeOperand extends FilterOperand {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    alias: UAString;
    browsePath: RelativePath;
    attributeId: UInt32;
    indexRange: NumericRange;
    constructor(options?: AttributeOperandOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BitFieldDefinitionOptions {
    name?: UAString;
    description?: (LocalizedTextLike | null);
    reserved?: UABoolean;
    startingBitPosition?: UInt32;
    endingBitPosition?: UInt32;
}
export declare class BitFieldDefinition extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    description: LocalizedText;
    reserved: UABoolean;
    startingBitPosition: UInt32;
    endingBitPosition: UInt32;
    constructor(options?: BitFieldDefinitionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ConnectionTransportDataTypeOptions {
}
export declare class ConnectionTransportDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: ConnectionTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrokerConnectionTransportDataTypeOptions extends ConnectionTransportDataTypeOptions {
    resourceUri?: UAString;
    authenticationProfileUri?: UAString;
}
export declare class BrokerConnectionTransportDataType extends ConnectionTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    constructor(options?: BrokerConnectionTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetReaderTransportDataTypeOptions {
}
export declare class DataSetReaderTransportDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DataSetReaderTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum BrokerTransportQualityOfService {
    NotSpecified = 0,
    BestEffort = 1,
    AtLeastOnce = 2,
    AtMostOnce = 3,
    ExactlyOnce = 4,
    Invalid = 4294967295
}
export declare const _enumerationBrokerTransportQualityOfService: Enum;
export interface BrokerDataSetReaderTransportDataTypeOptions extends DataSetReaderTransportDataTypeOptions {
    queueName?: UAString;
    resourceUri?: UAString;
    authenticationProfileUri?: UAString;
    requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
    metaDataQueueName?: UAString;
}
export declare class BrokerDataSetReaderTransportDataType extends DataSetReaderTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: BrokerTransportQualityOfService;
    metaDataQueueName: UAString;
    constructor(options?: BrokerDataSetReaderTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setRequestedDeliveryGuarantee(value: any): BrokerTransportQualityOfService;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetWriterTransportDataTypeOptions {
}
export declare class DataSetWriterTransportDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DataSetWriterTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrokerDataSetWriterTransportDataTypeOptions extends DataSetWriterTransportDataTypeOptions {
    queueName?: UAString;
    resourceUri?: UAString;
    authenticationProfileUri?: UAString;
    requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
    metaDataQueueName?: UAString;
    metaDataUpdateTime?: Double;
}
export declare class BrokerDataSetWriterTransportDataType extends DataSetWriterTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: BrokerTransportQualityOfService;
    metaDataQueueName: UAString;
    metaDataUpdateTime: Double;
    constructor(options?: BrokerDataSetWriterTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setRequestedDeliveryGuarantee(value: any): BrokerTransportQualityOfService;
    get schema(): IStructuredTypeSchema;
}
export interface WriterGroupTransportDataTypeOptions {
}
export declare class WriterGroupTransportDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: WriterGroupTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrokerWriterGroupTransportDataTypeOptions extends WriterGroupTransportDataTypeOptions {
    queueName?: UAString;
    resourceUri?: UAString;
    authenticationProfileUri?: UAString;
    requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
}
export declare class BrokerWriterGroupTransportDataType extends WriterGroupTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: BrokerTransportQualityOfService;
    constructor(options?: BrokerWriterGroupTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setRequestedDeliveryGuarantee(value: any): BrokerTransportQualityOfService;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseDescriptionOptions {
    nodeId?: (NodeIdLike | null);
    browseDirection?: BrowseDirection;
    referenceTypeId?: (NodeIdLike | null);
    includeSubtypes?: UABoolean;
    nodeClassMask?: UInt32;
    resultMask?: UInt32;
}
export declare class BrowseDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    browseDirection: BrowseDirection;
    referenceTypeId: NodeId;
    includeSubtypes: UABoolean;
    nodeClassMask: UInt32;
    resultMask: UInt32;
    constructor(options?: BrowseDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setBrowseDirection(value: any): BrowseDirection;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseNextRequestOptions {
    requestHeader?: RequestHeaderOptions;
    releaseContinuationPoints?: UABoolean;
    continuationPoints?: ByteString[] | null;
}
export declare class BrowseNextRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    releaseContinuationPoints: UABoolean;
    continuationPoints: ByteString[] | null;
    constructor(options?: BrowseNextRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReferenceDescriptionOptions {
    referenceTypeId?: (NodeIdLike | null);
    isForward?: UABoolean;
    nodeId?: ExpandedNodeId;
    browseName?: (QualifiedNameLike | null);
    displayName?: (LocalizedTextLike | null);
    nodeClass?: NodeClass;
    typeDefinition?: ExpandedNodeId;
}
export declare class ReferenceDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    referenceTypeId: NodeId;
    isForward: UABoolean;
    nodeId: ExpandedNodeId;
    browseName: QualifiedName;
    displayName: LocalizedText;
    nodeClass: NodeClass;
    typeDefinition: ExpandedNodeId;
    constructor(options?: ReferenceDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setNodeClass(value: any): NodeClass;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseResultOptions {
    statusCode?: StatusCode;
    continuationPoint?: ByteString;
    references?: ReferenceDescriptionOptions[] | null;
}
export declare class BrowseResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    continuationPoint: ByteString;
    references: ReferenceDescription[] | null;
    constructor(options?: BrowseResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseNextResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: BrowseResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class BrowseNextResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: BrowseResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: BrowseNextResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowsePathOptions {
    startingNode?: (NodeIdLike | null);
    relativePath?: RelativePathOptions;
}
export declare class BrowsePath extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    startingNode: NodeId;
    relativePath: RelativePath;
    constructor(options?: BrowsePathOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowsePathTargetOptions {
    targetId?: ExpandedNodeId;
    remainingPathIndex?: UInt32;
}
export declare class BrowsePathTarget extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    targetId: ExpandedNodeId;
    remainingPathIndex: UInt32;
    constructor(options?: BrowsePathTargetOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowsePathResultOptions {
    statusCode?: StatusCode;
    targets?: BrowsePathTargetOptions[] | null;
}
export declare class BrowsePathResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    targets: BrowsePathTarget[] | null;
    constructor(options?: BrowsePathResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ViewDescriptionOptions {
    viewId?: (NodeIdLike | null);
    timestamp?: DateTime;
    viewVersion?: UInt32;
}
export declare class ViewDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    viewId: NodeId;
    timestamp: DateTime;
    viewVersion: UInt32;
    constructor(options?: ViewDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseRequestOptions {
    requestHeader?: RequestHeaderOptions;
    view?: ViewDescriptionOptions;
    requestedMaxReferencesPerNode?: UInt32;
    nodesToBrowse?: BrowseDescriptionOptions[] | null;
}
export declare class BrowseRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    view: ViewDescription;
    requestedMaxReferencesPerNode: UInt32;
    nodesToBrowse: BrowseDescription[] | null;
    constructor(options?: BrowseRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BrowseResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: BrowseResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class BrowseResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: BrowseResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: BrowseResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface BuildInfoOptions {
    productUri?: UAString;
    manufacturerName?: UAString;
    productName?: UAString;
    softwareVersion?: UAString;
    buildNumber?: UAString;
    buildDate?: DateTime;
}
export declare class BuildInfo extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    productUri: UAString;
    manufacturerName: UAString;
    productName: UAString;
    softwareVersion: UAString;
    buildNumber: UAString;
    buildDate: DateTime;
    constructor(options?: BuildInfoOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CallMethodRequestOptions {
    objectId?: (NodeIdLike | null);
    methodId?: (NodeIdLike | null);
    inputArguments?: (VariantLike | null)[] | null;
}
export declare class CallMethodRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    objectId: NodeId;
    methodId: NodeId;
    inputArguments: Variant[] | null;
    constructor(options?: CallMethodRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CallMethodResultOptions {
    statusCode?: StatusCode;
    inputArgumentResults?: StatusCode[] | null;
    inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
    outputArguments?: (VariantLike | null)[] | null;
}
export declare class CallMethodResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    inputArgumentResults: StatusCode[] | null;
    inputArgumentDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    outputArguments: Variant[] | null;
    constructor(options?: CallMethodResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CallRequestOptions {
    requestHeader?: RequestHeaderOptions;
    methodsToCall?: CallMethodRequestOptions[] | null;
}
export declare class CallRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    methodsToCall: CallMethodRequest[] | null;
    constructor(options?: CallRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CallResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: CallMethodResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class CallResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: CallMethodResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: CallResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CancelRequestOptions {
    requestHeader?: RequestHeaderOptions;
    requestHandle?: UInt32;
}
export declare class CancelRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    requestHandle: UInt32;
    constructor(options?: CancelRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CancelResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    cancelCount?: UInt32;
}
export declare class CancelResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    cancelCount: UInt32;
    constructor(options?: CancelResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CartesianCoordinatesOptions {
}
export declare class CartesianCoordinates extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: CartesianCoordinatesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ChannelSecurityTokenOptions {
    channelId?: UInt32;
    tokenId?: UInt32;
    createdAt?: DateTime;
    revisedLifetime?: UInt32;
}
export declare class ChannelSecurityToken extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    channelId: UInt32;
    tokenId: UInt32;
    createdAt: DateTime;
    revisedLifetime: UInt32;
    constructor(options?: ChannelSecurityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CloseSecureChannelRequestOptions {
    requestHeader?: RequestHeaderOptions;
}
export declare class CloseSecureChannelRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    constructor(options?: CloseSecureChannelRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CloseSecureChannelResponseOptions {
    responseHeader?: ResponseHeaderOptions;
}
export declare class CloseSecureChannelResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    constructor(options?: CloseSecureChannelResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CloseSessionRequestOptions {
    requestHeader?: RequestHeaderOptions;
    deleteSubscriptions?: UABoolean;
}
export declare class CloseSessionRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    deleteSubscriptions: UABoolean;
    constructor(options?: CloseSessionRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CloseSessionResponseOptions {
    responseHeader?: ResponseHeaderOptions;
}
export declare class CloseSessionResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    constructor(options?: CloseSessionResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ComplexNumberTypeOptions {
    real?: Float;
    imaginary?: Float;
}
export declare class ComplexNumberType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    real: Float;
    imaginary: Float;
    constructor(options?: ComplexNumberTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ConfigurationVersionDataTypeOptions {
    majorVersion?: UInt32;
    minorVersion?: UInt32;
}
export declare class ConfigurationVersionDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    majorVersion: UInt32;
    minorVersion: UInt32;
    constructor(options?: ConfigurationVersionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum FilterOperator {
    Equals = 0,
    IsNull = 1,
    GreaterThan = 2,
    LessThan = 3,
    GreaterThanOrEqual = 4,
    LessThanOrEqual = 5,
    Like = 6,
    Not = 7,
    Between = 8,
    InList = 9,
    And = 10,
    Or = 11,
    Cast = 12,
    InView = 13,
    OfType = 14,
    RelatedTo = 15,
    BitwiseAnd = 16,
    BitwiseOr = 17,
    Invalid = 4294967295
}
export declare const _enumerationFilterOperator: Enum;
export interface ContentFilterElementOptions {
    filterOperator?: FilterOperator;
    filterOperands?: (ExtensionObject | null)[] | null;
}
export declare class ContentFilterElement extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    filterOperator: FilterOperator;
    filterOperands: (ExtensionObject | null)[] | null;
    constructor(options?: ContentFilterElementOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setFilterOperator(value: any): FilterOperator;
    get schema(): IStructuredTypeSchema;
}
export interface ContentFilterOptions {
    elements?: ContentFilterElementOptions[] | null;
}
export declare class ContentFilter extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    elements: ContentFilterElement[] | null;
    constructor(options?: ContentFilterOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ContentFilterElementResultOptions {
    statusCode?: StatusCode;
    operandStatusCodes?: StatusCode[] | null;
    operandDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ContentFilterElementResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    operandStatusCodes: StatusCode[] | null;
    operandDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ContentFilterElementResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ContentFilterResultOptions {
    elementResults?: ContentFilterElementResultOptions[] | null;
    elementDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ContentFilterResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    elementResults: ContentFilterElementResult[] | null;
    elementDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ContentFilterResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadValueIdOptions {
    nodeId?: (NodeIdLike | null);
    attributeId?: UInt32;
    indexRange?: NumericRange;
    dataEncoding?: (QualifiedNameLike | null);
}
export declare class ReadValueId extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    attributeId: UInt32;
    indexRange: NumericRange;
    dataEncoding: QualifiedName;
    constructor(options?: ReadValueIdOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum MonitoringMode {
    Disabled = 0,
    Sampling = 1,
    Reporting = 2,
    Invalid = 4294967295
}
export declare const _enumerationMonitoringMode: Enum;
export interface MonitoringParametersOptions {
    clientHandle?: UInt32;
    samplingInterval?: Double;
    filter?: (ExtensionObject | null);
    queueSize?: UInt32;
    discardOldest?: UABoolean;
}
export declare class MonitoringParameters extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    clientHandle: UInt32;
    samplingInterval: Double;
    filter: (ExtensionObject | null);
    queueSize: UInt32;
    discardOldest: UABoolean;
    constructor(options?: MonitoringParametersOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoredItemCreateRequestOptions {
    itemToMonitor?: ReadValueIdOptions;
    monitoringMode?: MonitoringMode;
    requestedParameters?: MonitoringParametersOptions;
}
export declare class MonitoredItemCreateRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    itemToMonitor: ReadValueId;
    monitoringMode: MonitoringMode;
    requestedParameters: MonitoringParameters;
    constructor(options?: MonitoredItemCreateRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setMonitoringMode(value: any): MonitoringMode;
    get schema(): IStructuredTypeSchema;
}
export interface CreateMonitoredItemsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    timestampsToReturn?: TimestampsToReturn;
    itemsToCreate?: MonitoredItemCreateRequestOptions[] | null;
}
export declare class CreateMonitoredItemsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    timestampsToReturn: TimestampsToReturn;
    itemsToCreate: MonitoredItemCreateRequest[] | null;
    constructor(options?: CreateMonitoredItemsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTimestampsToReturn(value: any): TimestampsToReturn;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoredItemCreateResultOptions {
    statusCode?: StatusCode;
    monitoredItemId?: UInt32;
    revisedSamplingInterval?: Double;
    revisedQueueSize?: UInt32;
    filterResult?: (ExtensionObject | null);
}
export declare class MonitoredItemCreateResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    monitoredItemId: UInt32;
    revisedSamplingInterval: Double;
    revisedQueueSize: UInt32;
    filterResult: (ExtensionObject | null);
    constructor(options?: MonitoredItemCreateResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CreateMonitoredItemsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: MonitoredItemCreateResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class CreateMonitoredItemsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: MonitoredItemCreateResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: CreateMonitoredItemsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CreateSessionRequestOptions {
    requestHeader?: RequestHeaderOptions;
    clientDescription?: ApplicationDescriptionOptions;
    serverUri?: UAString;
    endpointUrl?: UAString;
    sessionName?: UAString;
    clientNonce?: ByteString;
    clientCertificate?: ByteString;
    requestedSessionTimeout?: Double;
    maxResponseMessageSize?: UInt32;
}
export declare class CreateSessionRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    clientDescription: ApplicationDescription;
    serverUri: UAString;
    endpointUrl: UAString;
    sessionName: UAString;
    clientNonce: ByteString;
    clientCertificate: ByteString;
    requestedSessionTimeout: Double;
    maxResponseMessageSize: UInt32;
    constructor(options?: CreateSessionRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum MessageSecurityMode {
    Invalid = 0,
    None = 1,
    Sign = 2,
    SignAndEncrypt = 3
}
export declare const _enumerationMessageSecurityMode: Enum;
export declare enum UserTokenType {
    Anonymous = 0,
    UserName = 1,
    Certificate = 2,
    IssuedToken = 3,
    Invalid = 4294967295
}
export declare const _enumerationUserTokenType: Enum;
export interface UserTokenPolicyOptions {
    policyId?: UAString;
    tokenType?: UserTokenType;
    issuedTokenType?: UAString;
    issuerEndpointUrl?: UAString;
    securityPolicyUri?: UAString;
}
export declare class UserTokenPolicy extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    policyId: UAString;
    tokenType: UserTokenType;
    issuedTokenType: UAString;
    issuerEndpointUrl: UAString;
    securityPolicyUri: UAString;
    constructor(options?: UserTokenPolicyOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTokenType(value: any): UserTokenType;
    get schema(): IStructuredTypeSchema;
}
export interface EndpointDescriptionOptions {
    endpointUrl?: UAString;
    server?: ApplicationDescriptionOptions;
    serverCertificate?: ByteString;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: UAString;
    userIdentityTokens?: UserTokenPolicyOptions[] | null;
    transportProfileUri?: UAString;
    securityLevel?: Byte;
}
export declare class EndpointDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    endpointUrl: UAString;
    server: ApplicationDescription;
    serverCertificate: ByteString;
    securityMode: MessageSecurityMode;
    securityPolicyUri: UAString;
    userIdentityTokens: UserTokenPolicy[] | null;
    transportProfileUri: UAString;
    securityLevel: Byte;
    constructor(options?: EndpointDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface CreateSessionResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    sessionId?: (NodeIdLike | null);
    authenticationToken?: (NodeIdLike | null);
    revisedSessionTimeout?: Double;
    serverNonce?: ByteString;
    serverCertificate?: ByteString;
    serverEndpoints?: EndpointDescriptionOptions[] | null;
    serverSoftwareCertificates?: SignedSoftwareCertificateOptions[] | null;
    serverSignature?: SignatureDataOptions;
    maxRequestMessageSize?: UInt32;
}
export declare class CreateSessionResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    sessionId: NodeId;
    authenticationToken: NodeId;
    revisedSessionTimeout: Double;
    serverNonce: ByteString;
    serverCertificate: ByteString;
    serverEndpoints: EndpointDescription[] | null;
    serverSoftwareCertificates: SignedSoftwareCertificate[] | null;
    serverSignature: SignatureData;
    maxRequestMessageSize: UInt32;
    constructor(options?: CreateSessionResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CreateSubscriptionRequestOptions {
    requestHeader?: RequestHeaderOptions;
    requestedPublishingInterval?: Double;
    requestedLifetimeCount?: UInt32;
    requestedMaxKeepAliveCount?: UInt32;
    maxNotificationsPerPublish?: UInt32;
    publishingEnabled?: UABoolean;
    priority?: Byte;
}
export declare class CreateSubscriptionRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    requestedPublishingInterval: Double;
    requestedLifetimeCount: UInt32;
    requestedMaxKeepAliveCount: UInt32;
    maxNotificationsPerPublish: UInt32;
    publishingEnabled: UABoolean;
    priority: Byte;
    constructor(options?: CreateSubscriptionRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CreateSubscriptionResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    subscriptionId?: UInt32;
    revisedPublishingInterval?: Double;
    revisedLifetimeCount?: UInt32;
    revisedMaxKeepAliveCount?: UInt32;
}
export declare class CreateSubscriptionResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    subscriptionId: UInt32;
    revisedPublishingInterval: Double;
    revisedLifetimeCount: UInt32;
    revisedMaxKeepAliveCount: UInt32;
    constructor(options?: CreateSubscriptionResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface CurrencyUnitTypeOptions {
    numericCode?: Int16;
    exponent?: SByte;
    alphabeticCode?: UAString;
    currency?: (LocalizedTextLike | null);
}
export declare class CurrencyUnitType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    numericCode: Int16;
    exponent: SByte;
    alphabeticCode: UAString;
    currency: LocalizedText;
    constructor(options?: CurrencyUnitTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum DataChangeTrigger {
    Status = 0,
    StatusValue = 1,
    StatusValueTimestamp = 2,
    Invalid = 4294967295
}
export declare const _enumerationDataChangeTrigger: Enum;
export interface DataChangeFilterOptions extends MonitoringFilterOptions {
    trigger?: DataChangeTrigger;
    deadbandType?: UInt32;
    deadbandValue?: Double;
}
export declare class DataChangeFilter extends MonitoringFilter {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    trigger: DataChangeTrigger;
    deadbandType: UInt32;
    deadbandValue: Double;
    constructor(options?: DataChangeFilterOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTrigger(value: any): DataChangeTrigger;
    get schema(): IStructuredTypeSchema;
}
export interface NotificationDataOptions {
}
export declare class NotificationData extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: NotificationDataOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoredItemNotificationOptions {
    clientHandle?: UInt32;
    value?: (DataValueLike | null);
}
export declare class MonitoredItemNotification extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    clientHandle: UInt32;
    value: DataValue;
    constructor(options?: MonitoredItemNotificationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataChangeNotificationOptions extends NotificationDataOptions {
    monitoredItems?: MonitoredItemNotificationOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class DataChangeNotification extends NotificationData {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    monitoredItems: MonitoredItemNotification[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: DataChangeNotificationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataTypeDescriptionOptions {
    dataTypeId?: (NodeIdLike | null);
    name?: (QualifiedNameLike | null);
}
export declare class DataTypeDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataTypeId: NodeId;
    name: QualifiedName;
    constructor(options?: DataTypeDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataTypeDefinitionOptions {
}
export declare class DataTypeDefinition extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DataTypeDefinitionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum StructureType {
    Structure = 0,
    StructureWithOptionalFields = 1,
    Union = 2,
    StructureWithSubtypedValues = 3,
    UnionWithSubtypedValues = 4,
    Invalid = 4294967295
}
export declare const _enumerationStructureType: Enum;
export interface StructureFieldOptions {
    name?: UAString;
    description?: (LocalizedTextLike | null);
    dataType?: (NodeIdLike | null);
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    maxStringLength?: UInt32;
    isOptional?: UABoolean;
}
export declare class StructureField extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    description: LocalizedText;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[] | null;
    maxStringLength: UInt32;
    isOptional: UABoolean;
    constructor(options?: StructureFieldOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface StructureDefinitionOptions {
    defaultEncodingId?: (NodeIdLike | null);
    baseDataType?: (NodeIdLike | null);
    structureType?: StructureType;
    fields?: StructureFieldOptions[] | null;
}
export declare class StructureDefinition extends DataTypeDefinition {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    defaultEncodingId: NodeId;
    baseDataType: NodeId;
    structureType: StructureType;
    fields: StructureField[] | null;
    constructor(options?: StructureDefinitionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setStructureType(value: any): StructureType;
    get schema(): IStructuredTypeSchema;
}
export interface StructureDescriptionOptions extends DataTypeDescriptionOptions {
    structureDefinition?: StructureDefinitionOptions;
}
export declare class StructureDescription extends DataTypeDescription {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    structureDefinition: StructureDefinition;
    constructor(options?: StructureDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EnumValueTypeOptions {
    value?: Int64;
    displayName?: (LocalizedTextLike | null);
    description?: (LocalizedTextLike | null);
}
export declare class EnumValueType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    value: Int64;
    displayName: LocalizedText;
    description: LocalizedText;
    constructor(options?: EnumValueTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EnumFieldOptions extends EnumValueTypeOptions {
    name?: UAString;
}
export declare class EnumField extends EnumValueType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    constructor(options?: EnumFieldOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EnumDefinitionOptions {
    fields?: EnumFieldOptions[] | null;
}
export declare class EnumDefinition extends DataTypeDefinition {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    fields: EnumField[] | null;
    constructor(options?: EnumDefinitionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EnumDescriptionOptions extends DataTypeDescriptionOptions {
    enumDefinition?: EnumDefinitionOptions;
    builtInType?: Byte;
}
export declare class EnumDescription extends DataTypeDescription {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    enumDefinition: EnumDefinition;
    builtInType: Byte;
    constructor(options?: EnumDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SimpleTypeDescriptionOptions extends DataTypeDescriptionOptions {
    baseDataType?: (NodeIdLike | null);
    builtInType?: Byte;
}
export declare class SimpleTypeDescription extends DataTypeDescription {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    baseDataType: NodeId;
    builtInType: Byte;
    constructor(options?: SimpleTypeDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataTypeSchemaHeaderOptions {
    namespaces?: UAString[] | null;
    structureDataTypes?: StructureDescriptionOptions[] | null;
    enumDataTypes?: EnumDescriptionOptions[] | null;
    simpleDataTypes?: SimpleTypeDescriptionOptions[] | null;
}
export declare class DataTypeSchemaHeader extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    namespaces: UAString[] | null;
    structureDataTypes: StructureDescription[] | null;
    enumDataTypes: EnumDescription[] | null;
    simpleDataTypes: SimpleTypeDescription[] | null;
    constructor(options?: DataTypeSchemaHeaderOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum DataSetFieldFlags {
    None = 0,
    PromotedField = 1,
    Invalid = 4294967295
}
export declare const _enumerationDataSetFieldFlags: Enum;
export interface FieldMetaDataOptions {
    name?: UAString;
    description?: (LocalizedTextLike | null);
    fieldFlags?: DataSetFieldFlags;
    builtInType?: Byte;
    dataType?: (NodeIdLike | null);
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    maxStringLength?: UInt32;
    dataSetFieldId?: Guid;
    properties?: KeyValuePairOptions[] | null;
}
export declare class FieldMetaData extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    description: LocalizedText;
    fieldFlags: DataSetFieldFlags;
    builtInType: Byte;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[] | null;
    maxStringLength: UInt32;
    dataSetFieldId: Guid;
    properties: KeyValuePair[] | null;
    constructor(options?: FieldMetaDataOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setFieldFlags(value: any): DataSetFieldFlags;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetMetaDataTypeOptions extends DataTypeSchemaHeaderOptions {
    name?: UAString;
    description?: (LocalizedTextLike | null);
    fields?: FieldMetaDataOptions[] | null;
    dataSetClassId?: Guid;
    configurationVersion?: ConfigurationVersionDataTypeOptions;
}
export declare class DataSetMetaDataType extends DataTypeSchemaHeader {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    description: LocalizedText;
    fields: FieldMetaData[] | null;
    dataSetClassId: Guid;
    configurationVersion: ConfigurationVersionDataType;
    constructor(options?: DataSetMetaDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum DataSetFieldContentMask {
    None = 0,
    StatusCode = 1,
    SourceTimestamp = 2,
    ServerTimestamp = 4,
    SourcePicoSeconds = 8,
    ServerPicoSeconds = 16,
    RawData = 32
}
export declare const _enumerationDataSetFieldContentMask: Enum;
export interface DataSetReaderDataTypeOptions {
    name?: UAString;
    enabled?: UABoolean;
    publisherId?: (VariantLike | null);
    writerGroupId?: UInt16;
    dataSetWriterId?: UInt16;
    dataSetMetaData?: DataSetMetaDataTypeOptions;
    dataSetFieldContentMask?: DataSetFieldContentMask;
    messageReceiveTimeout?: Double;
    keyFrameCount?: UInt32;
    headerLayoutUri?: UAString;
    securityMode?: MessageSecurityMode;
    securityGroupId?: UAString;
    securityKeyServices?: EndpointDescriptionOptions[] | null;
    dataSetReaderProperties?: KeyValuePairOptions[] | null;
    transportSettings?: (ExtensionObject | null);
    messageSettings?: (ExtensionObject | null);
    subscribedDataSet?: (ExtensionObject | null);
}
export declare class DataSetReaderDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    enabled: UABoolean;
    publisherId: Variant;
    writerGroupId: UInt16;
    dataSetWriterId: UInt16;
    dataSetMetaData: DataSetMetaDataType;
    dataSetFieldContentMask: DataSetFieldContentMask;
    messageReceiveTimeout: Double;
    keyFrameCount: UInt32;
    headerLayoutUri: UAString;
    securityMode: MessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: EndpointDescription[] | null;
    dataSetReaderProperties: KeyValuePair[] | null;
    transportSettings: (ExtensionObject | null);
    messageSettings: (ExtensionObject | null);
    subscribedDataSet: (ExtensionObject | null);
    constructor(options?: DataSetReaderDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setDataSetFieldContentMask(value: any): DataSetFieldContentMask;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetReaderMessageDataTypeOptions {
}
export declare class DataSetReaderMessageDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DataSetReaderMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetWriterDataTypeOptions {
    name?: UAString;
    enabled?: UABoolean;
    dataSetWriterId?: UInt16;
    dataSetFieldContentMask?: DataSetFieldContentMask;
    keyFrameCount?: UInt32;
    dataSetName?: UAString;
    dataSetWriterProperties?: KeyValuePairOptions[] | null;
    transportSettings?: (ExtensionObject | null);
    messageSettings?: (ExtensionObject | null);
}
export declare class DataSetWriterDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    enabled: UABoolean;
    dataSetWriterId: UInt16;
    dataSetFieldContentMask: DataSetFieldContentMask;
    keyFrameCount: UInt32;
    dataSetName: UAString;
    dataSetWriterProperties: KeyValuePair[] | null;
    transportSettings: (ExtensionObject | null);
    messageSettings: (ExtensionObject | null);
    constructor(options?: DataSetWriterDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setDataSetFieldContentMask(value: any): DataSetFieldContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface DataSetWriterMessageDataTypeOptions {
}
export declare class DataSetWriterMessageDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DataSetWriterMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NodeAttributesOptions {
    specifiedAttributes?: UInt32;
    displayName?: (LocalizedTextLike | null);
    description?: (LocalizedTextLike | null);
    writeMask?: UInt32;
    userWriteMask?: UInt32;
}
export declare class NodeAttributes extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    specifiedAttributes: UInt32;
    displayName: LocalizedText;
    description: LocalizedText;
    writeMask: UInt32;
    userWriteMask: UInt32;
    constructor(options?: NodeAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DataTypeAttributesOptions extends NodeAttributesOptions {
    isAbstract?: UABoolean;
}
export declare class DataTypeAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    isAbstract: UABoolean;
    constructor(options?: DataTypeAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DatagramConnectionTransportDataTypeOptions extends ConnectionTransportDataTypeOptions {
    discoveryAddress?: (ExtensionObject | null);
}
export declare class DatagramConnectionTransportDataType extends ConnectionTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    discoveryAddress: (ExtensionObject | null);
    constructor(options?: DatagramConnectionTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DatagramConnectionTransport2DataTypeOptions extends DatagramConnectionTransportDataTypeOptions {
    discoveryAnnounceRate?: UInt32;
    discoveryMaxMessageSize?: UInt32;
    qosCategory?: UAString;
    datagramQos?: (ExtensionObject | null)[] | null;
}
export declare class DatagramConnectionTransport2DataType extends DatagramConnectionTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    discoveryAnnounceRate: UInt32;
    discoveryMaxMessageSize: UInt32;
    qosCategory: UAString;
    datagramQos: (ExtensionObject | null)[] | null;
    constructor(options?: DatagramConnectionTransport2DataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DatagramDataSetReaderTransportDataTypeOptions extends DataSetReaderTransportDataTypeOptions {
    address?: (ExtensionObject | null);
    qosCategory?: UAString;
    datagramQos?: (ExtensionObject | null)[] | null;
    topic?: UAString;
}
export declare class DatagramDataSetReaderTransportDataType extends DataSetReaderTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    address: (ExtensionObject | null);
    qosCategory: UAString;
    datagramQos: (ExtensionObject | null)[] | null;
    topic: UAString;
    constructor(options?: DatagramDataSetReaderTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DatagramWriterGroupTransportDataTypeOptions extends WriterGroupTransportDataTypeOptions {
    messageRepeatCount?: Byte;
    messageRepeatDelay?: Double;
}
export declare class DatagramWriterGroupTransportDataType extends WriterGroupTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageRepeatCount: Byte;
    messageRepeatDelay: Double;
    constructor(options?: DatagramWriterGroupTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DatagramWriterGroupTransport2DataTypeOptions extends DatagramWriterGroupTransportDataTypeOptions {
    address?: (ExtensionObject | null);
    qosCategory?: UAString;
    datagramQos?: (ExtensionObject | null)[] | null;
    discoveryAnnounceRate?: UInt32;
    topic?: UAString;
}
export declare class DatagramWriterGroupTransport2DataType extends DatagramWriterGroupTransportDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    address: (ExtensionObject | null);
    qosCategory: UAString;
    datagramQos: (ExtensionObject | null)[] | null;
    discoveryAnnounceRate: UInt32;
    topic: UAString;
    constructor(options?: DatagramWriterGroupTransport2DataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryUpdateDetailsOptions {
}
export declare class HistoryUpdateDetails extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: HistoryUpdateDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteAtTimeDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    reqTimes?: DateTime[] | null;
}
export declare class DeleteAtTimeDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    reqTimes: DateTime[] | null;
    constructor(options?: DeleteAtTimeDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteEventDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    eventIds?: ByteString[] | null;
}
export declare class DeleteEventDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    eventIds: ByteString[] | null;
    constructor(options?: DeleteEventDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteMonitoredItemsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    monitoredItemIds?: UInt32[] | null;
}
export declare class DeleteMonitoredItemsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    monitoredItemIds: UInt32[] | null;
    constructor(options?: DeleteMonitoredItemsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteMonitoredItemsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class DeleteMonitoredItemsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: DeleteMonitoredItemsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteNodesItemOptions {
    nodeId?: (NodeIdLike | null);
    deleteTargetReferences?: UABoolean;
}
export declare class DeleteNodesItem extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    deleteTargetReferences: UABoolean;
    constructor(options?: DeleteNodesItemOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteNodesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    nodesToDelete?: DeleteNodesItemOptions[] | null;
}
export declare class DeleteNodesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    nodesToDelete: DeleteNodesItem[] | null;
    constructor(options?: DeleteNodesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteNodesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class DeleteNodesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: DeleteNodesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteRawModifiedDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    isDeleteModified?: UABoolean;
    startTime?: DateTime;
    endTime?: DateTime;
}
export declare class DeleteRawModifiedDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    isDeleteModified: UABoolean;
    startTime: DateTime;
    endTime: DateTime;
    constructor(options?: DeleteRawModifiedDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteReferencesItemOptions {
    sourceNodeId?: (NodeIdLike | null);
    referenceTypeId?: (NodeIdLike | null);
    isForward?: UABoolean;
    targetNodeId?: ExpandedNodeId;
    deleteBidirectional?: UABoolean;
}
export declare class DeleteReferencesItem extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sourceNodeId: NodeId;
    referenceTypeId: NodeId;
    isForward: UABoolean;
    targetNodeId: ExpandedNodeId;
    deleteBidirectional: UABoolean;
    constructor(options?: DeleteReferencesItemOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteReferencesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    referencesToDelete?: DeleteReferencesItemOptions[] | null;
}
export declare class DeleteReferencesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    referencesToDelete: DeleteReferencesItem[] | null;
    constructor(options?: DeleteReferencesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteReferencesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class DeleteReferencesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: DeleteReferencesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteSubscriptionsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionIds?: UInt32[] | null;
}
export declare class DeleteSubscriptionsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionIds: UInt32[] | null;
    constructor(options?: DeleteSubscriptionsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DeleteSubscriptionsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class DeleteSubscriptionsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: DeleteSubscriptionsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DiscoveryConfigurationOptions {
}
export declare class DiscoveryConfiguration extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: DiscoveryConfigurationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DoubleComplexNumberTypeOptions {
    real?: Double;
    imaginary?: Double;
}
export declare class DoubleComplexNumberType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    real: Double;
    imaginary: Double;
    constructor(options?: DoubleComplexNumberTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface DtlsPubSubConnectionDataTypeOptions {
    clientCipherSuite?: UAString;
    serverCipherSuites?: UAString[] | null;
    zeroRTT?: UABoolean;
    certificateGroupId?: (NodeIdLike | null);
    verifyClientCertificate?: UABoolean;
}
export declare class DtlsPubSubConnectionDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    clientCipherSuite: UAString;
    serverCipherSuites: UAString[] | null;
    zeroRTT: UABoolean;
    certificateGroupId: NodeId;
    verifyClientCertificate: UABoolean;
    constructor(options?: DtlsPubSubConnectionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ElementOperandOptions extends FilterOperandOptions {
    index?: UInt32;
}
export declare class ElementOperand extends FilterOperand {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    index: UInt32;
    constructor(options?: ElementOperandOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EndpointConfigurationOptions {
    operationTimeout?: Int32;
    useBinaryEncoding?: UABoolean;
    maxStringLength?: Int32;
    maxByteStringLength?: Int32;
    maxArrayLength?: Int32;
    maxMessageSize?: Int32;
    maxBufferSize?: Int32;
    channelLifetime?: Int32;
    securityTokenLifetime?: Int32;
}
export declare class EndpointConfiguration extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    operationTimeout: Int32;
    useBinaryEncoding: UABoolean;
    maxStringLength: Int32;
    maxByteStringLength: Int32;
    maxArrayLength: Int32;
    maxMessageSize: Int32;
    maxBufferSize: Int32;
    channelLifetime: Int32;
    securityTokenLifetime: Int32;
    constructor(options?: EndpointConfigurationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EndpointTypeOptions {
    endpointUrl?: UAString;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: UAString;
    transportProfileUri?: UAString;
}
export declare class EndpointType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    endpointUrl: UAString;
    securityMode: MessageSecurityMode;
    securityPolicyUri: UAString;
    transportProfileUri: UAString;
    constructor(options?: EndpointTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface EndpointUrlListDataTypeOptions {
    endpointUrlList?: UAString[] | null;
}
export declare class EndpointUrlListDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    endpointUrlList: UAString[] | null;
    constructor(options?: EndpointUrlListDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EphemeralKeyTypeOptions {
    publicKey?: ByteString;
    signature?: ByteString;
}
export declare class EphemeralKeyType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    publicKey: ByteString;
    signature: ByteString;
    constructor(options?: EphemeralKeyTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EventFieldListOptions {
    clientHandle?: UInt32;
    eventFields?: (VariantLike | null)[] | null;
}
export declare class EventFieldList extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    clientHandle: UInt32;
    eventFields: Variant[] | null;
    constructor(options?: EventFieldListOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EventFilterOptions extends MonitoringFilterOptions {
    selectClauses?: SimpleAttributeOperandOptions[] | null;
    whereClause?: ContentFilterOptions;
}
export declare class EventFilter extends MonitoringFilter {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    selectClauses: SimpleAttributeOperand[] | null;
    whereClause: ContentFilter;
    constructor(options?: EventFilterOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EventFilterResultOptions extends MonitoringFilterResultOptions {
    selectClauseResults?: StatusCode[] | null;
    selectClauseDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
    whereClauseResult?: ContentFilterResultOptions;
}
export declare class EventFilterResult extends MonitoringFilterResult {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    selectClauseResults: StatusCode[] | null;
    selectClauseDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    whereClauseResult: ContentFilterResult;
    constructor(options?: EventFilterResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface EventNotificationListOptions extends NotificationDataOptions {
    events?: EventFieldListOptions[] | null;
}
export declare class EventNotificationList extends NotificationData {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    events: EventFieldList[] | null;
    constructor(options?: EventNotificationListOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum OverrideValueHandling {
    Disabled = 0,
    LastUsableValue = 1,
    OverrideValue = 2,
    Invalid = 4294967295
}
export declare const _enumerationOverrideValueHandling: Enum;
export interface FieldTargetDataTypeOptions {
    dataSetFieldId?: Guid;
    receiverIndexRange?: UAString;
    targetNodeId?: (NodeIdLike | null);
    attributeId?: UInt32;
    writeIndexRange?: UAString;
    overrideValueHandling?: OverrideValueHandling;
    overrideValue?: (VariantLike | null);
}
export declare class FieldTargetDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetFieldId: Guid;
    receiverIndexRange: UAString;
    targetNodeId: NodeId;
    attributeId: UInt32;
    writeIndexRange: UAString;
    overrideValueHandling: OverrideValueHandling;
    overrideValue: Variant;
    constructor(options?: FieldTargetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setOverrideValueHandling(value: any): OverrideValueHandling;
    get schema(): IStructuredTypeSchema;
}
export interface FindServersOnNetworkRequestOptions {
    requestHeader?: RequestHeaderOptions;
    startingRecordId?: UInt32;
    maxRecordsToReturn?: UInt32;
    serverCapabilityFilter?: UAString[] | null;
}
export declare class FindServersOnNetworkRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    startingRecordId: UInt32;
    maxRecordsToReturn: UInt32;
    serverCapabilityFilter: UAString[] | null;
    constructor(options?: FindServersOnNetworkRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ServerOnNetworkOptions {
    recordId?: UInt32;
    serverName?: UAString;
    discoveryUrl?: UAString;
    serverCapabilities?: UAString[] | null;
}
export declare class ServerOnNetwork extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    recordId: UInt32;
    serverName: UAString;
    discoveryUrl: UAString;
    serverCapabilities: UAString[] | null;
    constructor(options?: ServerOnNetworkOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface FindServersOnNetworkResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    lastCounterResetTime?: DateTime;
    servers?: ServerOnNetworkOptions[] | null;
}
export declare class FindServersOnNetworkResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    lastCounterResetTime: DateTime;
    servers: ServerOnNetwork[] | null;
    constructor(options?: FindServersOnNetworkResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface FindServersRequestOptions {
    requestHeader?: RequestHeaderOptions;
    endpointUrl?: UAString;
    localeIds?: UAString[] | null;
    serverUris?: UAString[] | null;
}
export declare class FindServersRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    endpointUrl: UAString;
    localeIds: UAString[] | null;
    serverUris: UAString[] | null;
    constructor(options?: FindServersRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface FindServersResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    servers?: ApplicationDescriptionOptions[] | null;
}
export declare class FindServersResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    servers: ApplicationDescription[] | null;
    constructor(options?: FindServersResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface FrameOptions {
}
export declare class Frame extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: FrameOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface GenericAttributeValueOptions {
    attributeId?: UInt32;
    value?: (VariantLike | null);
}
export declare class GenericAttributeValue extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    attributeId: UInt32;
    value: Variant;
    constructor(options?: GenericAttributeValueOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface GenericAttributesOptions extends NodeAttributesOptions {
    attributeValues?: GenericAttributeValueOptions[] | null;
}
export declare class GenericAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    attributeValues: GenericAttributeValue[] | null;
    constructor(options?: GenericAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface GetEndpointsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    endpointUrl?: UAString;
    localeIds?: UAString[] | null;
    profileUris?: UAString[] | null;
}
export declare class GetEndpointsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    endpointUrl: UAString;
    localeIds: UAString[] | null;
    profileUris: UAString[] | null;
    constructor(options?: GetEndpointsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface GetEndpointsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    endpoints?: EndpointDescriptionOptions[] | null;
}
export declare class GetEndpointsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    endpoints: EndpointDescription[] | null;
    constructor(options?: GetEndpointsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryDataOptions {
    dataValues?: (DataValueLike | null)[] | null;
}
export declare class HistoryData extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataValues: DataValue[] | null;
    constructor(options?: HistoryDataOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryEventFieldListOptions {
    eventFields?: (VariantLike | null)[] | null;
}
export declare class HistoryEventFieldList extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    eventFields: Variant[] | null;
    constructor(options?: HistoryEventFieldListOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryEventOptions {
    events?: HistoryEventFieldListOptions[] | null;
}
export declare class HistoryEvent extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    events: HistoryEventFieldList[] | null;
    constructor(options?: HistoryEventOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum HistoryUpdateType {
    Insert = 1,
    Replace = 2,
    Update = 3,
    Delete = 4,
    Invalid = 4294967295
}
export declare const _enumerationHistoryUpdateType: Enum;
export interface ModificationInfoOptions {
    modificationTime?: DateTime;
    updateType?: HistoryUpdateType;
    userName?: UAString;
}
export declare class ModificationInfo extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    modificationTime: DateTime;
    updateType: HistoryUpdateType;
    userName: UAString;
    constructor(options?: ModificationInfoOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setUpdateType(value: any): HistoryUpdateType;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryModifiedDataOptions extends HistoryDataOptions {
    modificationInfos?: ModificationInfoOptions[] | null;
}
export declare class HistoryModifiedData extends HistoryData {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    modificationInfos: ModificationInfo[] | null;
    constructor(options?: HistoryModifiedDataOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryModifiedEventOptions extends HistoryEventOptions {
    modificationInfos?: ModificationInfoOptions[] | null;
}
export declare class HistoryModifiedEvent extends HistoryEvent {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    modificationInfos: ModificationInfo[] | null;
    constructor(options?: HistoryModifiedEventOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryReadDetailsOptions {
}
export declare class HistoryReadDetails extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: HistoryReadDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryReadValueIdOptions {
    nodeId?: (NodeIdLike | null);
    indexRange?: NumericRange;
    dataEncoding?: (QualifiedNameLike | null);
    continuationPoint?: ByteString;
}
export declare class HistoryReadValueId extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    indexRange: NumericRange;
    dataEncoding: QualifiedName;
    continuationPoint: ByteString;
    constructor(options?: HistoryReadValueIdOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryReadRequestOptions {
    requestHeader?: RequestHeaderOptions;
    historyReadDetails?: (ExtensionObject | null);
    timestampsToReturn?: TimestampsToReturn;
    releaseContinuationPoints?: UABoolean;
    nodesToRead?: HistoryReadValueIdOptions[] | null;
}
export declare class HistoryReadRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    historyReadDetails: (ExtensionObject | null);
    timestampsToReturn: TimestampsToReturn;
    releaseContinuationPoints: UABoolean;
    nodesToRead: HistoryReadValueId[] | null;
    constructor(options?: HistoryReadRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTimestampsToReturn(value: any): TimestampsToReturn;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryReadResultOptions {
    statusCode?: StatusCode;
    continuationPoint?: ByteString;
    historyData?: (ExtensionObject | null);
}
export declare class HistoryReadResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    continuationPoint: ByteString;
    historyData: (ExtensionObject | null);
    constructor(options?: HistoryReadResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryReadResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: HistoryReadResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class HistoryReadResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: HistoryReadResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: HistoryReadResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryUpdateRequestOptions {
    requestHeader?: RequestHeaderOptions;
    historyUpdateDetails?: (ExtensionObject | null)[] | null;
}
export declare class HistoryUpdateRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    historyUpdateDetails: (ExtensionObject | null)[] | null;
    constructor(options?: HistoryUpdateRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryUpdateResultOptions {
    statusCode?: StatusCode;
    operationResults?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class HistoryUpdateResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    operationResults: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: HistoryUpdateResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface HistoryUpdateResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: HistoryUpdateResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class HistoryUpdateResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: HistoryUpdateResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: HistoryUpdateResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum IdentityCriteriaType {
    UserName = 1,
    Thumbprint = 2,
    Role = 3,
    GroupId = 4,
    Anonymous = 5,
    AuthenticatedUser = 6,
    Application = 7,
    X509Subject = 8,
    TrustedApplication = 9,
    Invalid = 4294967295
}
export declare const _enumerationIdentityCriteriaType: Enum;
export interface IdentityMappingRuleTypeOptions {
    criteriaType?: IdentityCriteriaType;
    criteria?: UAString;
}
export declare class IdentityMappingRuleType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    criteriaType: IdentityCriteriaType;
    criteria: UAString;
    constructor(options?: IdentityMappingRuleTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setCriteriaType(value: any): IdentityCriteriaType;
    get schema(): IStructuredTypeSchema;
}
export interface IssuedIdentityTokenOptions extends UserIdentityTokenOptions {
    tokenData?: ByteString;
    encryptionAlgorithm?: UAString;
}
export declare class IssuedIdentityToken extends UserIdentityToken {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    tokenData: ByteString;
    encryptionAlgorithm: UAString;
    constructor(options?: IssuedIdentityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonActionMetaDataMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    dataSetWriterId?: UInt16;
    dataSetWriterName?: UAString;
    timestamp?: DateTime;
    actionTargets?: ActionTargetDataTypeOptions[] | null;
    request?: DataSetMetaDataTypeOptions;
    response?: DataSetMetaDataTypeOptions;
    actionMethods?: ActionMethodDataTypeOptions[] | null;
}
export declare class JsonActionMetaDataMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    dataSetWriterId: UInt16;
    dataSetWriterName: UAString;
    timestamp: DateTime;
    actionTargets: ActionTargetDataType[] | null;
    request: DataSetMetaDataType;
    response: DataSetMetaDataType;
    actionMethods: ActionMethodDataType[] | null;
    constructor(options?: JsonActionMetaDataMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonActionNetworkMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    responseAddress?: UAString;
    correlationData?: ByteString;
    requestorId?: UAString;
    timeoutHint?: Double;
    messages?: (ExtensionObject | null)[] | null;
}
export declare class JsonActionNetworkMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    responseAddress: UAString;
    correlationData: ByteString;
    requestorId: UAString;
    timeoutHint: Double;
    messages: (ExtensionObject | null)[] | null;
    constructor(options?: JsonActionNetworkMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum ActionState {
    Idle = 0,
    Executing = 1,
    Done = 2,
    Invalid = 4294967295
}
export declare const _enumerationActionState: Enum;
export interface JsonActionRequestMessageOptions {
    dataSetWriterId?: UInt16;
    actionTargetId?: UInt16;
    dataSetWriterName?: UAString;
    writerGroupName?: UAString;
    metaDataVersion?: ConfigurationVersionDataTypeOptions;
    minorVersion?: UInt32;
    timestamp?: DateTime;
    messageType?: UAString;
    requestId?: UInt16;
    actionState?: ActionState;
    payload?: (ExtensionObject | null);
}
export declare class JsonActionRequestMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetWriterId: UInt16;
    actionTargetId: UInt16;
    dataSetWriterName: UAString;
    writerGroupName: UAString;
    metaDataVersion: ConfigurationVersionDataType;
    minorVersion: UInt32;
    timestamp: DateTime;
    messageType: UAString;
    requestId: UInt16;
    actionState: ActionState;
    payload: (ExtensionObject | null);
    constructor(options?: JsonActionRequestMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setActionState(value: any): ActionState;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubGroupDataTypeOptions {
    name?: UAString;
    enabled?: UABoolean;
    securityMode?: MessageSecurityMode;
    securityGroupId?: UAString;
    securityKeyServices?: EndpointDescriptionOptions[] | null;
    maxNetworkMessageSize?: UInt32;
    groupProperties?: KeyValuePairOptions[] | null;
}
export declare class PubSubGroupDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    enabled: UABoolean;
    securityMode: MessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: EndpointDescription[] | null;
    maxNetworkMessageSize: UInt32;
    groupProperties: KeyValuePair[] | null;
    constructor(options?: PubSubGroupDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface WriterGroupDataTypeOptions extends PubSubGroupDataTypeOptions {
    writerGroupId?: UInt16;
    publishingInterval?: Double;
    keepAliveTime?: Double;
    priority?: Byte;
    localeIds?: UAString[] | null;
    headerLayoutUri?: UAString;
    transportSettings?: (ExtensionObject | null);
    messageSettings?: (ExtensionObject | null);
    dataSetWriters?: DataSetWriterDataTypeOptions[] | null;
}
export declare class WriterGroupDataType extends PubSubGroupDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    writerGroupId: UInt16;
    publishingInterval: Double;
    keepAliveTime: Double;
    priority: Byte;
    localeIds: UAString[] | null;
    headerLayoutUri: UAString;
    transportSettings: (ExtensionObject | null);
    messageSettings: (ExtensionObject | null);
    dataSetWriters: DataSetWriterDataType[] | null;
    constructor(options?: WriterGroupDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReaderGroupDataTypeOptions extends PubSubGroupDataTypeOptions {
    transportSettings?: (ExtensionObject | null);
    messageSettings?: (ExtensionObject | null);
    dataSetReaders?: DataSetReaderDataTypeOptions[] | null;
}
export declare class ReaderGroupDataType extends PubSubGroupDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    transportSettings: (ExtensionObject | null);
    messageSettings: (ExtensionObject | null);
    dataSetReaders: DataSetReaderDataType[] | null;
    constructor(options?: ReaderGroupDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubConnectionDataTypeOptions {
    name?: UAString;
    enabled?: UABoolean;
    publisherId?: (VariantLike | null);
    transportProfileUri?: UAString;
    address?: (ExtensionObject | null);
    connectionProperties?: KeyValuePairOptions[] | null;
    transportSettings?: (ExtensionObject | null);
    writerGroups?: WriterGroupDataTypeOptions[] | null;
    readerGroups?: ReaderGroupDataTypeOptions[] | null;
}
export declare class PubSubConnectionDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    enabled: UABoolean;
    publisherId: Variant;
    transportProfileUri: UAString;
    address: (ExtensionObject | null);
    connectionProperties: KeyValuePair[] | null;
    transportSettings: (ExtensionObject | null);
    writerGroups: WriterGroupDataType[] | null;
    readerGroups: ReaderGroupDataType[] | null;
    constructor(options?: PubSubConnectionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonActionResponderMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    connection?: PubSubConnectionDataTypeOptions;
}
export declare class JsonActionResponderMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    connection: PubSubConnectionDataType;
    constructor(options?: JsonActionResponderMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonActionResponseMessageOptions {
    dataSetWriterId?: UInt16;
    actionTargetId?: UInt16;
    dataSetWriterName?: UAString;
    writerGroupName?: UAString;
    metaDataVersion?: ConfigurationVersionDataTypeOptions;
    minorVersion?: UInt32;
    timestamp?: DateTime;
    status?: StatusCode;
    messageType?: UAString;
    requestId?: UInt16;
    actionState?: ActionState;
    payload?: (ExtensionObject | null);
}
export declare class JsonActionResponseMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetWriterId: UInt16;
    actionTargetId: UInt16;
    dataSetWriterName: UAString;
    writerGroupName: UAString;
    metaDataVersion: ConfigurationVersionDataType;
    minorVersion: UInt32;
    timestamp: DateTime;
    status: StatusCode;
    messageType: UAString;
    requestId: UInt16;
    actionState: ActionState;
    payload: (ExtensionObject | null);
    constructor(options?: JsonActionResponseMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setActionState(value: any): ActionState;
    get schema(): IStructuredTypeSchema;
}
export interface JsonApplicationDescriptionMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    description?: ApplicationDescriptionOptions;
    serverCapabilities?: UAString[] | null;
}
export declare class JsonApplicationDescriptionMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    description: ApplicationDescription;
    serverCapabilities: UAString[] | null;
    constructor(options?: JsonApplicationDescriptionMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonDataSetMessageOptions {
    dataSetWriterId?: UInt16;
    dataSetWriterName?: UAString;
    publisherId?: UAString;
    writerGroupName?: UAString;
    sequenceNumber?: UInt32;
    metaDataVersion?: ConfigurationVersionDataTypeOptions;
    minorVersion?: UInt32;
    timestamp?: DateTime;
    status?: StatusCode;
    messageType?: UAString;
    payload?: (ExtensionObject | null);
}
export declare class JsonDataSetMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetWriterId: UInt16;
    dataSetWriterName: UAString;
    publisherId: UAString;
    writerGroupName: UAString;
    sequenceNumber: UInt32;
    metaDataVersion: ConfigurationVersionDataType;
    minorVersion: UInt32;
    timestamp: DateTime;
    status: StatusCode;
    messageType: UAString;
    payload: (ExtensionObject | null);
    constructor(options?: JsonDataSetMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonDataSetMetaDataMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    dataSetWriterId?: UInt16;
    writerGroupName?: UAString;
    dataSetWriterName?: UAString;
    timestamp?: DateTime;
    metaData?: DataSetMetaDataTypeOptions;
}
export declare class JsonDataSetMetaDataMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    dataSetWriterId: UInt16;
    writerGroupName: UAString;
    dataSetWriterName: UAString;
    timestamp: DateTime;
    metaData: DataSetMetaDataType;
    constructor(options?: JsonDataSetMetaDataMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum JsonNetworkMessageContentMask {
    None = 0,
    NetworkMessageHeader = 1,
    DataSetMessageHeader = 2,
    SingleDataSetMessage = 4,
    PublisherId = 8,
    DataSetClassId = 16,
    ReplyTo = 32,
    WriterGroupName = 64
}
export declare const _enumerationJsonNetworkMessageContentMask: Enum;
export declare enum JsonDataSetMessageContentMask {
    None = 0,
    DataSetWriterId = 1,
    MetaDataVersion = 2,
    SequenceNumber = 4,
    Timestamp = 8,
    Status = 16,
    MessageType = 32,
    DataSetWriterName = 64,
    FieldEncoding1 = 128,
    PublisherId = 256,
    WriterGroupName = 512,
    MinorVersion = 1024,
    FieldEncoding2 = 2048
}
export declare const _enumerationJsonDataSetMessageContentMask: Enum;
export interface JsonDataSetReaderMessageDataTypeOptions extends DataSetReaderMessageDataTypeOptions {
    networkMessageContentMask?: JsonNetworkMessageContentMask;
    dataSetMessageContentMask?: JsonDataSetMessageContentMask;
}
export declare class JsonDataSetReaderMessageDataType extends DataSetReaderMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    networkMessageContentMask: JsonNetworkMessageContentMask;
    dataSetMessageContentMask: JsonDataSetMessageContentMask;
    constructor(options?: JsonDataSetReaderMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setNetworkMessageContentMask(value: any): JsonNetworkMessageContentMask;
    setDataSetMessageContentMask(value: any): JsonDataSetMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface JsonDataSetWriterMessageDataTypeOptions extends DataSetWriterMessageDataTypeOptions {
    dataSetMessageContentMask?: JsonDataSetMessageContentMask;
}
export declare class JsonDataSetWriterMessageDataType extends DataSetWriterMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetMessageContentMask: JsonDataSetMessageContentMask;
    constructor(options?: JsonDataSetWriterMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setDataSetMessageContentMask(value: any): JsonDataSetMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface JsonNetworkMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    writerGroupName?: UAString;
    dataSetClassId?: UAString;
    messages?: (ExtensionObject | null)[] | null;
}
export declare class JsonNetworkMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    writerGroupName: UAString;
    dataSetClassId: UAString;
    messages: (ExtensionObject | null)[] | null;
    constructor(options?: JsonNetworkMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonPubSubConnectionMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    connection?: PubSubConnectionDataTypeOptions;
}
export declare class JsonPubSubConnectionMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    connection: PubSubConnectionDataType;
    constructor(options?: JsonPubSubConnectionMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonServerEndpointsMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    description?: ApplicationDescriptionOptions;
    endpoints?: EndpointDescriptionOptions[] | null;
}
export declare class JsonServerEndpointsMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    description: ApplicationDescription;
    endpoints: EndpointDescription[] | null;
    constructor(options?: JsonServerEndpointsMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum PubSubState {
    Disabled = 0,
    Paused = 1,
    Operational = 2,
    Error = 3,
    PreOperational = 4,
    Invalid = 4294967295
}
export declare const _enumerationPubSubState: Enum;
export interface JsonStatusMessageOptions {
    messageId?: UAString;
    messageType?: UAString;
    publisherId?: UAString;
    timestamp?: DateTime;
    isCyclic?: UABoolean;
    status?: PubSubState;
    nextReportTime?: DateTime;
}
export declare class JsonStatusMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    messageId: UAString;
    messageType: UAString;
    publisherId: UAString;
    timestamp: DateTime;
    isCyclic: UABoolean;
    status: PubSubState;
    nextReportTime: DateTime;
    constructor(options?: JsonStatusMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setStatus(value: any): PubSubState;
    get schema(): IStructuredTypeSchema;
}
export interface WriterGroupMessageDataTypeOptions {
}
export declare class WriterGroupMessageDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: WriterGroupMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface JsonWriterGroupMessageDataTypeOptions extends WriterGroupMessageDataTypeOptions {
    networkMessageContentMask?: JsonNetworkMessageContentMask;
}
export declare class JsonWriterGroupMessageDataType extends WriterGroupMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    networkMessageContentMask: JsonNetworkMessageContentMask;
    constructor(options?: JsonWriterGroupMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setNetworkMessageContentMask(value: any): JsonNetworkMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface LinearConversionDataTypeOptions {
    initialAddend?: Float;
    multiplicand?: Float;
    divisor?: Float;
    finalAddend?: Float;
}
export declare class LinearConversionDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    initialAddend: Float;
    multiplicand: Float;
    divisor: Float;
    finalAddend: Float;
    constructor(options?: LinearConversionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface LiteralOperandOptions extends FilterOperandOptions {
    value?: (VariantLike | null);
}
export declare class LiteralOperand extends FilterOperand {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    value: Variant;
    constructor(options?: LiteralOperandOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum ManAddrIfSubtype {
    None = 0,
    Unknown = 1,
    PortRef = 2,
    SystemPortNumber = 3,
    Invalid = 4294967295
}
export declare const _enumerationManAddrIfSubtype: Enum;
export interface LldpManagementAddressTxPortTypeOptions {
    addressSubtype?: UInt32;
    manAddress?: UAString;
    txEnable?: UABoolean;
    addrLen?: UInt32;
    ifSubtype?: ManAddrIfSubtype;
    ifId?: UInt32;
}
export declare class LldpManagementAddressTxPortType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    addressSubtype: UInt32;
    manAddress: UAString;
    txEnable: UABoolean;
    addrLen: UInt32;
    ifSubtype: ManAddrIfSubtype;
    ifId: UInt32;
    constructor(options?: LldpManagementAddressTxPortTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setIfSubtype(value: any): ManAddrIfSubtype;
    get schema(): IStructuredTypeSchema;
}
export interface LldpManagementAddressTypeOptions {
    addressSubtype?: UInt32;
    address?: UAString;
    ifSubtype?: ManAddrIfSubtype;
    ifId?: UInt32;
}
export declare class LldpManagementAddressType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    addressSubtype: UInt32;
    address: UAString;
    ifSubtype: ManAddrIfSubtype;
    ifId: UInt32;
    constructor(options?: LldpManagementAddressTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setIfSubtype(value: any): ManAddrIfSubtype;
    get schema(): IStructuredTypeSchema;
}
export interface LldpTlvTypeOptions {
    tlvType?: UInt32;
    tlvInfo?: ByteString;
}
export declare class LldpTlvType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    tlvType: UInt32;
    tlvInfo: ByteString;
    constructor(options?: LldpTlvTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MdnsDiscoveryConfigurationOptions extends DiscoveryConfigurationOptions {
    mdnsServerName?: UAString;
    serverCapabilities?: UAString[] | null;
}
export declare class MdnsDiscoveryConfiguration extends DiscoveryConfiguration {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    mdnsServerName: UAString;
    serverCapabilities: UAString[] | null;
    constructor(options?: MdnsDiscoveryConfigurationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MethodAttributesOptions extends NodeAttributesOptions {
    executable?: UABoolean;
    userExecutable?: UABoolean;
}
export declare class MethodAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    executable: UABoolean;
    userExecutable: UABoolean;
    constructor(options?: MethodAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ModelChangeStructureDataTypeOptions {
    affected?: (NodeIdLike | null);
    affectedType?: (NodeIdLike | null);
    verb?: Byte;
}
export declare class ModelChangeStructureDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    affected: NodeId;
    affectedType: NodeId;
    verb: Byte;
    constructor(options?: ModelChangeStructureDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoredItemModifyRequestOptions {
    monitoredItemId?: UInt32;
    requestedParameters?: MonitoringParametersOptions;
}
export declare class MonitoredItemModifyRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    monitoredItemId: UInt32;
    requestedParameters: MonitoringParameters;
    constructor(options?: MonitoredItemModifyRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ModifyMonitoredItemsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    timestampsToReturn?: TimestampsToReturn;
    itemsToModify?: MonitoredItemModifyRequestOptions[] | null;
}
export declare class ModifyMonitoredItemsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    timestampsToReturn: TimestampsToReturn;
    itemsToModify: MonitoredItemModifyRequest[] | null;
    constructor(options?: ModifyMonitoredItemsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTimestampsToReturn(value: any): TimestampsToReturn;
    get schema(): IStructuredTypeSchema;
}
export interface MonitoredItemModifyResultOptions {
    statusCode?: StatusCode;
    revisedSamplingInterval?: Double;
    revisedQueueSize?: UInt32;
    filterResult?: (ExtensionObject | null);
}
export declare class MonitoredItemModifyResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    revisedSamplingInterval: Double;
    revisedQueueSize: UInt32;
    filterResult: (ExtensionObject | null);
    constructor(options?: MonitoredItemModifyResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ModifyMonitoredItemsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: MonitoredItemModifyResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ModifyMonitoredItemsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: MonitoredItemModifyResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ModifyMonitoredItemsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ModifySubscriptionRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    requestedPublishingInterval?: Double;
    requestedLifetimeCount?: UInt32;
    requestedMaxKeepAliveCount?: UInt32;
    maxNotificationsPerPublish?: UInt32;
    priority?: Byte;
}
export declare class ModifySubscriptionRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    requestedPublishingInterval: Double;
    requestedLifetimeCount: UInt32;
    requestedMaxKeepAliveCount: UInt32;
    maxNotificationsPerPublish: UInt32;
    priority: Byte;
    constructor(options?: ModifySubscriptionRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ModifySubscriptionResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    revisedPublishingInterval?: Double;
    revisedLifetimeCount?: UInt32;
    revisedMaxKeepAliveCount?: UInt32;
}
export declare class ModifySubscriptionResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    revisedPublishingInterval: Double;
    revisedLifetimeCount: UInt32;
    revisedMaxKeepAliveCount: UInt32;
    constructor(options?: ModifySubscriptionResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NetworkAddressDataTypeOptions {
    networkInterface?: UAString;
}
export declare class NetworkAddressDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    networkInterface: UAString;
    constructor(options?: NetworkAddressDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NetworkAddressUrlDataTypeOptions extends NetworkAddressDataTypeOptions {
    url?: UAString;
}
export declare class NetworkAddressUrlDataType extends NetworkAddressDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    url: UAString;
    constructor(options?: NetworkAddressUrlDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NetworkGroupDataTypeOptions {
    serverUri?: UAString;
    networkPaths?: EndpointUrlListDataTypeOptions[] | null;
}
export declare class NetworkGroupDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    serverUri: UAString;
    networkPaths: EndpointUrlListDataType[] | null;
    constructor(options?: NetworkGroupDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NodeReferenceOptions {
    nodeId?: (NodeIdLike | null);
    referenceTypeId?: (NodeIdLike | null);
    isForward?: UABoolean;
    referencedNodeIds?: (NodeIdLike | null)[] | null;
}
export declare class NodeReference extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    referenceTypeId: NodeId;
    isForward: UABoolean;
    referencedNodeIds: NodeId[] | null;
    constructor(options?: NodeReferenceOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryDataDescriptionOptions {
    relativePath?: RelativePathOptions;
    attributeId?: UInt32;
    indexRange?: NumericRange;
}
export declare class QueryDataDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    relativePath: RelativePath;
    attributeId: UInt32;
    indexRange: NumericRange;
    constructor(options?: QueryDataDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NodeTypeDescriptionOptions {
    typeDefinitionNode?: ExpandedNodeId;
    includeSubTypes?: UABoolean;
    dataToReturn?: QueryDataDescriptionOptions[] | null;
}
export declare class NodeTypeDescription extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    typeDefinitionNode: ExpandedNodeId;
    includeSubTypes: UABoolean;
    dataToReturn: QueryDataDescription[] | null;
    constructor(options?: NodeTypeDescriptionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface NotificationMessageOptions {
    sequenceNumber?: UInt32;
    publishTime?: DateTime;
    notificationData?: (ExtensionObject | null)[] | null;
}
export declare class NotificationMessage extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sequenceNumber: UInt32;
    publishTime: DateTime;
    notificationData: (ExtensionObject | null)[] | null;
    constructor(options?: NotificationMessageOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ObjectAttributesOptions extends NodeAttributesOptions {
    eventNotifier?: Byte;
}
export declare class ObjectAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    eventNotifier: Byte;
    constructor(options?: ObjectAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ObjectTypeAttributesOptions extends NodeAttributesOptions {
    isAbstract?: UABoolean;
}
export declare class ObjectTypeAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    isAbstract: UABoolean;
    constructor(options?: ObjectTypeAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum SecurityTokenRequestType {
    Issue = 0,
    Renew = 1,
    Invalid = 4294967295
}
export declare const _enumerationSecurityTokenRequestType: Enum;
export interface OpenSecureChannelRequestOptions {
    requestHeader?: RequestHeaderOptions;
    clientProtocolVersion?: UInt32;
    requestType?: SecurityTokenRequestType;
    securityMode?: MessageSecurityMode;
    clientNonce?: ByteString;
    requestedLifetime?: UInt32;
}
export declare class OpenSecureChannelRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    clientProtocolVersion: UInt32;
    requestType: SecurityTokenRequestType;
    securityMode: MessageSecurityMode;
    clientNonce: ByteString;
    requestedLifetime: UInt32;
    constructor(options?: OpenSecureChannelRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setRequestType(value: any): SecurityTokenRequestType;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface OpenSecureChannelResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    serverProtocolVersion?: UInt32;
    securityToken?: ChannelSecurityTokenOptions;
    serverNonce?: ByteString;
}
export declare class OpenSecureChannelResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    serverProtocolVersion: UInt32;
    securityToken: ChannelSecurityToken;
    serverNonce: ByteString;
    constructor(options?: OpenSecureChannelResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface OptionSetOptions {
    value?: ByteString;
    validBits?: ByteString;
}
export declare class OptionSet extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    value: ByteString;
    validBits: ByteString;
    constructor(options?: OptionSetOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface OrientationOptions {
}
export declare class Orientation extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: OrientationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ParsingResultOptions {
    statusCode?: StatusCode;
    dataStatusCodes?: StatusCode[] | null;
    dataDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ParsingResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    dataStatusCodes: StatusCode[] | null;
    dataDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ParsingResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PortableNodeIdOptions {
    namespaceUri?: UAString;
    identifier?: (NodeIdLike | null);
}
export declare class PortableNodeId extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    namespaceUri: UAString;
    identifier: NodeId;
    constructor(options?: PortableNodeIdOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PortableQualifiedNameOptions {
    namespaceUri?: UAString;
    name?: UAString;
}
export declare class PortableQualifiedName extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    namespaceUri: UAString;
    name: UAString;
    constructor(options?: PortableQualifiedNameOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PriorityMappingEntryTypeOptions {
    mappingUri?: UAString;
    priorityLabel?: UAString;
    priorityValue_PCP?: Byte;
    priorityValue_DSCP?: UInt32;
}
export declare class PriorityMappingEntryType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    mappingUri: UAString;
    priorityLabel: UAString;
    priorityValue_PCP: Byte;
    priorityValue_DSCP: UInt32;
    constructor(options?: PriorityMappingEntryTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ProgramDiagnostic2DataTypeOptions {
    createSessionId?: (NodeIdLike | null);
    createClientName?: UAString;
    invocationCreationTime?: DateTime;
    lastTransitionTime?: DateTime;
    lastMethodCall?: UAString;
    lastMethodSessionId?: (NodeIdLike | null);
    lastMethodInputArguments?: ArgumentOptions[] | null;
    lastMethodOutputArguments?: ArgumentOptions[] | null;
    lastMethodInputValues?: (VariantLike | null)[] | null;
    lastMethodOutputValues?: (VariantLike | null)[] | null;
    lastMethodCallTime?: DateTime;
    lastMethodReturnStatus?: StatusCode;
}
export declare class ProgramDiagnostic2DataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    createSessionId: NodeId;
    createClientName: UAString;
    invocationCreationTime: DateTime;
    lastTransitionTime: DateTime;
    lastMethodCall: UAString;
    lastMethodSessionId: NodeId;
    lastMethodInputArguments: Argument[] | null;
    lastMethodOutputArguments: Argument[] | null;
    lastMethodInputValues: Variant[] | null;
    lastMethodOutputValues: Variant[] | null;
    lastMethodCallTime: DateTime;
    lastMethodReturnStatus: StatusCode;
    constructor(options?: ProgramDiagnostic2DataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface StatusResultOptions {
    statusCode?: StatusCode;
    diagnosticInfo?: (DiagnosticInfo | null);
}
export declare class StatusResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    diagnosticInfo: (DiagnosticInfo | null);
    constructor(options?: StatusResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ProgramDiagnosticDataTypeOptions {
    createSessionId?: (NodeIdLike | null);
    createClientName?: UAString;
    invocationCreationTime?: DateTime;
    lastTransitionTime?: DateTime;
    lastMethodCall?: UAString;
    lastMethodSessionId?: (NodeIdLike | null);
    lastMethodInputArguments?: ArgumentOptions[] | null;
    lastMethodOutputArguments?: ArgumentOptions[] | null;
    lastMethodCallTime?: DateTime;
    lastMethodReturnStatus?: StatusResultOptions;
}
export declare class ProgramDiagnosticDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    createSessionId: NodeId;
    createClientName: UAString;
    invocationCreationTime: DateTime;
    lastTransitionTime: DateTime;
    lastMethodCall: UAString;
    lastMethodSessionId: NodeId;
    lastMethodInputArguments: Argument[] | null;
    lastMethodOutputArguments: Argument[] | null;
    lastMethodCallTime: DateTime;
    lastMethodReturnStatus: StatusResult;
    constructor(options?: ProgramDiagnosticDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedDataSetDataTypeOptions {
    name?: UAString;
    dataSetFolder?: UAString[] | null;
    dataSetMetaData?: DataSetMetaDataTypeOptions;
    extensionFields?: KeyValuePairOptions[] | null;
    dataSetSource?: (ExtensionObject | null);
}
export declare class PublishedDataSetDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    dataSetFolder: UAString[] | null;
    dataSetMetaData: DataSetMetaDataType;
    extensionFields: KeyValuePair[] | null;
    dataSetSource: (ExtensionObject | null);
    constructor(options?: PublishedDataSetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubConfigurationDataTypeOptions {
    publishedDataSets?: PublishedDataSetDataTypeOptions[] | null;
    connections?: PubSubConnectionDataTypeOptions[] | null;
    enabled?: UABoolean;
}
export declare class PubSubConfigurationDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    publishedDataSets: PublishedDataSetDataType[] | null;
    connections: PubSubConnectionDataType[] | null;
    enabled: UABoolean;
    constructor(options?: PubSubConfigurationDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SubscribedDataSetDataTypeOptions {
}
export declare class SubscribedDataSetDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: SubscribedDataSetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface StandaloneSubscribedDataSetDataTypeOptions extends SubscribedDataSetDataTypeOptions {
    name?: UAString;
    dataSetFolder?: UAString[] | null;
    dataSetMetaData?: DataSetMetaDataTypeOptions;
    subscribedDataSet?: (ExtensionObject | null);
}
export declare class StandaloneSubscribedDataSetDataType extends SubscribedDataSetDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    dataSetFolder: UAString[] | null;
    dataSetMetaData: DataSetMetaDataType;
    subscribedDataSet: (ExtensionObject | null);
    constructor(options?: StandaloneSubscribedDataSetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum PermissionType {
    None = 0,
    Browse = 1,
    ReadRolePermissions = 2,
    WriteAttribute = 4,
    WriteRolePermissions = 8,
    WriteHistorizing = 16,
    Read = 32,
    Write = 64,
    ReadHistory = 128,
    InsertHistory = 256,
    ModifyHistory = 512,
    DeleteHistory = 1024,
    ReceiveEvents = 2048,
    Call = 4096,
    AddReference = 8192,
    RemoveReference = 16384,
    DeleteNode = 32768,
    AddNode = 65536
}
export declare const _enumerationPermissionType: Enum;
export interface RolePermissionTypeOptions {
    roleId?: (NodeIdLike | null);
    permissions?: PermissionType;
}
export declare class RolePermissionType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    roleId: NodeId;
    permissions: PermissionType;
    constructor(options?: RolePermissionTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setPermissions(value: any): PermissionType;
    get schema(): IStructuredTypeSchema;
}
export interface SecurityGroupDataTypeOptions {
    name?: UAString;
    securityGroupFolder?: UAString[] | null;
    keyLifetime?: Double;
    securityPolicyUri?: UAString;
    maxFutureKeyCount?: UInt32;
    maxPastKeyCount?: UInt32;
    securityGroupId?: UAString;
    rolePermissions?: RolePermissionTypeOptions[] | null;
    groupProperties?: KeyValuePairOptions[] | null;
}
export declare class SecurityGroupDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    name: UAString;
    securityGroupFolder: UAString[] | null;
    keyLifetime: Double;
    securityPolicyUri: UAString;
    maxFutureKeyCount: UInt32;
    maxPastKeyCount: UInt32;
    securityGroupId: UAString;
    rolePermissions: RolePermissionType[] | null;
    groupProperties: KeyValuePair[] | null;
    constructor(options?: SecurityGroupDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubKeyPushTargetDataTypeOptions {
    applicationUri?: UAString;
    pushTargetFolder?: UAString[] | null;
    endpointUrl?: UAString;
    securityPolicyUri?: UAString;
    userTokenType?: UserTokenPolicyOptions;
    requestedKeyCount?: UInt16;
    retryInterval?: Double;
    pushTargetProperties?: KeyValuePairOptions[] | null;
    securityGroups?: UAString[] | null;
}
export declare class PubSubKeyPushTargetDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    applicationUri: UAString;
    pushTargetFolder: UAString[] | null;
    endpointUrl: UAString;
    securityPolicyUri: UAString;
    userTokenType: UserTokenPolicy;
    requestedKeyCount: UInt16;
    retryInterval: Double;
    pushTargetProperties: KeyValuePair[] | null;
    securityGroups: UAString[] | null;
    constructor(options?: PubSubKeyPushTargetDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubConfiguration2DataTypeOptions extends PubSubConfigurationDataTypeOptions {
    subscribedDataSets?: StandaloneSubscribedDataSetDataTypeOptions[] | null;
    dataSetClasses?: DataSetMetaDataTypeOptions[] | null;
    defaultSecurityKeyServices?: EndpointDescriptionOptions[] | null;
    securityGroups?: SecurityGroupDataTypeOptions[] | null;
    pubSubKeyPushTargets?: PubSubKeyPushTargetDataTypeOptions[] | null;
    configurationVersion?: UInt32;
    configurationProperties?: KeyValuePairOptions[] | null;
}
export declare class PubSubConfiguration2DataType extends PubSubConfigurationDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    subscribedDataSets: StandaloneSubscribedDataSetDataType[] | null;
    dataSetClasses: DataSetMetaDataType[] | null;
    defaultSecurityKeyServices: EndpointDescription[] | null;
    securityGroups: SecurityGroupDataType[] | null;
    pubSubKeyPushTargets: PubSubKeyPushTargetDataType[] | null;
    configurationVersion: UInt32;
    configurationProperties: KeyValuePair[] | null;
    constructor(options?: PubSubConfiguration2DataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum PubSubConfigurationRefMask {
    None = 0,
    ElementAdd = 1,
    ElementMatch = 2,
    ElementModify = 4,
    ElementRemove = 8,
    ReferenceWriter = 16,
    ReferenceReader = 32,
    ReferenceWriterGroup = 64,
    ReferenceReaderGroup = 128,
    ReferenceConnection = 256,
    ReferencePubDataset = 512,
    ReferenceSubDataset = 1024,
    ReferenceSecurityGroup = 2048,
    ReferencePushTarget = 4096
}
export declare const _enumerationPubSubConfigurationRefMask: Enum;
export interface PubSubConfigurationRefDataTypeOptions {
    configurationMask?: PubSubConfigurationRefMask;
    elementIndex?: UInt16;
    connectionIndex?: UInt16;
    groupIndex?: UInt16;
}
export declare class PubSubConfigurationRefDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    configurationMask: PubSubConfigurationRefMask;
    elementIndex: UInt16;
    connectionIndex: UInt16;
    groupIndex: UInt16;
    constructor(options?: PubSubConfigurationRefDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setConfigurationMask(value: any): PubSubConfigurationRefMask;
    get schema(): IStructuredTypeSchema;
}
export interface PubSubConfigurationValueDataTypeOptions {
    configurationElement?: PubSubConfigurationRefDataTypeOptions;
    name?: UAString;
    identifier?: (VariantLike | null);
}
export declare class PubSubConfigurationValueDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    configurationElement: PubSubConfigurationRefDataType;
    name: UAString;
    identifier: Variant;
    constructor(options?: PubSubConfigurationValueDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SubscriptionAcknowledgementOptions {
    subscriptionId?: UInt32;
    sequenceNumber?: UInt32;
}
export declare class SubscriptionAcknowledgement extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    subscriptionId: UInt32;
    sequenceNumber: UInt32;
    constructor(options?: SubscriptionAcknowledgementOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionAcknowledgements?: SubscriptionAcknowledgementOptions[] | null;
}
export declare class PublishRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionAcknowledgements: SubscriptionAcknowledgement[] | null;
    constructor(options?: PublishRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    subscriptionId?: UInt32;
    availableSequenceNumbers?: UInt32[] | null;
    moreNotifications?: UABoolean;
    notificationMessage?: NotificationMessageOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class PublishResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    subscriptionId: UInt32;
    availableSequenceNumbers: UInt32[] | null;
    moreNotifications: UABoolean;
    notificationMessage: NotificationMessage;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: PublishResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedDataSetSourceDataTypeOptions {
}
export declare class PublishedDataSetSourceDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: PublishedDataSetSourceDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedActionDataTypeOptions extends PublishedDataSetSourceDataTypeOptions {
    requestDataSetMetaData?: DataSetMetaDataTypeOptions;
    actionTargets?: ActionTargetDataTypeOptions[] | null;
}
export declare class PublishedActionDataType extends PublishedDataSetSourceDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestDataSetMetaData: DataSetMetaDataType;
    actionTargets: ActionTargetDataType[] | null;
    constructor(options?: PublishedActionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedActionMethodDataTypeOptions extends PublishedActionDataTypeOptions {
    actionMethods?: ActionMethodDataTypeOptions[] | null;
}
export declare class PublishedActionMethodDataType extends PublishedActionDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    actionMethods: ActionMethodDataType[] | null;
    constructor(options?: PublishedActionMethodDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedVariableDataTypeOptions {
    publishedVariable?: (NodeIdLike | null);
    attributeId?: UInt32;
    samplingIntervalHint?: Double;
    deadbandType?: UInt32;
    deadbandValue?: Double;
    indexRange?: NumericRange;
    substituteValue?: (VariantLike | null);
    metaDataProperties?: (QualifiedNameLike | null)[] | null;
}
export declare class PublishedVariableDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    publishedVariable: NodeId;
    attributeId: UInt32;
    samplingIntervalHint: Double;
    deadbandType: UInt32;
    deadbandValue: Double;
    indexRange: NumericRange;
    substituteValue: Variant;
    metaDataProperties: QualifiedName[] | null;
    constructor(options?: PublishedVariableDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedDataItemsDataTypeOptions extends PublishedDataSetSourceDataTypeOptions {
    publishedData?: PublishedVariableDataTypeOptions[] | null;
}
export declare class PublishedDataItemsDataType extends PublishedDataSetSourceDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    publishedData: PublishedVariableDataType[] | null;
    constructor(options?: PublishedDataItemsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedDataSetCustomSourceDataTypeOptions extends PublishedDataSetSourceDataTypeOptions {
    cyclicDataSet?: UABoolean;
}
export declare class PublishedDataSetCustomSourceDataType extends PublishedDataSetSourceDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    cyclicDataSet: UABoolean;
    constructor(options?: PublishedDataSetCustomSourceDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface PublishedEventsDataTypeOptions extends PublishedDataSetSourceDataTypeOptions {
    eventNotifier?: (NodeIdLike | null);
    selectedFields?: SimpleAttributeOperandOptions[] | null;
    filter?: ContentFilterOptions;
}
export declare class PublishedEventsDataType extends PublishedDataSetSourceDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    eventNotifier: NodeId;
    selectedFields: SimpleAttributeOperand[] | null;
    filter: ContentFilter;
    constructor(options?: PublishedEventsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QosDataTypeOptions {
}
export declare class QosDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: QosDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QuantityDimensionOptions {
    massExponent?: SByte;
    lengthExponent?: SByte;
    timeExponent?: SByte;
    electricCurrentExponent?: SByte;
    amountOfSubstanceExponent?: SByte;
    luminousIntensityExponent?: SByte;
    absoluteTemperatureExponent?: SByte;
    dimensionlessExponent?: SByte;
}
export declare class QuantityDimension extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    massExponent: SByte;
    lengthExponent: SByte;
    timeExponent: SByte;
    electricCurrentExponent: SByte;
    amountOfSubstanceExponent: SByte;
    luminousIntensityExponent: SByte;
    absoluteTemperatureExponent: SByte;
    dimensionlessExponent: SByte;
    constructor(options?: QuantityDimensionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryDataSetOptions {
    nodeId?: ExpandedNodeId;
    typeDefinitionNode?: ExpandedNodeId;
    values?: (VariantLike | null)[] | null;
}
export declare class QueryDataSet extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: ExpandedNodeId;
    typeDefinitionNode: ExpandedNodeId;
    values: Variant[] | null;
    constructor(options?: QueryDataSetOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryFirstRequestOptions {
    requestHeader?: RequestHeaderOptions;
    view?: ViewDescriptionOptions;
    nodeTypes?: NodeTypeDescriptionOptions[] | null;
    filter?: ContentFilterOptions;
    maxDataSetsToReturn?: UInt32;
    maxReferencesToReturn?: UInt32;
}
export declare class QueryFirstRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    view: ViewDescription;
    nodeTypes: NodeTypeDescription[] | null;
    filter: ContentFilter;
    maxDataSetsToReturn: UInt32;
    maxReferencesToReturn: UInt32;
    constructor(options?: QueryFirstRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryFirstResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    queryDataSets?: QueryDataSetOptions[] | null;
    continuationPoint?: ByteString;
    parsingResults?: ParsingResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
    filterResult?: ContentFilterResultOptions;
}
export declare class QueryFirstResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    queryDataSets: QueryDataSet[] | null;
    continuationPoint: ByteString;
    parsingResults: ParsingResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    filterResult: ContentFilterResult;
    constructor(options?: QueryFirstResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryNextRequestOptions {
    requestHeader?: RequestHeaderOptions;
    releaseContinuationPoint?: UABoolean;
    continuationPoint?: ByteString;
}
export declare class QueryNextRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    releaseContinuationPoint: UABoolean;
    continuationPoint: ByteString;
    constructor(options?: QueryNextRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface QueryNextResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    queryDataSets?: QueryDataSetOptions[] | null;
    revisedContinuationPoint?: ByteString;
}
export declare class QueryNextResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    queryDataSets: QueryDataSet[] | null;
    revisedContinuationPoint: ByteString;
    constructor(options?: QueryNextResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RationalNumberOptions {
    numerator?: Int32;
    denominator?: UInt32;
}
export declare class RationalNumber extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    numerator: Int32;
    denominator: UInt32;
    constructor(options?: RationalNumberOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadAnnotationDataDetailsOptions extends HistoryReadDetailsOptions {
    reqTimes?: DateTime[] | null;
}
export declare class ReadAnnotationDataDetails extends HistoryReadDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    reqTimes: DateTime[] | null;
    constructor(options?: ReadAnnotationDataDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadAtTimeDetailsOptions extends HistoryReadDetailsOptions {
    reqTimes?: DateTime[] | null;
    useSimpleBounds?: UABoolean;
}
export declare class ReadAtTimeDetails extends HistoryReadDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    reqTimes: DateTime[] | null;
    useSimpleBounds: UABoolean;
    constructor(options?: ReadAtTimeDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadEventDetailsOptions extends HistoryReadDetailsOptions {
    numValuesPerNode?: UInt32;
    startTime?: DateTime;
    endTime?: DateTime;
    filter?: EventFilterOptions;
}
export declare class ReadEventDetails extends HistoryReadDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    numValuesPerNode: UInt32;
    startTime: DateTime;
    endTime: DateTime;
    filter: EventFilter;
    constructor(options?: ReadEventDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadEventDetails2Options extends ReadEventDetailsOptions {
    readModified?: UABoolean;
}
export declare class ReadEventDetails2 extends ReadEventDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    readModified: UABoolean;
    constructor(options?: ReadEventDetails2Options | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum SortOrderType {
    Ascending = 0,
    Descending = 1,
    Invalid = 4294967295
}
export declare const _enumerationSortOrderType: Enum;
export interface SortRuleElementOptions {
    sortOrder?: SortOrderType;
    eventField?: SimpleAttributeOperandOptions;
}
export declare class SortRuleElement extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sortOrder: SortOrderType;
    eventField: SimpleAttributeOperand;
    constructor(options?: SortRuleElementOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setSortOrder(value: any): SortOrderType;
    get schema(): IStructuredTypeSchema;
}
export interface ReadEventDetailsSortedOptions extends ReadEventDetailsOptions {
    sortClause?: SortRuleElementOptions[] | null;
}
export declare class ReadEventDetailsSorted extends ReadEventDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sortClause: SortRuleElement[] | null;
    constructor(options?: ReadEventDetailsSortedOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadProcessedDetailsOptions extends HistoryReadDetailsOptions {
    startTime?: DateTime;
    endTime?: DateTime;
    processingInterval?: Double;
    aggregateType?: (NodeIdLike | null)[] | null;
    aggregateConfiguration?: AggregateConfigurationOptions;
}
export declare class ReadProcessedDetails extends HistoryReadDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    startTime: DateTime;
    endTime: DateTime;
    processingInterval: Double;
    aggregateType: NodeId[] | null;
    aggregateConfiguration: AggregateConfiguration;
    constructor(options?: ReadProcessedDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadRawModifiedDetailsOptions extends HistoryReadDetailsOptions {
    isReadModified?: UABoolean;
    startTime?: DateTime;
    endTime?: DateTime;
    numValuesPerNode?: UInt32;
    returnBounds?: UABoolean;
}
export declare class ReadRawModifiedDetails extends HistoryReadDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    isReadModified: UABoolean;
    startTime: DateTime;
    endTime: DateTime;
    numValuesPerNode: UInt32;
    returnBounds: UABoolean;
    constructor(options?: ReadRawModifiedDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReadRequestOptions {
    requestHeader?: RequestHeaderOptions;
    maxAge?: Double;
    timestampsToReturn?: TimestampsToReturn;
    nodesToRead?: ReadValueIdOptions[] | null;
}
export declare class ReadRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    maxAge: Double;
    timestampsToReturn: TimestampsToReturn;
    nodesToRead: ReadValueId[] | null;
    constructor(options?: ReadRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setTimestampsToReturn(value: any): TimestampsToReturn;
    get schema(): IStructuredTypeSchema;
}
export interface ReadResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: (DataValueLike | null)[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class ReadResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: DataValue[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: ReadResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReaderGroupMessageDataTypeOptions {
}
export declare class ReaderGroupMessageDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: ReaderGroupMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReaderGroupTransportDataTypeOptions {
}
export declare class ReaderGroupTransportDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: ReaderGroupTransportDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReceiveQosDataTypeOptions extends QosDataTypeOptions {
}
export declare class ReceiveQosDataType extends QosDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: ReceiveQosDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReceiveQosPriorityDataTypeOptions extends ReceiveQosDataTypeOptions {
    priorityLabel?: UAString;
}
export declare class ReceiveQosPriorityDataType extends ReceiveQosDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    priorityLabel: UAString;
    constructor(options?: ReceiveQosPriorityDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum ServerState {
    Running = 0,
    Failed = 1,
    NoConfiguration = 2,
    Suspended = 3,
    Shutdown = 4,
    Test = 5,
    CommunicationFault = 6,
    Unknown = 7,
    Invalid = 4294967295
}
export declare const _enumerationServerState: Enum;
export interface RedundantServerDataTypeOptions {
    serverId?: UAString;
    serviceLevel?: Byte;
    serverState?: ServerState;
}
export declare class RedundantServerDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    serverId: UAString;
    serviceLevel: Byte;
    serverState: ServerState;
    constructor(options?: RedundantServerDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setServerState(value: any): ServerState;
    get schema(): IStructuredTypeSchema;
}
export interface ReferenceDescriptionDataTypeOptions {
    sourceNode?: (NodeIdLike | null);
    referenceType?: (NodeIdLike | null);
    isForward?: UABoolean;
    targetNode?: ExpandedNodeId;
}
export declare class ReferenceDescriptionDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sourceNode: NodeId;
    referenceType: NodeId;
    isForward: UABoolean;
    targetNode: ExpandedNodeId;
    constructor(options?: ReferenceDescriptionDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReferenceListEntryDataTypeOptions {
    referenceType?: (NodeIdLike | null);
    isForward?: UABoolean;
    targetNode?: ExpandedNodeId;
}
export declare class ReferenceListEntryDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    referenceType: NodeId;
    isForward: UABoolean;
    targetNode: ExpandedNodeId;
    constructor(options?: ReferenceListEntryDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ReferenceTypeAttributesOptions extends NodeAttributesOptions {
    isAbstract?: UABoolean;
    symmetric?: UABoolean;
    inverseName?: (LocalizedTextLike | null);
}
export declare class ReferenceTypeAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    isAbstract: UABoolean;
    symmetric: UABoolean;
    inverseName: LocalizedText;
    constructor(options?: ReferenceTypeAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterNodesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    nodesToRegister?: (NodeIdLike | null)[] | null;
}
export declare class RegisterNodesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    nodesToRegister: NodeId[] | null;
    constructor(options?: RegisterNodesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterNodesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    registeredNodeIds?: (NodeIdLike | null)[] | null;
}
export declare class RegisterNodesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    registeredNodeIds: NodeId[] | null;
    constructor(options?: RegisterNodesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisteredServerOptions {
    serverUri?: UAString;
    productUri?: UAString;
    serverNames?: (LocalizedTextLike | null)[] | null;
    serverType?: ApplicationType;
    gatewayServerUri?: UAString;
    discoveryUrls?: UAString[] | null;
    semaphoreFilePath?: UAString;
    isOnline?: UABoolean;
}
export declare class RegisteredServer extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    serverUri: UAString;
    productUri: UAString;
    serverNames: LocalizedText[] | null;
    serverType: ApplicationType;
    gatewayServerUri: UAString;
    discoveryUrls: UAString[] | null;
    semaphoreFilePath: UAString;
    isOnline: UABoolean;
    constructor(options?: RegisteredServerOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setServerType(value: any): ApplicationType;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterServer2RequestOptions {
    requestHeader?: RequestHeaderOptions;
    server?: RegisteredServerOptions;
    discoveryConfiguration?: (ExtensionObject | null)[] | null;
}
export declare class RegisterServer2Request extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    server: RegisteredServer;
    discoveryConfiguration: (ExtensionObject | null)[] | null;
    constructor(options?: RegisterServer2RequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterServer2ResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    configurationResults?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class RegisterServer2Response extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    configurationResults: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: RegisterServer2ResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterServerRequestOptions {
    requestHeader?: RequestHeaderOptions;
    server?: RegisteredServerOptions;
}
export declare class RegisterServerRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    server: RegisteredServer;
    constructor(options?: RegisterServerRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RegisterServerResponseOptions {
    responseHeader?: ResponseHeaderOptions;
}
export declare class RegisterServerResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    constructor(options?: RegisterServerResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RepublishRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    retransmitSequenceNumber?: UInt32;
}
export declare class RepublishRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    retransmitSequenceNumber: UInt32;
    constructor(options?: RepublishRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface RepublishResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    notificationMessage?: NotificationMessageOptions;
}
export declare class RepublishResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    notificationMessage: NotificationMessage;
    constructor(options?: RepublishResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SamplingIntervalDiagnosticsDataTypeOptions {
    samplingInterval?: Double;
    monitoredItemCount?: UInt32;
    maxMonitoredItemCount?: UInt32;
    disabledMonitoredItemCount?: UInt32;
}
export declare class SamplingIntervalDiagnosticsDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    samplingInterval: Double;
    monitoredItemCount: UInt32;
    maxMonitoredItemCount: UInt32;
    disabledMonitoredItemCount: UInt32;
    constructor(options?: SamplingIntervalDiagnosticsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SemanticChangeStructureDataTypeOptions {
    affected?: (NodeIdLike | null);
    affectedType?: (NodeIdLike | null);
}
export declare class SemanticChangeStructureDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    affected: NodeId;
    affectedType: NodeId;
    constructor(options?: SemanticChangeStructureDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ServerDiagnosticsSummaryDataTypeOptions {
    serverViewCount?: UInt32;
    currentSessionCount?: UInt32;
    cumulatedSessionCount?: UInt32;
    securityRejectedSessionCount?: UInt32;
    rejectedSessionCount?: UInt32;
    sessionTimeoutCount?: UInt32;
    sessionAbortCount?: UInt32;
    currentSubscriptionCount?: UInt32;
    cumulatedSubscriptionCount?: UInt32;
    publishingIntervalCount?: UInt32;
    securityRejectedRequestsCount?: UInt32;
    rejectedRequestsCount?: UInt32;
}
export declare class ServerDiagnosticsSummaryDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    serverViewCount: UInt32;
    currentSessionCount: UInt32;
    cumulatedSessionCount: UInt32;
    securityRejectedSessionCount: UInt32;
    rejectedSessionCount: UInt32;
    sessionTimeoutCount: UInt32;
    sessionAbortCount: UInt32;
    currentSubscriptionCount: UInt32;
    cumulatedSubscriptionCount: UInt32;
    publishingIntervalCount: UInt32;
    securityRejectedRequestsCount: UInt32;
    rejectedRequestsCount: UInt32;
    constructor(options?: ServerDiagnosticsSummaryDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ServerStatusDataTypeOptions {
    startTime?: DateTime;
    currentTime?: DateTime;
    state?: ServerState;
    buildInfo?: BuildInfoOptions;
    secondsTillShutdown?: UInt32;
    shutdownReason?: (LocalizedTextLike | null);
}
export declare class ServerStatusDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    startTime: DateTime;
    currentTime: DateTime;
    state: ServerState;
    buildInfo: BuildInfo;
    secondsTillShutdown: UInt32;
    shutdownReason: LocalizedText;
    constructor(options?: ServerStatusDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setState(value: any): ServerState;
    get schema(): IStructuredTypeSchema;
}
export interface ServiceCounterDataTypeOptions {
    totalCount?: UInt32;
    errorCount?: UInt32;
}
export declare class ServiceCounterDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    totalCount: UInt32;
    errorCount: UInt32;
    constructor(options?: ServiceCounterDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ServiceFaultOptions {
    responseHeader?: ResponseHeaderOptions;
}
export declare class ServiceFault extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    constructor(options?: ServiceFaultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SessionDiagnosticsDataTypeOptions {
    sessionId?: (NodeIdLike | null);
    sessionName?: UAString;
    clientDescription?: ApplicationDescriptionOptions;
    serverUri?: UAString;
    endpointUrl?: UAString;
    localeIds?: UAString[] | null;
    actualSessionTimeout?: Double;
    maxResponseMessageSize?: UInt32;
    clientConnectionTime?: DateTime;
    clientLastContactTime?: DateTime;
    currentSubscriptionsCount?: UInt32;
    currentMonitoredItemsCount?: UInt32;
    currentPublishRequestsInQueue?: UInt32;
    totalRequestCount?: ServiceCounterDataTypeOptions;
    unauthorizedRequestCount?: UInt32;
    readCount?: ServiceCounterDataTypeOptions;
    historyReadCount?: ServiceCounterDataTypeOptions;
    writeCount?: ServiceCounterDataTypeOptions;
    historyUpdateCount?: ServiceCounterDataTypeOptions;
    callCount?: ServiceCounterDataTypeOptions;
    createMonitoredItemsCount?: ServiceCounterDataTypeOptions;
    modifyMonitoredItemsCount?: ServiceCounterDataTypeOptions;
    setMonitoringModeCount?: ServiceCounterDataTypeOptions;
    setTriggeringCount?: ServiceCounterDataTypeOptions;
    deleteMonitoredItemsCount?: ServiceCounterDataTypeOptions;
    createSubscriptionCount?: ServiceCounterDataTypeOptions;
    modifySubscriptionCount?: ServiceCounterDataTypeOptions;
    setPublishingModeCount?: ServiceCounterDataTypeOptions;
    publishCount?: ServiceCounterDataTypeOptions;
    republishCount?: ServiceCounterDataTypeOptions;
    transferSubscriptionsCount?: ServiceCounterDataTypeOptions;
    deleteSubscriptionsCount?: ServiceCounterDataTypeOptions;
    addNodesCount?: ServiceCounterDataTypeOptions;
    addReferencesCount?: ServiceCounterDataTypeOptions;
    deleteNodesCount?: ServiceCounterDataTypeOptions;
    deleteReferencesCount?: ServiceCounterDataTypeOptions;
    browseCount?: ServiceCounterDataTypeOptions;
    browseNextCount?: ServiceCounterDataTypeOptions;
    translateBrowsePathsToNodeIdsCount?: ServiceCounterDataTypeOptions;
    queryFirstCount?: ServiceCounterDataTypeOptions;
    queryNextCount?: ServiceCounterDataTypeOptions;
    registerNodesCount?: ServiceCounterDataTypeOptions;
    unregisterNodesCount?: ServiceCounterDataTypeOptions;
}
export declare class SessionDiagnosticsDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sessionId: NodeId;
    sessionName: UAString;
    clientDescription: ApplicationDescription;
    serverUri: UAString;
    endpointUrl: UAString;
    localeIds: UAString[] | null;
    actualSessionTimeout: Double;
    maxResponseMessageSize: UInt32;
    clientConnectionTime: DateTime;
    clientLastContactTime: DateTime;
    currentSubscriptionsCount: UInt32;
    currentMonitoredItemsCount: UInt32;
    currentPublishRequestsInQueue: UInt32;
    totalRequestCount: ServiceCounterDataType;
    unauthorizedRequestCount: UInt32;
    readCount: ServiceCounterDataType;
    historyReadCount: ServiceCounterDataType;
    writeCount: ServiceCounterDataType;
    historyUpdateCount: ServiceCounterDataType;
    callCount: ServiceCounterDataType;
    createMonitoredItemsCount: ServiceCounterDataType;
    modifyMonitoredItemsCount: ServiceCounterDataType;
    setMonitoringModeCount: ServiceCounterDataType;
    setTriggeringCount: ServiceCounterDataType;
    deleteMonitoredItemsCount: ServiceCounterDataType;
    createSubscriptionCount: ServiceCounterDataType;
    modifySubscriptionCount: ServiceCounterDataType;
    setPublishingModeCount: ServiceCounterDataType;
    publishCount: ServiceCounterDataType;
    republishCount: ServiceCounterDataType;
    transferSubscriptionsCount: ServiceCounterDataType;
    deleteSubscriptionsCount: ServiceCounterDataType;
    addNodesCount: ServiceCounterDataType;
    addReferencesCount: ServiceCounterDataType;
    deleteNodesCount: ServiceCounterDataType;
    deleteReferencesCount: ServiceCounterDataType;
    browseCount: ServiceCounterDataType;
    browseNextCount: ServiceCounterDataType;
    translateBrowsePathsToNodeIdsCount: ServiceCounterDataType;
    queryFirstCount: ServiceCounterDataType;
    queryNextCount: ServiceCounterDataType;
    registerNodesCount: ServiceCounterDataType;
    unregisterNodesCount: ServiceCounterDataType;
    constructor(options?: SessionDiagnosticsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SessionSecurityDiagnosticsDataTypeOptions {
    sessionId?: (NodeIdLike | null);
    clientUserIdOfSession?: UAString;
    clientUserIdHistory?: UAString[] | null;
    authenticationMechanism?: UAString;
    encoding?: UAString;
    transportProtocol?: UAString;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: UAString;
    clientCertificate?: ByteString;
}
export declare class SessionSecurityDiagnosticsDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sessionId: NodeId;
    clientUserIdOfSession: UAString;
    clientUserIdHistory: UAString[] | null;
    authenticationMechanism: UAString;
    encoding: UAString;
    transportProtocol: UAString;
    securityMode: MessageSecurityMode;
    securityPolicyUri: UAString;
    clientCertificate: ByteString;
    constructor(options?: SessionSecurityDiagnosticsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setSecurityMode(value: any): MessageSecurityMode;
    get schema(): IStructuredTypeSchema;
}
export interface SessionlessInvokeRequestTypeOptions {
    urisVersion?: UInt32;
    namespaceUris?: UAString[] | null;
    serverUris?: UAString[] | null;
    localeIds?: UAString[] | null;
    serviceId?: UInt32;
}
export declare class SessionlessInvokeRequestType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    urisVersion: UInt32;
    namespaceUris: UAString[] | null;
    serverUris: UAString[] | null;
    localeIds: UAString[] | null;
    serviceId: UInt32;
    constructor(options?: SessionlessInvokeRequestTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SessionlessInvokeResponseTypeOptions {
    namespaceUris?: UAString[] | null;
    serverUris?: UAString[] | null;
    serviceId?: UInt32;
}
export declare class SessionlessInvokeResponseType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    namespaceUris: UAString[] | null;
    serverUris: UAString[] | null;
    serviceId: UInt32;
    constructor(options?: SessionlessInvokeResponseTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SetMonitoringModeRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    monitoringMode?: MonitoringMode;
    monitoredItemIds?: UInt32[] | null;
}
export declare class SetMonitoringModeRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    monitoringMode: MonitoringMode;
    monitoredItemIds: UInt32[] | null;
    constructor(options?: SetMonitoringModeRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setMonitoringMode(value: any): MonitoringMode;
    get schema(): IStructuredTypeSchema;
}
export interface SetMonitoringModeResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class SetMonitoringModeResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: SetMonitoringModeResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SetPublishingModeRequestOptions {
    requestHeader?: RequestHeaderOptions;
    publishingEnabled?: UABoolean;
    subscriptionIds?: UInt32[] | null;
}
export declare class SetPublishingModeRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    publishingEnabled: UABoolean;
    subscriptionIds: UInt32[] | null;
    constructor(options?: SetPublishingModeRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SetPublishingModeResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class SetPublishingModeResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: SetPublishingModeResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SetTriggeringRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionId?: UInt32;
    triggeringItemId?: UInt32;
    linksToAdd?: UInt32[] | null;
    linksToRemove?: UInt32[] | null;
}
export declare class SetTriggeringRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionId: UInt32;
    triggeringItemId: UInt32;
    linksToAdd: UInt32[] | null;
    linksToRemove: UInt32[] | null;
    constructor(options?: SetTriggeringRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SetTriggeringResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    addResults?: StatusCode[] | null;
    addDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
    removeResults?: StatusCode[] | null;
    removeDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class SetTriggeringResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    addResults: StatusCode[] | null;
    addDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    removeResults: StatusCode[] | null;
    removeDiagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: SetTriggeringResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface StandaloneSubscribedDataSetRefDataTypeOptions extends SubscribedDataSetDataTypeOptions {
    dataSetName?: UAString;
}
export declare class StandaloneSubscribedDataSetRefDataType extends SubscribedDataSetDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetName: UAString;
    constructor(options?: StandaloneSubscribedDataSetRefDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface StatusChangeNotificationOptions extends NotificationDataOptions {
    status?: StatusCode;
    diagnosticInfo?: (DiagnosticInfo | null);
}
export declare class StatusChangeNotification extends NotificationData {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    status: StatusCode;
    diagnosticInfo: (DiagnosticInfo | null);
    constructor(options?: StatusChangeNotificationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SubscribedDataSetMirrorDataTypeOptions extends SubscribedDataSetDataTypeOptions {
    parentNodeName?: UAString;
    rolePermissions?: RolePermissionTypeOptions[] | null;
}
export declare class SubscribedDataSetMirrorDataType extends SubscribedDataSetDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    parentNodeName: UAString;
    rolePermissions: RolePermissionType[] | null;
    constructor(options?: SubscribedDataSetMirrorDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface SubscriptionDiagnosticsDataTypeOptions {
    sessionId?: (NodeIdLike | null);
    subscriptionId?: UInt32;
    priority?: Byte;
    publishingInterval?: Double;
    maxKeepAliveCount?: UInt32;
    maxLifetimeCount?: UInt32;
    maxNotificationsPerPublish?: UInt32;
    publishingEnabled?: UABoolean;
    modifyCount?: UInt32;
    enableCount?: UInt32;
    disableCount?: UInt32;
    republishRequestCount?: UInt32;
    republishMessageRequestCount?: UInt32;
    republishMessageCount?: UInt32;
    transferRequestCount?: UInt32;
    transferredToAltClientCount?: UInt32;
    transferredToSameClientCount?: UInt32;
    publishRequestCount?: UInt32;
    dataChangeNotificationsCount?: UInt32;
    eventNotificationsCount?: UInt32;
    notificationsCount?: UInt32;
    latePublishRequestCount?: UInt32;
    currentKeepAliveCount?: UInt32;
    currentLifetimeCount?: UInt32;
    unacknowledgedMessageCount?: UInt32;
    discardedMessageCount?: UInt32;
    monitoredItemCount?: UInt32;
    disabledMonitoredItemCount?: UInt32;
    monitoringQueueOverflowCount?: UInt32;
    nextSequenceNumber?: UInt32;
    eventQueueOverflowCount?: UInt32;
}
export declare class SubscriptionDiagnosticsDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    sessionId: NodeId;
    subscriptionId: UInt32;
    priority: Byte;
    publishingInterval: Double;
    maxKeepAliveCount: UInt32;
    maxLifetimeCount: UInt32;
    maxNotificationsPerPublish: UInt32;
    publishingEnabled: UABoolean;
    modifyCount: UInt32;
    enableCount: UInt32;
    disableCount: UInt32;
    republishRequestCount: UInt32;
    republishMessageRequestCount: UInt32;
    republishMessageCount: UInt32;
    transferRequestCount: UInt32;
    transferredToAltClientCount: UInt32;
    transferredToSameClientCount: UInt32;
    publishRequestCount: UInt32;
    dataChangeNotificationsCount: UInt32;
    eventNotificationsCount: UInt32;
    notificationsCount: UInt32;
    latePublishRequestCount: UInt32;
    currentKeepAliveCount: UInt32;
    currentLifetimeCount: UInt32;
    unacknowledgedMessageCount: UInt32;
    discardedMessageCount: UInt32;
    monitoredItemCount: UInt32;
    disabledMonitoredItemCount: UInt32;
    monitoringQueueOverflowCount: UInt32;
    nextSequenceNumber: UInt32;
    eventQueueOverflowCount: UInt32;
    constructor(options?: SubscriptionDiagnosticsDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TargetVariablesDataTypeOptions extends SubscribedDataSetDataTypeOptions {
    targetVariables?: FieldTargetDataTypeOptions[] | null;
}
export declare class TargetVariablesDataType extends SubscribedDataSetDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    targetVariables: FieldTargetDataType[] | null;
    constructor(options?: TargetVariablesDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ThreeDCartesianCoordinatesOptions extends CartesianCoordinatesOptions {
    x?: Double;
    y?: Double;
    z?: Double;
}
export declare class ThreeDCartesianCoordinates extends CartesianCoordinates {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    x: Double;
    y: Double;
    z: Double;
    constructor(options?: ThreeDCartesianCoordinatesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ThreeDOrientationOptions extends OrientationOptions {
    a?: Double;
    b?: Double;
    c?: Double;
}
export declare class ThreeDOrientation extends Orientation {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    a: Double;
    b: Double;
    c: Double;
    constructor(options?: ThreeDOrientationOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ThreeDFrameOptions extends FrameOptions {
    cartesianCoordinates?: ThreeDCartesianCoordinatesOptions;
    orientation?: ThreeDOrientationOptions;
}
export declare class ThreeDFrame extends Frame {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    cartesianCoordinates: ThreeDCartesianCoordinates;
    orientation: ThreeDOrientation;
    constructor(options?: ThreeDFrameOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface VectorOptions {
}
export declare class Vector extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: VectorOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ThreeDVectorOptions extends VectorOptions {
    x?: Double;
    y?: Double;
    z?: Double;
}
export declare class ThreeDVector extends Vector {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    x: Double;
    y: Double;
    z: Double;
    constructor(options?: ThreeDVectorOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TimeZoneDataTypeOptions {
    offset?: Int16;
    daylightSavingInOffset?: UABoolean;
}
export declare class TimeZoneDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    offset: Int16;
    daylightSavingInOffset: UABoolean;
    constructor(options?: TimeZoneDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransactionErrorTypeOptions {
    targetId?: (NodeIdLike | null);
    error?: StatusCode;
    message?: (LocalizedTextLike | null);
}
export declare class TransactionErrorType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    targetId: NodeId;
    error: StatusCode;
    message: LocalizedText;
    constructor(options?: TransactionErrorTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransferResultOptions {
    statusCode?: StatusCode;
    availableSequenceNumbers?: UInt32[] | null;
}
export declare class TransferResult extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    statusCode: StatusCode;
    availableSequenceNumbers: UInt32[] | null;
    constructor(options?: TransferResultOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransferSubscriptionsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    subscriptionIds?: UInt32[] | null;
    sendInitialValues?: UABoolean;
}
export declare class TransferSubscriptionsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    subscriptionIds: UInt32[] | null;
    sendInitialValues: UABoolean;
    constructor(options?: TransferSubscriptionsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransferSubscriptionsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: TransferResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class TransferSubscriptionsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: TransferResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: TransferSubscriptionsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TranslateBrowsePathsToNodeIdsRequestOptions {
    requestHeader?: RequestHeaderOptions;
    browsePaths?: BrowsePathOptions[] | null;
}
export declare class TranslateBrowsePathsToNodeIdsRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    browsePaths: BrowsePath[] | null;
    constructor(options?: TranslateBrowsePathsToNodeIdsRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TranslateBrowsePathsToNodeIdsResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: BrowsePathResultOptions[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class TranslateBrowsePathsToNodeIdsResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: BrowsePathResult[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: TranslateBrowsePathsToNodeIdsResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransmitQosDataTypeOptions extends QosDataTypeOptions {
}
export declare class TransmitQosDataType extends QosDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: TransmitQosDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TransmitQosPriorityDataTypeOptions extends TransmitQosDataTypeOptions {
    priorityLabel?: UAString;
}
export declare class TransmitQosPriorityDataType extends TransmitQosDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    priorityLabel: UAString;
    constructor(options?: TransmitQosPriorityDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface TrustListDataTypeOptions {
    specifiedLists?: UInt32;
    trustedCertificates?: ByteString[] | null;
    trustedCrls?: ByteString[] | null;
    issuerCertificates?: ByteString[] | null;
    issuerCrls?: ByteString[] | null;
}
export declare class TrustListDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    specifiedLists: UInt32;
    trustedCertificates: ByteString[] | null;
    trustedCrls: ByteString[] | null;
    issuerCertificates: ByteString[] | null;
    issuerCrls: ByteString[] | null;
    constructor(options?: TrustListDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface UABinaryFileDataTypeOptions extends DataTypeSchemaHeaderOptions {
    schemaLocation?: UAString;
    fileHeader?: KeyValuePairOptions[] | null;
    body?: (VariantLike | null);
}
export declare class UABinaryFileDataType extends DataTypeSchemaHeader {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    schemaLocation: UAString;
    fileHeader: KeyValuePair[] | null;
    body: Variant;
    constructor(options?: UABinaryFileDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum UadpNetworkMessageContentMask {
    None = 0,
    PublisherId = 1,
    GroupHeader = 2,
    WriterGroupId = 4,
    GroupVersion = 8,
    NetworkMessageNumber = 16,
    SequenceNumber = 32,
    PayloadHeader = 64,
    Timestamp = 128,
    PicoSeconds = 256,
    DataSetClassId = 512,
    PromotedFields = 1024
}
export declare const _enumerationUadpNetworkMessageContentMask: Enum;
export declare enum UadpDataSetMessageContentMask {
    None = 0,
    Timestamp = 1,
    PicoSeconds = 2,
    Status = 4,
    MajorVersion = 8,
    MinorVersion = 16,
    SequenceNumber = 32
}
export declare const _enumerationUadpDataSetMessageContentMask: Enum;
export interface UadpDataSetReaderMessageDataTypeOptions extends DataSetReaderMessageDataTypeOptions {
    groupVersion?: UInt32;
    networkMessageNumber?: UInt16;
    dataSetOffset?: UInt16;
    dataSetClassId?: Guid;
    networkMessageContentMask?: UadpNetworkMessageContentMask;
    dataSetMessageContentMask?: UadpDataSetMessageContentMask;
    publishingInterval?: Double;
    receiveOffset?: Double;
    processingOffset?: Double;
}
export declare class UadpDataSetReaderMessageDataType extends DataSetReaderMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    groupVersion: UInt32;
    networkMessageNumber: UInt16;
    dataSetOffset: UInt16;
    dataSetClassId: Guid;
    networkMessageContentMask: UadpNetworkMessageContentMask;
    dataSetMessageContentMask: UadpDataSetMessageContentMask;
    publishingInterval: Double;
    receiveOffset: Double;
    processingOffset: Double;
    constructor(options?: UadpDataSetReaderMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setNetworkMessageContentMask(value: any): UadpNetworkMessageContentMask;
    setDataSetMessageContentMask(value: any): UadpDataSetMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface UadpDataSetWriterMessageDataTypeOptions extends DataSetWriterMessageDataTypeOptions {
    dataSetMessageContentMask?: UadpDataSetMessageContentMask;
    configuredSize?: UInt16;
    networkMessageNumber?: UInt16;
    dataSetOffset?: UInt16;
}
export declare class UadpDataSetWriterMessageDataType extends DataSetWriterMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    dataSetMessageContentMask: UadpDataSetMessageContentMask;
    configuredSize: UInt16;
    networkMessageNumber: UInt16;
    dataSetOffset: UInt16;
    constructor(options?: UadpDataSetWriterMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setDataSetMessageContentMask(value: any): UadpDataSetMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export declare enum DataSetOrderingType {
    Undefined = 0,
    AscendingWriterId = 1,
    AscendingWriterIdSingle = 2,
    Invalid = 4294967295
}
export declare const _enumerationDataSetOrderingType: Enum;
export interface UadpWriterGroupMessageDataTypeOptions extends WriterGroupMessageDataTypeOptions {
    groupVersion?: UInt32;
    dataSetOrdering?: DataSetOrderingType;
    networkMessageContentMask?: UadpNetworkMessageContentMask;
    samplingOffset?: Double;
    publishingOffset?: Double[] | null;
}
export declare class UadpWriterGroupMessageDataType extends WriterGroupMessageDataType {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    groupVersion: UInt32;
    dataSetOrdering: DataSetOrderingType;
    networkMessageContentMask: UadpNetworkMessageContentMask;
    samplingOffset: Double;
    publishingOffset: Double[] | null;
    constructor(options?: UadpWriterGroupMessageDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setDataSetOrdering(value: any): DataSetOrderingType;
    setNetworkMessageContentMask(value: any): UadpNetworkMessageContentMask;
    get schema(): IStructuredTypeSchema;
}
export interface UnionOptions {
}
export declare class Union extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    constructor(options?: UnionOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface UnregisterNodesRequestOptions {
    requestHeader?: RequestHeaderOptions;
    nodesToUnregister?: (NodeIdLike | null)[] | null;
}
export declare class UnregisterNodesRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    nodesToUnregister: NodeId[] | null;
    constructor(options?: UnregisterNodesRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface UnregisterNodesResponseOptions {
    responseHeader?: ResponseHeaderOptions;
}
export declare class UnregisterNodesResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    constructor(options?: UnregisterNodesResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface UnsignedRationalNumberOptions {
    numerator?: UInt32;
    denominator?: UInt32;
}
export declare class UnsignedRationalNumber extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    numerator: UInt32;
    denominator: UInt32;
    constructor(options?: UnsignedRationalNumberOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export declare enum PerformUpdateType {
    Insert = 1,
    Replace = 2,
    Update = 3,
    Remove = 4,
    Invalid = 4294967295
}
export declare const _enumerationPerformUpdateType: Enum;
export interface UpdateDataDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    performInsertReplace?: PerformUpdateType;
    updateValues?: (DataValueLike | null)[] | null;
}
export declare class UpdateDataDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    performInsertReplace: PerformUpdateType;
    updateValues: DataValue[] | null;
    constructor(options?: UpdateDataDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setPerformInsertReplace(value: any): PerformUpdateType;
    get schema(): IStructuredTypeSchema;
}
export interface UpdateEventDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    performInsertReplace?: PerformUpdateType;
    filter?: EventFilterOptions;
    eventData?: HistoryEventFieldListOptions[] | null;
}
export declare class UpdateEventDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    performInsertReplace: PerformUpdateType;
    filter: EventFilter;
    eventData: HistoryEventFieldList[] | null;
    constructor(options?: UpdateEventDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setPerformInsertReplace(value: any): PerformUpdateType;
    get schema(): IStructuredTypeSchema;
}
export interface UpdateStructureDataDetailsOptions extends HistoryUpdateDetailsOptions {
    nodeId?: (NodeIdLike | null);
    performInsertReplace?: PerformUpdateType;
    updateValues?: (DataValueLike | null)[] | null;
}
export declare class UpdateStructureDataDetails extends HistoryUpdateDetails {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    performInsertReplace: PerformUpdateType;
    updateValues: DataValue[] | null;
    constructor(options?: UpdateStructureDataDetailsOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setPerformInsertReplace(value: any): PerformUpdateType;
    get schema(): IStructuredTypeSchema;
}
export declare enum UserConfigurationMask {
    None = 0,
    NoDelete = 1,
    Disabled = 2,
    NoChangeByUser = 4,
    MustChangePassword = 8
}
export declare const _enumerationUserConfigurationMask: Enum;
export interface UserManagementDataTypeOptions {
    userName?: UAString;
    userConfiguration?: UserConfigurationMask;
    description?: UAString;
}
export declare class UserManagementDataType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    userName: UAString;
    userConfiguration: UserConfigurationMask;
    description: UAString;
    constructor(options?: UserManagementDataTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    setUserConfiguration(value: any): UserConfigurationMask;
    get schema(): IStructuredTypeSchema;
}
export interface UserNameIdentityTokenOptions extends UserIdentityTokenOptions {
    userName?: UAString;
    password?: ByteString;
    encryptionAlgorithm?: UAString;
}
export declare class UserNameIdentityToken extends UserIdentityToken {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    userName: UAString;
    password: ByteString;
    encryptionAlgorithm: UAString;
    constructor(options?: UserNameIdentityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface VariableAttributesOptions extends NodeAttributesOptions {
    value?: (VariantLike | null);
    dataType?: (NodeIdLike | null);
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    accessLevel?: Byte;
    userAccessLevel?: Byte;
    minimumSamplingInterval?: Double;
    historizing?: UABoolean;
}
export declare class VariableAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    value: Variant;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[] | null;
    accessLevel: Byte;
    userAccessLevel: Byte;
    minimumSamplingInterval: Double;
    historizing: UABoolean;
    constructor(options?: VariableAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface VariableTypeAttributesOptions extends NodeAttributesOptions {
    value?: (VariantLike | null);
    dataType?: (NodeIdLike | null);
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    isAbstract?: UABoolean;
}
export declare class VariableTypeAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    value: Variant;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[] | null;
    isAbstract: UABoolean;
    constructor(options?: VariableTypeAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface ViewAttributesOptions extends NodeAttributesOptions {
    containsNoLoops?: UABoolean;
    eventNotifier?: Byte;
}
export declare class ViewAttributes extends NodeAttributes {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    containsNoLoops: UABoolean;
    eventNotifier: Byte;
    constructor(options?: ViewAttributesOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface WriteValueOptions {
    nodeId?: (NodeIdLike | null);
    attributeId?: UInt32;
    indexRange?: NumericRange;
    value?: (DataValueLike | null);
}
export declare class WriteValue extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    nodeId: NodeId;
    attributeId: UInt32;
    indexRange: NumericRange;
    value: DataValue;
    constructor(options?: WriteValueOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface WriteRequestOptions {
    requestHeader?: RequestHeaderOptions;
    nodesToWrite?: WriteValueOptions[] | null;
}
export declare class WriteRequest extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    requestHeader: RequestHeader;
    nodesToWrite: WriteValue[] | null;
    constructor(options?: WriteRequestOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface WriteResponseOptions {
    responseHeader?: ResponseHeaderOptions;
    results?: StatusCode[] | null;
    diagnosticInfos?: (DiagnosticInfo | null)[] | null;
}
export declare class WriteResponse extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    responseHeader: ResponseHeader;
    results: StatusCode[] | null;
    diagnosticInfos: (DiagnosticInfo | null)[] | null;
    constructor(options?: WriteResponseOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface X509IdentityTokenOptions extends UserIdentityTokenOptions {
    certificateData?: ByteString;
}
export declare class X509IdentityToken extends UserIdentityToken {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    certificateData: ByteString;
    constructor(options?: X509IdentityTokenOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
export interface XVTypeOptions {
    x?: Double;
    value?: Float;
}
export declare class XVType extends ExtensionObject {
    static get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static dataTypeNodeId: ExpandedNodeId;
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    static encodingDefaultJson: ExpandedNodeId;
    x: Double;
    value: Float;
    constructor(options?: XVTypeOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
}
