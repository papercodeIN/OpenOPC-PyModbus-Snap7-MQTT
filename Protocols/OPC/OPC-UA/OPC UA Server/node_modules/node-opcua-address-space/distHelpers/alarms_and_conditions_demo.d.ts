import { AddressSpace, UANonExclusiveLimitAlarmEx, UAExclusiveLimitAlarmEx, UAVariable } from "..";
export interface IAlarmTestData {
    tankLevel: UAVariable;
    tankLevelCondition: UAExclusiveLimitAlarmEx;
    tankLevel2: UAVariable;
    tankLevelCondition2: UANonExclusiveLimitAlarmEx;
    tankTripCondition: null;
}
export declare function construct_demo_alarm_in_address_space(test: IAlarmTestData, addressSpace: AddressSpace): void;
