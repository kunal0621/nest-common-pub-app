import { Type } from "@nestjs/common";

export const KEY_MAP_METADATA = 'key_map_metadata';

export function DocKeyMap(keyName: string, dtoClass?: Type<any>) {
    return function (target: any, propertyKey: string) {
        const existingMappings = Reflect.getMetadata(KEY_MAP_METADATA, target) || {};
        existingMappings[propertyKey] = { keyName, dtoClass };
        Reflect.defineMetadata(KEY_MAP_METADATA, existingMappings, target);
    };
}