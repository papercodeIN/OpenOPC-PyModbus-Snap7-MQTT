export const createCache = (lastNumberWeakMap: WeakMap<Map<number, any> | Set<number>, number>) => {
    return (collection: Map<number, any> | Set<number>, nextNumber: number) => {
        lastNumberWeakMap.set(collection, nextNumber);

        return nextNumber;
    };
};
