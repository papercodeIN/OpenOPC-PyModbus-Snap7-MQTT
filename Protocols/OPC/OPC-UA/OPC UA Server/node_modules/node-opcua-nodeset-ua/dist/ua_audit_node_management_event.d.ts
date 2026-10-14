import { UAAuditEvent, UAAuditEvent_Base } from "./ua_audit_event";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |AuditNodeManagementEventType i=2090                         |
 * |isAbstract      |true                                                        |
 */
export type UAAuditNodeManagementEvent_Base = UAAuditEvent_Base;
export interface UAAuditNodeManagementEvent extends UAAuditEvent, UAAuditNodeManagementEvent_Base {
}
