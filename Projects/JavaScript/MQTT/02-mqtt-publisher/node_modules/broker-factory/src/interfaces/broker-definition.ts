export interface IBrokerDefinition {
    [method: string]: (...args: any[]) => any; // tslint:disable-line:invalid-void
}
