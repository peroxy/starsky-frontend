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


import * as runtime from '../runtime';
import {
    VersionResponse,
    VersionResponseFromJSON,
    VersionResponseToJSON,
} from '../models';

/**
 * 
 */
export class VersionApi extends runtime.BaseAPI {

    /**
     * Return the current version of the API which is specified inside gradle.build file.
     * Get current version
     */
    async getVersionRaw(): Promise<runtime.ApiResponse<VersionResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/version`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => VersionResponseFromJSON(jsonValue));
    }

    /**
     * Return the current version of the API which is specified inside gradle.build file.
     * Get current version
     */
    async getVersion(): Promise<VersionResponse> {
        const response = await this.getVersionRaw();
        return await response.value();
    }

}