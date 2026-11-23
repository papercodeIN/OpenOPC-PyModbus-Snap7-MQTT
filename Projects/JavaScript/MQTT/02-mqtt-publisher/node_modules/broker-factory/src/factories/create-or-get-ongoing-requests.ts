export const createCreateOrGetOngoingRequests =
    (ongoingRequestsMap: WeakMap<MessagePort | Worker, Map<number, { reject: Function; resolve: Function }>>) =>
    (sender: MessagePort | Worker): Map<number, { reject: Function; resolve: Function }> => {
        if (ongoingRequestsMap.has(sender)) {
            // @todo TypeScript needs to be convinced that has() works as expected.
            return <Map<number, { reject: Function; resolve: Function }>>ongoingRequestsMap.get(sender);
        }

        const ongoingRequests: Map<number, { reject: Function; resolve: Function }> = new Map();

        ongoingRequestsMap.set(sender, ongoingRequests);

        return ongoingRequests;
    };
