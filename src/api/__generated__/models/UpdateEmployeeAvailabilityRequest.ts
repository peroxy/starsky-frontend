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

import {exists} from '../runtime';

/**
 * 
 * @export
 * @interface UpdateEmployeeAvailabilityRequest
 */
export interface UpdateEmployeeAvailabilityRequest {
    /**
     * 
     * @type {number}
     * @memberof UpdateEmployeeAvailabilityRequest
     */
    availabilityStart?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateEmployeeAvailabilityRequest
     */
    availabilityEnd?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateEmployeeAvailabilityRequest
     */
    maxHoursPerShift?: number;
}

export function UpdateEmployeeAvailabilityRequestFromJSON(json: any): UpdateEmployeeAvailabilityRequest {
    return UpdateEmployeeAvailabilityRequestFromJSONTyped(json, false);
}

export function UpdateEmployeeAvailabilityRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateEmployeeAvailabilityRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'availabilityStart': !exists(json, 'availability_start') ? undefined : json['availability_start'],
        'availabilityEnd': !exists(json, 'availability_end') ? undefined : json['availability_end'],
        'maxHoursPerShift': !exists(json, 'max_hours_per_shift') ? undefined : json['max_hours_per_shift'],
    };
}

export function UpdateEmployeeAvailabilityRequestToJSON(value?: UpdateEmployeeAvailabilityRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'availability_start': value.availabilityStart,
        'availability_end': value.availabilityEnd,
        'max_hours_per_shift': value.maxHoursPerShift,
    };
}


