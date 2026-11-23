export const createCreateOrGetOngoingRequests = (ongoingRequestsMap) => (sender) => {
    if (ongoingRequestsMap.has(sender)) {
        // @todo TypeScript needs to be convinced that has() works as expected.
        return ongoingRequestsMap.get(sender);
    }
    const ongoingRequests = new Map();
    ongoingRequestsMap.set(sender, ongoingRequests);
    return ongoingRequests;
};
//# sourceMappingURL=create-or-get-ongoing-requests.js.map