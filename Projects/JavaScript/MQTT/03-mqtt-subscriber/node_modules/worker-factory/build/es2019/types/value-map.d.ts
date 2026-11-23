import { IValueMap } from '../interfaces';
export type TValueMap<ValueMap extends IValueMap = IValueMap> = {
    [P in keyof ValueMap]: ValueMap[P];
};
//# sourceMappingURL=value-map.d.ts.map