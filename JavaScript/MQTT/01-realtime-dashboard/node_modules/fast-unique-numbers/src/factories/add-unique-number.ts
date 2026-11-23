import type { createGenerateUniqueNumber } from './generate-unique-number';

export const createAddUniqueNumber = (generateUniqueNumber: ReturnType<typeof createGenerateUniqueNumber>) => {
    return (set: Set<number>) => {
        const number = generateUniqueNumber(set);

        set.add(number);

        return number;
    };
};
