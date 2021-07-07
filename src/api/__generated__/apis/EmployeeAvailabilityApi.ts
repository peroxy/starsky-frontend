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
    CreateEmployeeAvailabilitiesRequest,
    CreateEmployeeAvailabilitiesRequestFromJSON,
    CreateEmployeeAvailabilitiesRequestToJSON,
    CreateEmployeeAvailabilityRequest,
    CreateEmployeeAvailabilityRequestFromJSON,
    CreateEmployeeAvailabilityRequestToJSON,
    EmployeeAvailabilityResponse,
    EmployeeAvailabilityResponseFromJSON,
    EmployeeAvailabilityResponseToJSON,
    ForbiddenResponse,
    ForbiddenResponseFromJSON,
    ForbiddenResponseToJSON,
    UpdateEmployeeAvailabilityRequest,
    UpdateEmployeeAvailabilityRequestFromJSON,
    UpdateEmployeeAvailabilityRequestToJSON,
} from '../models';

export interface DeleteEmployeeAvailabilityRequest {
    availabilityId: number;
}

export interface GetEmployeeAvailabilitiesRequest {
    shiftId: number;
}

export interface GetEmployeeAvailabilityRequest {
    availabilityId: number;
}

export interface PatchEmployeeAvailabilityRequest {
    availabilityId: number;
    updateEmployeeAvailabilityRequest: UpdateEmployeeAvailabilityRequest;
}

export interface PostEmployeeAvailabilityRequest {
    shiftId: number;
    createEmployeeAvailabilityRequest: CreateEmployeeAvailabilityRequest;
}

export interface PutEmployeeAvailabilitiesRequest {
    createEmployeeAvailabilitiesRequest: Array<CreateEmployeeAvailabilitiesRequest>;
}

/**
 * 
 */
export class EmployeeAvailabilityApi extends runtime.BaseAPI {

