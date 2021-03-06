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
 * @interface ScheduleUnsolvableResponse
 */
export interface ScheduleUnsolvableResponse {
    /**
     * 
     * @type {string}
     * @memberof ScheduleUnsolvableResponse
     */
    error: string;
}

export function ScheduleUnsolvableResponseFromJSON(json: any): ScheduleUnsolvableResponse {
    return ScheduleUnsolvableResponseFromJSONTyped(json, false);
}

export function ScheduleUnsolvableResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ScheduleUnsolvableResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'error': json['error'],
    };
}

export function ScheduleUnsolvableResponseToJSON(value?: ScheduleUnsolvableResponse | null): any {
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


