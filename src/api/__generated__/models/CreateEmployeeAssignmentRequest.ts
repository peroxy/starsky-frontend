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
 * @interface CreateEmployeeAssignmentRequest
 */
export interface CreateEmployeeAssignmentRequest {
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAssignmentRequest
     */
    assignmentStart: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAssignmentRequest
     */
    assignmentEnd: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAssignmentRequest
     */
    employeeId: number;
    /**
     * 
     * @type {number}
     * @memberof CreateEmployeeAssignmentRequest
     */
    shiftId: number;
}

export function CreateEmployeeAssignmentRequestFromJSON(json: any): CreateEmployeeAssignmentRequest {
    return CreateEmployeeAssignmentRequestFromJSONTyped(json, false);
}

export function CreateEmployeeAssignmentRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateEmployeeAssignmentRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'assignmentStart': json['assignment_start'],
        'assignmentEnd': json['assignment_end'],
        'employeeId': json['employee_id'],
        'shiftId': json['shift_id'],
    };
}

export function CreateEmployeeAssignmentRequestToJSON(value?: CreateEmployeeAssignmentRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'assignment_start': value.assignmentStart,
        'assignment_end': value.assignmentEnd,
        'employee_id': value.employeeId,
        'shift_id': value.shiftId,
    };
}

