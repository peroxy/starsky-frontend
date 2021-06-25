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
    CreateUserRequest,
    CreateUserRequestFromJSON,
    CreateUserRequestToJSON,
    InviteInvalidResponse,
    InviteInvalidResponseFromJSON,
    InviteInvalidResponseToJSON,
    UpdateUserRequest,
    UpdateUserRequestFromJSON,
    UpdateUserRequestToJSON,
    UserResponse,
    UserResponseFromJSON,
    UserResponseToJSON,
} from '../models';

export interface CreateUserOperationRequest {
    createUserRequest: CreateUserRequest;
}

export interface UpdateUserOperationRequest {
    updateUserRequest: UpdateUserRequest;
}

/**
 * 
 */
export class UserApi extends runtime.BaseAPI {

    /**
     * You can register a new user with the manager role by only supplying their name, email, password and job title. By adding a valid invite token (which the employee receives by mail) to the request body, the newly registered user will have the employee role.
     * Register a new user
     */
    async createUserRaw(requestParameters: CreateUserOperationRequest): Promise<runtime.ApiResponse<UserResponse>> {
        if (requestParameters.createUserRequest === null || requestParameters.createUserRequest === undefined) {
            throw new runtime.RequiredError('createUserRequest','Required parameter requestParameters.createUserRequest was null or undefined when calling createUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateUserRequestToJSON(requestParameters.createUserRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseFromJSON(jsonValue));
    }

    /**
     * You can register a new user with the manager role by only supplying their name, email, password and job title. By adding a valid invite token (which the employee receives by mail) to the request body, the newly registered user will have the employee role.
     * Register a new user
     */
    async createUser(requestParameters: CreateUserOperationRequest): Promise<UserResponse> {
        const response = await this.createUserRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns the currently authenticated user\'s information.
     * Get the authenticated user
     */
    async getUserRaw(): Promise<runtime.ApiResponse<UserResponse>> {
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
            path: `/user`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseFromJSON(jsonValue));
    }

    /**
     * Returns the currently authenticated user\'s information.
     * Get the authenticated user
     */
    async getUser(): Promise<UserResponse> {
        const response = await this.getUserRaw();
        return await response.value();
    }

    /**
     * Update specified properties of the currently authenticated user.
     * Update user
     */
    async updateUserRaw(requestParameters: UpdateUserOperationRequest): Promise<runtime.ApiResponse<UserResponse>> {
        if (requestParameters.updateUserRequest === null || requestParameters.updateUserRequest === undefined) {
            throw new runtime.RequiredError('updateUserRequest','Required parameter requestParameters.updateUserRequest was null or undefined when calling updateUser.');
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
            path: `/user`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUserRequestToJSON(requestParameters.updateUserRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseFromJSON(jsonValue));
    }

    /**
     * Update specified properties of the currently authenticated user.
     * Update user
     */
    async updateUser(requestParameters: UpdateUserOperationRequest): Promise<UserResponse> {
        const response = await this.updateUserRaw(requestParameters);
        return await response.value();
    }

    /**
     * Check if the currently authenticated user has correct credentials (has logged in and has supplied correct bearer JWT token in header).
     * Check if currently authenticated user is valid
     */
    async validateAuthenticationRaw(): Promise<runtime.ApiResponse<void>> {
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
            path: `/user/authentication`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Check if the currently authenticated user has correct credentials (has logged in and has supplied correct bearer JWT token in header).
     * Check if currently authenticated user is valid
     */
    async validateAuthentication(): Promise<void> {
        await this.validateAuthenticationRaw();
    }

}
