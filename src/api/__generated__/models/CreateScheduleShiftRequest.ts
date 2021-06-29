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
 * @interface CreateScheduleShiftRequest
 */
export interface CreateScheduleShiftRequest {
    /**
     * 
     * @type {number}
     * @memberof CreateScheduleShiftRequest
     */
    shiftStart: number;
    /**
     * 
     * @type {number}
     * @memberof CreateScheduleShiftRequest
     */
    shiftEnd: number;
    /**
     * 
     * @type {number}
     * @memberof CreateScheduleShiftRequest
     */
    numberOfRequiredEmployees: number;
}

export function CreateScheduleShiftRequestFromJSON(json: any): CreateScheduleShiftRequest {
    return CreateScheduleShiftRequestFromJSONTyped(json, false);
}

export function CreateScheduleShiftRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateScheduleShiftRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'shiftStart': json['shift_start'],
        'shiftEnd': json['shift_end'],
        'numberOfRequiredEmployees': json['number_of_required_employees'],
    };
}

export function CreateScheduleShiftRequestToJSON(value?: CreateScheduleShiftRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'shift_start': value.shiftStart,
        'shift_end': value.shiftEnd,
        'number_of_required_employees': value.numberOfRequiredEmployees,
    };
}


