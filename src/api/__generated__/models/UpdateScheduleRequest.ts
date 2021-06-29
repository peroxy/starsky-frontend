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
 * @interface UpdateScheduleRequest
 */
export interface UpdateScheduleRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateScheduleRequest
     */
    scheduleName?: string;
    /**
     * 
     * @type {number}
     * @memberof UpdateScheduleRequest
     */
    scheduleStart?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateScheduleRequest
     */
    scheduleEnd?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateScheduleRequest
     */
    maxHoursPerEmployee?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateScheduleRequest
     */
    maxShiftsPerEmployee?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateScheduleRequest
     */
    maxHoursPerShift?: number;
}

export function UpdateScheduleRequestFromJSON(json: any): UpdateScheduleRequest {
    return UpdateScheduleRequestFromJSONTyped(json, false);
}

export function UpdateScheduleRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateScheduleRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'scheduleName': !exists(json, 'schedule_name') ? undefined : json['schedule_name'],
        'scheduleStart': !exists(json, 'schedule_start') ? undefined : json['schedule_start'],
        'scheduleEnd': !exists(json, 'schedule_end') ? undefined : json['schedule_end'],
        'maxHoursPerEmployee': !exists(json, 'max_hours_per_employee') ? undefined : json['max_hours_per_employee'],
        'maxShiftsPerEmployee': !exists(json, 'max_shifts_per_employee') ? undefined : json['max_shifts_per_employee'],
        'maxHoursPerShift': !exists(json, 'max_hours_per_shift') ? undefined : json['max_hours_per_shift'],
    };
}

export function UpdateScheduleRequestToJSON(value?: UpdateScheduleRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'schedule_name': value.scheduleName,
        'schedule_start': value.scheduleStart,
        'schedule_end': value.scheduleEnd,
        'max_hours_per_employee': value.maxHoursPerEmployee,
        'max_shifts_per_employee': value.maxShiftsPerEmployee,
        'max_hours_per_shift': value.maxHoursPerShift,
    };
}