    /**
     * Delete an employee availability. Authenticated user must have manager role.
     * Delete employee availability
     */
    async deleteEmployeeAvailabilityRaw(requestParameters: DeleteEmployeeAvailabilityRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.availabilityId === null || requestParameters.availabilityId === undefined) {
            throw new runtime.RequiredError('availabilityId','Required parameter requestParameters.availabilityId was null or undefined when calling deleteEmployeeAvailability.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/availabilities/{availability_id}`.replace(`{${"availability_id"}}`, encodeURIComponent(String(requestParameters.availabilityId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an employee availability. Authenticated user must have manager role.
     * Delete employee availability
     */
    async deleteEmployeeAvailability(requestParameters: DeleteEmployeeAvailabilityRequest): Promise<void> {
        await this.deleteEmployeeAvailabilityRaw(requestParameters);
    }

    /**
     * Returns a list of all employee availabilities. Managers may access all employee availabilities, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get all employee availabilities
     */
    async getEmployeeAvailabilitiesRaw(requestParameters: GetEmployeeAvailabilitiesRequest): Promise<runtime.ApiResponse<Array<EmployeeAvailabilityResponse>>> {
        if (requestParameters.shiftId === null || requestParameters.shiftId === undefined) {
            throw new runtime.RequiredError('shiftId','Required parameter requestParameters.shiftId was null or undefined when calling getEmployeeAvailabilities.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/shifts/{shift_id}/availabilities`.replace(`{${"shift_id"}}`, encodeURIComponent(String(requestParameters.shiftId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(EmployeeAvailabilityResponseFromJSON));
    }

    /**
     * Returns a list of all employee availabilities. Managers may access all employee availabilities, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get all employee availabilities
     */
    async getEmployeeAvailabilities(requestParameters: GetEmployeeAvailabilitiesRequest): Promise<Array<EmployeeAvailabilityResponse>> {
        const response = await this.getEmployeeAvailabilitiesRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns the specified employee availability. Managers may access all employee availabilities, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get employee availability
     */
    async getEmployeeAvailabilityRaw(requestParameters: GetEmployeeAvailabilityRequest): Promise<runtime.ApiResponse<EmployeeAvailabilityResponse>> {
        if (requestParameters.availabilityId === null || requestParameters.availabilityId === undefined) {
            throw new runtime.RequiredError('availabilityId','Required parameter requestParameters.availabilityId was null or undefined when calling getEmployeeAvailability.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/availabilities/{availability_id}`.replace(`{${"availability_id"}}`, encodeURIComponent(String(requestParameters.availabilityId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => EmployeeAvailabilityResponseFromJSON(jsonValue));
    }

    /**
     * Returns the specified employee availability. Managers may access all employee availabilities, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get employee availability
     */
    async getEmployeeAvailability(requestParameters: GetEmployeeAvailabilityRequest): Promise<EmployeeAvailabilityResponse> {
        const response = await this.getEmployeeAvailabilityRaw(requestParameters);
        return await response.value();
    }

    /**
     * Update any property (except actual employee) of the specified employee availability. Authenticated user must have manager role.
     * Update employee availability
     */
    async patchEmployeeAvailabilityRaw(requestParameters: PatchEmployeeAvailabilityRequest): Promise<runtime.ApiResponse<EmployeeAvailabilityResponse>> {
        if (requestParameters.availabilityId === null || requestParameters.availabilityId === undefined) {
            throw new runtime.RequiredError('availabilityId','Required parameter requestParameters.availabilityId was null or undefined when calling patchEmployeeAvailability.');
        }

        if (requestParameters.updateEmployeeAvailabilityRequest === null || requestParameters.updateEmployeeAvailabilityRequest === undefined) {
            throw new runtime.RequiredError('updateEmployeeAvailabilityRequest','Required parameter requestParameters.updateEmployeeAvailabilityRequest was null or undefined when calling patchEmployeeAvailability.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/availabilities/{availability_id}`.replace(`{${"availability_id"}}`, encodeURIComponent(String(requestParameters.availabilityId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateEmployeeAvailabilityRequestToJSON(requestParameters.updateEmployeeAvailabilityRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => EmployeeAvailabilityResponseFromJSON(jsonValue));
    }

    /**
     * Update any property (except actual employee) of the specified employee availability. Authenticated user must have manager role.
     * Update employee availability
     */
    async patchEmployeeAvailability(requestParameters: PatchEmployeeAvailabilityRequest): Promise<EmployeeAvailabilityResponse> {
        const response = await this.patchEmployeeAvailabilityRaw(requestParameters);
        return await response.value();
    }

    /**
     * Creates a new employee availability that is assigned to the specified schedule shift. Authenticated user must have manager role.
     * Create a new employee availability
     */
    async postEmployeeAvailabilityRaw(requestParameters: PostEmployeeAvailabilityRequest): Promise<runtime.ApiResponse<EmployeeAvailabilityResponse>> {
        if (requestParameters.shiftId === null || requestParameters.shiftId === undefined) {
            throw new runtime.RequiredError('shiftId','Required parameter requestParameters.shiftId was null or undefined when calling postEmployeeAvailability.');
        }

        if (requestParameters.createEmployeeAvailabilityRequest === null || requestParameters.createEmployeeAvailabilityRequest === undefined) {
            throw new runtime.RequiredError('createEmployeeAvailabilityRequest','Required parameter requestParameters.createEmployeeAvailabilityRequest was null or undefined when calling postEmployeeAvailability.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/shifts/{shift_id}/availabilities`.replace(`{${"shift_id"}}`, encodeURIComponent(String(requestParameters.shiftId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateEmployeeAvailabilityRequestToJSON(requestParameters.createEmployeeAvailabilityRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => EmployeeAvailabilityResponseFromJSON(jsonValue));
    }

    /**
     * Creates a new employee availability that is assigned to the specified schedule shift. Authenticated user must have manager role.
     * Create a new employee availability
     */
    async postEmployeeAvailability(requestParameters: PostEmployeeAvailabilityRequest): Promise<EmployeeAvailabilityResponse> {
        const response = await this.postEmployeeAvailabilityRaw(requestParameters);
        return await response.value();
    }

    /**
     * Creates or updates employee availabilities. Please note that this operation can be destructive - it will always delete all of the previous/existing employee availabilities (if they exist) for the specified shift and create or update with the new ones. Authenticated user must have manager role.
     * Create or update multiple employee availabilities
     */
    async putEmployeeAvailabilitiesRaw(requestParameters: PutEmployeeAvailabilitiesRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.createEmployeeAvailabilitiesRequest === null || requestParameters.createEmployeeAvailabilitiesRequest === undefined) {
            throw new runtime.RequiredError('createEmployeeAvailabilitiesRequest','Required parameter requestParameters.createEmployeeAvailabilitiesRequest was null or undefined when calling putEmployeeAvailabilities.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/user/availabilities`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createEmployeeAvailabilitiesRequest.map(CreateEmployeeAvailabilitiesRequestToJSON),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates or updates employee availabilities. Please note that this operation can be destructive - it will always delete all of the previous/existing employee availabilities (if they exist) for the specified shift and create or update with the new ones. Authenticated user must have manager role.
     * Create or update multiple employee availabilities
     */
    async putEmployeeAvailabilities(requestParameters: PutEmployeeAvailabilitiesRequest): Promise<void> {
        await this.putEmployeeAvailabilitiesRaw(requestParameters);
    }

}
