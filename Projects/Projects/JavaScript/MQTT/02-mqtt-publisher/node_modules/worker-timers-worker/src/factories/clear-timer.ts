import { TResolveSetResponseResultPromise } from '../types';

export const createClearTimer =
    (clearTimeout: (typeof globalThis)['clearTimeout'], identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>) =>
    (timerId: number) => {
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
