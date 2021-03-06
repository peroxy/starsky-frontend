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
 * @interface UpdateTeamRequest
 */
export interface UpdateTeamRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateTeamRequest
     */
    name?: string;
}

export function UpdateTeamRequestFromJSON(json: any): UpdateTeamRequest {
    return UpdateTeamRequestFromJSONTyped(json, false);
}

export function UpdateTeamRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateTeamRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
    };
}

export function UpdateTeamRequestToJSON(value?: UpdateTeamRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
    };
}


