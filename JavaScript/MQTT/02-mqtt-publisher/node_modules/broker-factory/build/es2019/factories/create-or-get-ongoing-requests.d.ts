export declare const createCreateOrGetOngoingRequests: (ongoingRequestsMap: WeakMap<MessagePort | Worker, Map<number, {
    reject: Function;
    resolve: Function;
}>>) => (sender: MessagePort | Worker) => Map<number, {
    reject: Function;
    resolve: Function;
}>;
//# sourceMappingURL=create-or-get-ongoing-requests.d.ts.map