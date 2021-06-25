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
 * @interface EmployeeAssignmentResponse
 */
export interface EmployeeAssignmentResponse {
    /**
     * 
     * @type {number}
     * @memberof EmployeeAssignmentResponse
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof EmployeeAssignmentResponse
     */
    assignmentStart?: number;
    /**
     * 
     * @type {number}
     * @memberof EmployeeAssignmentResponse
     */
    assignmentEnd?: number;
    /**
     * 
     * @type {number}
     * @memberof EmployeeAssignmentResponse
     */
    employeeId?: number;
    /**
     * 
     * @type {number}
     * @memberof EmployeeAssignmentResponse
     */
    shiftId?: number;
}

export function EmployeeAssignmentResponseFromJSON(json: any): EmployeeAssignmentResponse {
    return EmployeeAssignmentResponseFromJSONTyped(json, false);
}

export function EmployeeAssignmentResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmployeeAssignmentResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'assignmentStart': !exists(json, 'assignment_start') ? undefined : json['assignment_start'],
        'assignmentEnd': !exists(json, 'assignment_end') ? undefined : json['assignment_end'],
        'employeeId': !exists(json, 'employee_id') ? undefined : json['employee_id'],
        'shiftId': !exists(json, 'shift_id') ? undefined : json['shift_id'],
    };
}

export function EmployeeAssignmentResponseToJSON(value?: EmployeeAssignmentResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'assignment_start': value.assignmentStart,
        'assignment_end': value.assignmentEnd,
        'employee_id': value.employeeId,
        'shift_id': value.shiftId,
    };
}

