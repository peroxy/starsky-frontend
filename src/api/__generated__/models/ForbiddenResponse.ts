/* tslint:disable */
/* eslint-disable */
/**
 * Starsky API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ForbiddenResponse
 */
export interface ForbiddenResponse {
    /**
     * 
     * @type {string}
     * @memberof ForbiddenResponse
     */
    error?: string;
}

export function ForbiddenResponseFromJSON(json: any): ForbiddenResponse {
    return ForbiddenResponseFromJSONTyped(json, false);
}

export function ForbiddenResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ForbiddenResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}

export function ForbiddenResponseToJSON(value?: ForbiddenResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'error': value.error,
    };
}

