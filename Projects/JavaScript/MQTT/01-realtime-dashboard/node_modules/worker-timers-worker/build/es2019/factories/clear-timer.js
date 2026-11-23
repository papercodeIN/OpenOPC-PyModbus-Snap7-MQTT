export const createClearTimer = (clearTimeout, identifiersAndResolvers) => (timerId) => {
    const identifiersAndResolver = identifiersAndResolvers.get(timerId);
    if (identifiersAndResolver === undefined) {
        return Promise.resolve(false);
    }
    const [identifier, resolveSetResponseResultPromise] = identifiersAndResolver;
    clearTimeout(identifier);
    identifiersAndResolvers.delete(timerId);
    resolveSetResponseResultPromise(false);
    return Promise.resolve(true);
};
//# sourceMappingURL=clear-timer.js.map