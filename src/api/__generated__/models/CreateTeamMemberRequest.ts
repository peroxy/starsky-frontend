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
 * @interface CreateTeamMemberRequest
 */
export interface CreateTeamMemberRequest {
    /**
     * 
     * @type {number}
     * @memberof CreateTeamMemberRequest
     */
    employeeId: number;
}

export function CreateTeamMemberRequestFromJSON(json: any): CreateTeamMemberRequest {
    return CreateTeamMemberRequestFromJSONTyped(json, false);
}

export function CreateTeamMemberRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateTeamMemberRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'employeeId': json['employee_id'],
    };
}

export function CreateTeamMemberRequestToJSON(value?: CreateTeamMemberRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'employee_id': value.employeeId,
    };
}


