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
    CreateTeamMemberRequest,
    CreateTeamMemberRequestFromJSON,
    CreateTeamMemberRequestToJSON,
    CreateTeamRequest,
    CreateTeamRequestFromJSON,
    CreateTeamRequestToJSON,
    TeamResponse,
    TeamResponseFromJSON,
    TeamResponseToJSON,
    UpdateTeamRequest,
    UpdateTeamRequestFromJSON,
    UpdateTeamRequestToJSON,
    UserResponse,
    UserResponseFromJSON,
    UserResponseToJSON,
} from '../models';

export interface DeleteTeamRequest {
    teamId: number;
}

export interface DeleteTeamMemberRequest {
    teamId: number;
    userId: number;
}

export interface GetTeamMembersRequest {
    teamId: number;
}

export interface PatchTeamRequest {
    teamId: number;
    updateTeamRequest: UpdateTeamRequest;
}

export interface PostTeamRequest {
    createTeamRequest: CreateTeamRequest;
}

export interface PostTeamMemberRequest {
    teamId: number;
    userId: number;
}

export interface PutTeamMembersRequest {
    teamId: number;
    createTeamMemberRequest: Array<CreateTeamMemberRequest>;
}

/**
 * 
 */
export class TeamApi extends runtime.BaseAPI {

    /**
     * Deletes the team. This will also cascade delete team members. Authenticated user must have manager role.
     * Delete team
     */
    async deleteTeamRaw(requestParameters: DeleteTeamRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling deleteTeam.');
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
            path: `/user/teams/{team_id}`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the team. This will also cascade delete team members. Authenticated user must have manager role.
     * Delete team
     */
    async deleteTeam(requestParameters: DeleteTeamRequest): Promise<void> {
        await this.deleteTeamRaw(requestParameters);
    }

    /**
     * Deletes the team member from the team. Authenticated user must have manager role.
     * Delete team member
     */
    async deleteTeamMemberRaw(requestParameters: DeleteTeamMemberRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling deleteTeamMember.');
        }

        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling deleteTeamMember.');
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
            path: `/user/teams/{team_id}/members/{user_id}`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))).replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the team member from the team. Authenticated user must have manager role.
     * Delete team member
     */
    async deleteTeamMember(requestParameters: DeleteTeamMemberRequest): Promise<void> {
        await this.deleteTeamMemberRaw(requestParameters);
    }

    /**
     * Returns a list of team members of the specified team.
     * Get team members
     */
    async getTeamMembersRaw(requestParameters: GetTeamMembersRequest): Promise<runtime.ApiResponse<Array<UserResponse>>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling getTeamMembers.');
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
            path: `/user/teams/{team_id}/members`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserResponseFromJSON));
    }

    /**
     * Returns a list of team members of the specified team.
     * Get team members
     */
    async getTeamMembers(requestParameters: GetTeamMembersRequest): Promise<Array<UserResponse>> {
        const response = await this.getTeamMembersRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns the teams the user owns (manager) or the ones he is part of (employee).
     * Get user\'s teams
     */
    async getTeamsRaw(): Promise<runtime.ApiResponse<Array<TeamResponse>>> {
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
            path: `/user/teams`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TeamResponseFromJSON));
    }

    /**
     * Returns the teams the user owns (manager) or the ones he is part of (employee).
     * Get user\'s teams
     */
    async getTeams(): Promise<Array<TeamResponse>> {
        const response = await this.getTeamsRaw();
        return await response.value();
    }

    /**
     * Update the specified team. Authenticated user must have manager role.
     * Update team
     */
    async patchTeamRaw(requestParameters: PatchTeamRequest): Promise<runtime.ApiResponse<TeamResponse>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling patchTeam.');
        }

        if (requestParameters.updateTeamRequest === null || requestParameters.updateTeamRequest === undefined) {
            throw new runtime.RequiredError('updateTeamRequest','Required parameter requestParameters.updateTeamRequest was null or undefined when calling patchTeam.');
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
            path: `/user/teams/{team_id}`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateTeamRequestToJSON(requestParameters.updateTeamRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => TeamResponseFromJSON(jsonValue));
    }

    /**
     * Update the specified team. Authenticated user must have manager role.
     * Update team
     */
    async patchTeam(requestParameters: PatchTeamRequest): Promise<TeamResponse> {
        const response = await this.patchTeamRaw(requestParameters);
        return await response.value();
    }

    /**
     * Create a new team - manager only route. Team name must be unique for this user, can\'t have 2 teams with same name.
     * Create a new team
     */
    async postTeamRaw(requestParameters: PostTeamRequest): Promise<runtime.ApiResponse<TeamResponse>> {
        if (requestParameters.createTeamRequest === null || requestParameters.createTeamRequest === undefined) {
            throw new runtime.RequiredError('createTeamRequest','Required parameter requestParameters.createTeamRequest was null or undefined when calling postTeam.');
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
            path: `/user/teams`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateTeamRequestToJSON(requestParameters.createTeamRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => TeamResponseFromJSON(jsonValue));
    }

    /**
     * Create a new team - manager only route. Team name must be unique for this user, can\'t have 2 teams with same name.
     * Create a new team
     */
    async postTeam(requestParameters: PostTeamRequest): Promise<TeamResponse> {
        const response = await this.postTeamRaw(requestParameters);
        return await response.value();
    }

    /**
     * Add a new team member (an employee with user ID) to a team - manager only route.
     * Add a new team member
     */
    async postTeamMemberRaw(requestParameters: PostTeamMemberRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling postTeamMember.');
        }

        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling postTeamMember.');
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
            path: `/user/teams/{team_id}/members/{user_id}`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))).replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add a new team member (an employee with user ID) to a team - manager only route.
     * Add a new team member
     */
    async postTeamMember(requestParameters: PostTeamMemberRequest): Promise<void> {
        await this.postTeamMemberRaw(requestParameters);
    }

    /**
     * Creates or updates team members. Please note that this operation can be destructive - it will always delete all of the previous/existing team members (if they exist) for the specified team and create or update with the new ones. Authenticated user must have manager role.
     * Create or update team members
     */
    async putTeamMembersRaw(requestParameters: PutTeamMembersRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.teamId === null || requestParameters.teamId === undefined) {
            throw new runtime.RequiredError('teamId','Required parameter requestParameters.teamId was null or undefined when calling putTeamMembers.');
        }

        if (requestParameters.createTeamMemberRequest === null || requestParameters.createTeamMemberRequest === undefined) {
            throw new runtime.RequiredError('createTeamMemberRequest','Required parameter requestParameters.createTeamMemberRequest was null or undefined when calling putTeamMembers.');
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
            path: `/user/teams/{team_id}/members`.replace(`{${"team_id"}}`, encodeURIComponent(String(requestParameters.teamId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.createTeamMemberRequest.map(CreateTeamMemberRequestToJSON),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates or updates team members. Please note that this operation can be destructive - it will always delete all of the previous/existing team members (if they exist) for the specified team and create or update with the new ones. Authenticated user must have manager role.
     * Create or update team members
     */
    async putTeamMembers(requestParameters: PutTeamMembersRequest): Promise<void> {
        await this.putTeamMembersRaw(requestParameters);
    }

}
