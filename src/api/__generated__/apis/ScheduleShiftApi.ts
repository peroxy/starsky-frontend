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
    CreateScheduleShiftRequest,
    CreateScheduleShiftRequestToJSON,
    ScheduleShiftResponse,
    ScheduleShiftResponseFromJSON,
    UpdateScheduleShiftRequest,
    UpdateScheduleShiftRequestToJSON,
} from '../models';

export interface CreateScheduleShiftOperationRequest {
    scheduleId: number;
    createScheduleShiftRequest: CreateScheduleShiftRequest;
}

export interface DeleteScheduleShiftRequest {
    shiftId: number;
}

export interface GetScheduleShiftRequest {
    shiftId: number;
}

export interface GetScheduleShiftsRequest {
    scheduleId: number;
}

export interface UpdateScheduleShiftOperationRequest {
    shiftId: number;
    updateScheduleShiftRequest: UpdateScheduleShiftRequest;
}

/**
 * 
 */
export class ScheduleShiftApi extends runtime.BaseAPI {

    /**
     * Creates a new schedule shift that is assigned to the specified schedule. Authenticated user must have manager role.
     * Create a new schedule shift
     */
    async createScheduleShiftRaw(requestParameters: CreateScheduleShiftOperationRequest): Promise<runtime.ApiResponse<ScheduleShiftResponse>> {
        if (requestParameters.scheduleId === null || requestParameters.scheduleId === undefined) {
            throw new runtime.RequiredError('scheduleId','Required parameter requestParameters.scheduleId was null or undefined when calling createScheduleShift.');
        }

        if (requestParameters.createScheduleShiftRequest === null || requestParameters.createScheduleShiftRequest === undefined) {
            throw new runtime.RequiredError('createScheduleShiftRequest','Required parameter requestParameters.createScheduleShiftRequest was null or undefined when calling createScheduleShift.');
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
            path: `/user/schedules/{schedule_id}/shifts`.replace(`{${"schedule_id"}}`, encodeURIComponent(String(requestParameters.scheduleId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateScheduleShiftRequestToJSON(requestParameters.createScheduleShiftRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ScheduleShiftResponseFromJSON(jsonValue));
    }

    /**
     * Creates a new schedule shift that is assigned to the specified schedule. Authenticated user must have manager role.
     * Create a new schedule shift
     */
    async createScheduleShift(requestParameters: CreateScheduleShiftOperationRequest): Promise<ScheduleShiftResponse> {
        const response = await this.createScheduleShiftRaw(requestParameters);
        return await response.value();
    }

    /**
     * Delete a schedule shift. This will also cascade delete employee availabilities. Authenticated user must have manager role.
     * Delete schedule shift
     */
    async deleteScheduleShiftRaw(requestParameters: DeleteScheduleShiftRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.shiftId === null || requestParameters.shiftId === undefined) {
            throw new runtime.RequiredError('shiftId','Required parameter requestParameters.shiftId was null or undefined when calling deleteScheduleShift.');
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
            path: `/user/shifts/{shift_id}`.replace(`{${"shift_id"}}`, encodeURIComponent(String(requestParameters.shiftId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a schedule shift. This will also cascade delete employee availabilities. Authenticated user must have manager role.
     * Delete schedule shift
     */
    async deleteScheduleShift(requestParameters: DeleteScheduleShiftRequest): Promise<void> {
        await this.deleteScheduleShiftRaw(requestParameters);
    }

    /**
     * Returns the specified schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get schedule shift
     */
    async getScheduleShiftRaw(requestParameters: GetScheduleShiftRequest): Promise<runtime.ApiResponse<ScheduleShiftResponse>> {
        if (requestParameters.shiftId === null || requestParameters.shiftId === undefined) {
            throw new runtime.RequiredError('shiftId','Required parameter requestParameters.shiftId was null or undefined when calling getScheduleShift.');
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
            path: `/user/shifts/{shift_id}`.replace(`{${"shift_id"}}`, encodeURIComponent(String(requestParameters.shiftId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ScheduleShiftResponseFromJSON(jsonValue));
    }

    /**
     * Returns the specified schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get schedule shift
     */
    async getScheduleShift(requestParameters: GetScheduleShiftRequest): Promise<ScheduleShiftResponse> {
        const response = await this.getScheduleShiftRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns a list of all schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get all schedule shifts
     */
    async getScheduleShiftsRaw(requestParameters: GetScheduleShiftsRequest): Promise<runtime.ApiResponse<Array<ScheduleShiftResponse>>> {
        if (requestParameters.scheduleId === null || requestParameters.scheduleId === undefined) {
            throw new runtime.RequiredError('scheduleId','Required parameter requestParameters.scheduleId was null or undefined when calling getScheduleShifts.');
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
            path: `/user/schedules/{schedule_id}/shifts`.replace(`{${"schedule_id"}}`, encodeURIComponent(String(requestParameters.scheduleId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScheduleShiftResponseFromJSON));
    }

    /**
     * Returns a list of all schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule\'s team to access this resource.
     * Get all schedule shifts
     */
    async getScheduleShifts(requestParameters: GetScheduleShiftsRequest): Promise<Array<ScheduleShiftResponse>> {
        const response = await this.getScheduleShiftsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Update any property of the specified shift. Authenticated user must have manager role.
     * Update schedule shift
     */
    async updateScheduleShiftRaw(requestParameters: UpdateScheduleShiftOperationRequest): Promise<runtime.ApiResponse<ScheduleShiftResponse>> {
        if (requestParameters.shiftId === null || requestParameters.shiftId === undefined) {
            throw new runtime.RequiredError('shiftId','Required parameter requestParameters.shiftId was null or undefined when calling updateScheduleShift.');
        }

        if (requestParameters.updateScheduleShiftRequest === null || requestParameters.updateScheduleShiftRequest === undefined) {
            throw new runtime.RequiredError('updateScheduleShiftRequest','Required parameter requestParameters.updateScheduleShiftRequest was null or undefined when calling updateScheduleShift.');
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
            path: `/user/shifts/{shift_id}`.replace(`{${"shift_id"}}`, encodeURIComponent(String(requestParameters.shiftId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateScheduleShiftRequestToJSON(requestParameters.updateScheduleShiftRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ScheduleShiftResponseFromJSON(jsonValue));
    }

    /**
     * Update any property of the specified shift. Authenticated user must have manager role.
     * Update schedule shift
     */
    async updateScheduleShift(requestParameters: UpdateScheduleShiftOperationRequest): Promise<ScheduleShiftResponse> {
        const response = await this.updateScheduleShiftRaw(requestParameters);
        return await response.value();
    }

}
