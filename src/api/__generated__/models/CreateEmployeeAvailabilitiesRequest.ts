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
 * @interface CreateEmployeeAvailabilitiesRequest
 */
export interface CreateEmployeeAvailabilitiesRequest {
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAvailabilitiesRequest
     */
    availabilityStart: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAvailabilitiesRequest
     */
    availabilityEnd: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAvailabilitiesRequest
     */
    maxHoursPerShift: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAvailabilitiesRequest
     */
    employeeId: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAvailabilitiesRequest
     */
    shiftId: number;
}

export function CreateEmployeeAvailabilitiesRequestFromJSON(json: any): CreateEmployeeAvailabilitiesRequest {
    return CreateEmployeeAvailabilitiesRequestFromJSONTyped(json, false);
}

export function CreateEmployeeAvailabilitiesRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateEmployeeAvailabilitiesRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'availabilityStart': json['availability_start'],
        'availabilityEnd': json['availability_end'],
        'maxHoursPerShift': json['max_hours_per_shift'],
        'employeeId': json['employee_id'],
        'shiftId': json['shift_id'],
    };
}

export function CreateEmployeeAvailabilitiesRequestToJSON(value?: CreateEmployeeAvailabilitiesRequest | null): any {
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
        'employee_id': value.employeeId,
        'shift_id': value.shiftId,
    };
}


