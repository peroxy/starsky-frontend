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
 * @interface TokenResponse
 */
export interface TokenResponse {
    /**
     * 
     * @type {string}
     * @memberof TokenResponse
     */
    accessToken?: string;
    /**
     * 
     * @type {string}
     * @memberof TokenResponse
     */
    tokenType?: string;
    /**
     * 
     * @type {number}
     * @memberof TokenResponse
     */
    expiresOn?: number;
    /**
     * 
     * @type {number}
     * @memberof TokenResponse
     */
    expiresIn?: number;
}

export function TokenResponseFromJSON(json: any): TokenResponse {
    return TokenResponseFromJSONTyped(json, false);
}

export function TokenResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accessToken': !exists(json, 'access_token') ? undefined : json['access_token'],
        'tokenType': !exists(json, 'token_type') ? undefined : json['token_type'],
        'expiresOn': !exists(json, 'expires_on') ? undefined : json['expires_on'],
        'expiresIn': !exists(json, 'expires_in') ? undefined : json['expires_in'],
    };
}

export function TokenResponseToJSON(value?: TokenResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'access_token': value.accessToken,
        'token_type': value.tokenType,
        'expires_on': value.expiresOn,
        'expires_in': value.expiresIn,
    };
}

