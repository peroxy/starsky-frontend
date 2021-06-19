/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateEmployeeAssignmentRequest {
  /**
   * @format double
   * @example 1617032176.7171679
   */
  assignment_start: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  assignment_end: number;

  /**
   * @format int64
   * @example 1
   */
  employee_id: number;

  /**
   * @format int64
   * @example 3
   */
  shift_id: number;
}

export interface CreateUserRequest {
  /** @example David Starsky */
  name: string;

  /** @example david@example.com */
  email: string;

  /** @example password */
  password?: string;

  /** @example Police detective */
  job_title: string;

  /**
   * @format uuid
   * @example acaa86b2-ce32-4911-89b8-e1e2a1d39a01
   */
  invite_token?: string;
}

export interface UserResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /** @example David Starsky */
  name?: string;

  /** @example david@example.com */
  email?: string;

  /** @example EMPLOYEE */
  role?: string;

  /** @example Police detective */
  job_title?: string;

  /** @example +38641891123 */
  phone_number?: string;

  /** @example EMAIL */
  notification_type?: string;
}

export interface InviteInvalidResponse {
  /** @example This invite token has expired. */
  error?: string;

  /** @example acaa86b2-ce32-4911-89b8-e1e2a1d39a01 */
  invite_token?: string;
}

export interface CreateTeamRequest {
  /** @example My Police Squad */
  name: string;
}

export interface TeamResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /** @example Harold's police squad */
  name?: string;

  /** @example Harold C. Dobey */
  owner_name?: string;
}

export interface CreateScheduleRequest {
  /** @example Next week's schedule */
  schedule_name: string;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  schedule_start: number;

  /**
   * @format double
   * @example 1617102176.7171679
   */
  schedule_end: number;

  /**
   * @format int32
   * @min 0
   * @example 40
   */
  max_hours_per_employee: number;

  /**
   * @format int32
   * @min 0
   * @example 5
   */
  max_shifts_per_employee: number;

  /**
   * @format int32
   * @min 0
   * @example 8
   */
  max_hours_per_shift: number;
}

export interface ScheduleResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /** @example Next week's schedule */
  schedule_name?: string;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  schedule_start?: number;

  /**
   * @format double
   * @example 1617102176.7171679
   */
  schedule_end?: number;

  /**
   * @format int64
   * @example 1
   */
  team_id?: number;

  /**
   * @format int32
   * @example 40
   */
  max_hours_per_employee?: number;

  /**
   * @format int32
   * @example 5
   */
  max_shifts_per_employee?: number;

  /**
   * @format int32
   * @example 8
   */
  max_hours_per_shift?: number;
}

export interface CreateEmployeeAvailabilityRequest {
  /**
   * @format double
   * @example 1617032176.7171679
   */
  availability_start: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  availability_end: number;

  /**
   * @format int32
   * @min 1
   * @example 8
   */
  max_hours_per_shift: number;

  /**
   * @format int32
   * @example 1
   */
  employee_id: number;
}

export interface EmployeeAvailabilityResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  shift_start?: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  shift_end?: number;

  /**
   * @format int32
   * @example 8
   */
  max_hours_per_shift?: number;

  /**
   * @format int64
   * @example 1
   */
  employee_id: number;
}

export interface CreateScheduleShiftRequest {
  /**
   * @format double
   * @example 1617032176.7171679
   */
  shift_start: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  shift_end: number;

  /**
   * @format int32
   * @min 1
   * @example 5
   */
  number_of_required_employees: number;
}

export interface ScheduleShiftResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  shift_start?: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  shift_end?: number;

  /**
   * @format int32
   * @example 5
   */
  number_of_required_employees?: number;
}

export interface CreateInviteRequest {
  /** @example Kenneth Hutchinson */
  employee_name: string;

  /** @example kenneth@example.com */
  employee_email: string;
}

export interface InviteResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /** @example Kenneth Hutchinson */
  employee_name?: string;

  /** @example kenneth@example.com */
  employee_email?: string;

  /** @example false */
  has_registered?: boolean;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  expires_on?: number;

  /**
   * @format int64
   * @example 259200
   */
  expires_in?: number;
}

export interface LoginRequest {
  /** @example mail@example.com */
  email: string;

  /** @example password */
  password: string;
}

export interface TokenResponse {
  /** @example eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9... */
  access_token?: string;

  /** @example Bearer */
  token_type?: string;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  expires_on?: number;

  /**
   * @format int64
   * @example 86400
   */
  expires_in?: number;
}

export interface UpdateUserRequest {
  /** @example David Starsky */
  name?: string;

  /** @example david@example.com */
  email?: string;

  /** @example password */
  password?: string;

  /** @example Police detective */
  job_title?: string;
}

export interface UpdateTeamRequest {
  /** @example My Police Squad */
  name?: string;
}

export interface UpdateScheduleShiftRequest {
  /**
   * @format double
   * @example 1617032176.7171679
   */
  shift_start?: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  shift_end?: number;

  /**
   * @format int32
   * @min 1
   * @example 5
   */
  number_of_required_employees?: number;
}

export interface UpdateScheduleRequest {
  /** @example Next week's schedule */
  schedule_name?: string;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  schedule_start?: number;

  /**
   * @format double
   * @example 1617102176.7171679
   */
  schedule_end?: number;

  /**
   * @format int32
   * @min 0
   * @example 40
   */
  max_hours_per_employee?: number;

  /**
   * @format int32
   * @min 0
   * @example 5
   */
  max_shifts_per_employee?: number;

  /**
   * @format int32
   * @min 0
   * @example 8
   */
  max_hours_per_shift?: number;
}

export interface UpdateEmployeeAvailabilityRequest {
  /**
   * @format double
   * @example 1617032176.7171679
   */
  availability_start?: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  availability_end?: number;

  /**
   * @format int32
   * @min 1
   * @example 8
   */
  max_hours_per_shift?: number;
}

export interface VersionResponse {
  /** @example 1.0.0 */
  version?: string;
}

export interface ForbiddenResponse {
  /** @example Currently authenticated user does not have necessary permissions to access this resource. */
  error?: string;
}

export interface ScheduleUnsolvableResponse {
  /** @example Schedule could not be solved because it does not have any shifts assigned. */
  error?: string;
}

export interface EmployeeAssignmentResponse {
  /**
   * @format int64
   * @example 1
   */
  id?: number;

  /**
   * @format double
   * @example 1617032176.7171679
   */
  assignment_start?: number;

  /**
   * @format double
   * @example 1617052176.7171679
   */
  assignment_end?: number;

  /**
   * @format int64
   * @example 1
   */
  employee_id?: number;

  /**
   * @format int64
   * @example 3
   */
  shift_id?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Starsky API
 * @baseUrl http://localhost:8080/api
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * @description Get all of the employee assignments for the specified schedule.
     *
     * @tags Employee assignment
     * @name GetEmployeeAssignments
     * @summary Get employee assignments
     * @request GET:/user/schedules/{schedule_id}/assignments
     * @secure
     */
    getEmployeeAssignments: (scheduleId: number, params: RequestParams = {}) =>
      this.request<EmployeeAssignmentResponse[], void>({
        path: `/user/schedules/${scheduleId}/assignments`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates or updates a schedule with all of the specified schedule employee assignments. Please note that this operation can be destructive - it will always delete all of the previous/existing employee assignments (if they exist) for the specified schedule and create or update with the new ones. Authenticated user must have manager role.
     *
     * @tags Employee assignment
     * @name CreateEmployeeAssignment
     * @summary Create or update employee assignments
     * @request PUT:/user/schedules/{schedule_id}/assignments
     * @secure
     */
    createEmployeeAssignment: (
      scheduleId: number,
      data: CreateEmployeeAssignmentRequest[],
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/user/schedules/${scheduleId}/assignments`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the teams the user owns (manager) or the ones he is part of (employee).
     *
     * @tags Team
     * @name GetTeams
     * @summary Get user's teams
     * @request GET:/user/teams
     * @secure
     */
    getTeams: (params: RequestParams = {}) =>
      this.request<TeamResponse[], void>({
        path: `/user/teams`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new team - manager only route. Team name must be unique for this user, can't have 2 teams with same name.
     *
     * @tags Team
     * @name CreateTeam
     * @summary Create a new team
     * @request POST:/user/teams
     * @secure
     */
    createTeam: (data: CreateTeamRequest, params: RequestParams = {}) =>
      this.request<TeamResponse[], void>({
        path: `/user/teams`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new schedule that is assigned to the specified team. Authenticated user must have manager role.
     *
     * @tags Schedule
     * @name CreateSchedule
     * @summary Create a new schedule
     * @request POST:/user/teams/{team_id}/schedules
     * @secure
     */
    createSchedule: (teamId: number, data: CreateScheduleRequest, params: RequestParams = {}) =>
      this.request<ScheduleResponse, void>({
        path: `/user/teams/${teamId}/schedules`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a new team member (an employee with user ID) to a team - manager only route.
     *
     * @tags Team
     * @name CreateTeamMember
     * @summary Add a new team member
     * @request POST:/user/teams/{team_id}/members/{user_id}
     * @secure
     */
    createTeamMember: (teamId: number, userId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/teams/${teamId}/members/${userId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Deletes the team member from the team. Authenticated user must have manager role.
     *
     * @tags Team
     * @name DeleteTeamMember
     * @summary Delete team member
     * @request DELETE:/user/teams/{team_id}/members/{user_id}
     * @secure
     */
    deleteTeamMember: (teamId: number, userId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/teams/${teamId}/members/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a list of all employee availabilities. Managers may access all employee availabilities, while employees will need to be in the specified schedule's team to access this resource.
     *
     * @tags Employee availability
     * @name GetEmployeeAvailabilities
     * @summary Get all employee availabilities
     * @request GET:/user/shifts/{shift_id}/availabilities
     * @secure
     */
    getEmployeeAvailabilities: (shiftId: number, params: RequestParams = {}) =>
      this.request<EmployeeAvailabilityResponse[], ForbiddenResponse | void>({
        path: `/user/shifts/${shiftId}/availabilities`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new employee availability that is assigned to the specified schedule shift. Authenticated user must have manager role.
     *
     * @tags Employee availability
     * @name CreateEmployeeAvailability
     * @summary Create a new employee availability
     * @request POST:/user/shifts/{shift_id}/availabilities
     * @secure
     */
    createEmployeeAvailability: (
      shiftId: number,
      data: CreateEmployeeAvailabilityRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmployeeAvailabilityResponse, void>({
        path: `/user/shifts/${shiftId}/availabilities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of all schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule's team to access this resource.
     *
     * @tags Schedule Shift
     * @name GetScheduleShifts
     * @summary Get all schedule shifts
     * @request GET:/user/schedules/{schedule_id}/shifts
     * @secure
     */
    getScheduleShifts: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ScheduleShiftResponse[], ForbiddenResponse | void>({
        path: `/user/schedules/${scheduleId}/shifts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new schedule shift that is assigned to the specified schedule. Authenticated user must have manager role.
     *
     * @tags Schedule Shift
     * @name CreateScheduleShift
     * @summary Create a new schedule shift
     * @request POST:/user/schedules/{schedule_id}/shifts
     * @secure
     */
    createScheduleShift: (scheduleId: number, data: CreateScheduleShiftRequest, params: RequestParams = {}) =>
      this.request<ScheduleShiftResponse, void>({
        path: `/user/schedules/${scheduleId}/shifts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the currently authenticated user's invites. Authenticated user must have manager role.
     *
     * @tags Invite
     * @name GetInvites
     * @summary Get all sent invites
     * @request GET:/user/invites
     * @secure
     */
    getInvites: (params: RequestParams = {}) =>
      this.request<InviteResponse[], void>({
        path: `/user/invites`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Send an invite email to the specified employee so they can create a new Starsky account and join the manager's team. Authenticated user must have manager role.
     *
     * @tags Invite
     * @name CreateInvite
     * @summary Send a new invite
     * @request POST:/user/invites
     * @secure
     */
    createInvite: (data: CreateInviteRequest, params: RequestParams = {}) =>
      this.request<InviteResponse, void>({
        path: `/user/invites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the currently authenticated user's information.
     *
     * @tags User
     * @name GetUser
     * @summary Get the authenticated user
     * @request GET:/user
     * @secure
     */
    getUser: (params: RequestParams = {}) =>
      this.request<UserResponse, void>({
        path: `/user`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update specified properties of the currently authenticated user.
     *
     * @tags User
     * @name UpdateUser
     * @summary Update user
     * @request PATCH:/user
     * @secure
     */
    updateUser: (data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<UserResponse, void>({
        path: `/user`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes the team. This will also cascade delete team members. Authenticated user must have manager role.
     *
     * @tags Team
     * @name DeleteTeam
     * @summary Delete team
     * @request DELETE:/user/teams/{team_id}
     * @secure
     */
    deleteTeam: (teamId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/teams/${teamId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Update the specified team. Authenticated user must have manager role.
     *
     * @tags Team
     * @name UpdateTeam
     * @summary Update team
     * @request PATCH:/user/teams/{team_id}
     * @secure
     */
    updateTeam: (teamId: number, data: UpdateTeamRequest, params: RequestParams = {}) =>
      this.request<TeamResponse, void>({
        path: `/user/teams/${teamId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the specified schedule shifts. Managers may access all schedule shifts, while employees will need to be in the specified schedule's team to access this resource.
     *
     * @tags Schedule Shift
     * @name GetScheduleShift
     * @summary Get schedule shift
     * @request GET:/user/shifts/{shift_id}
     * @secure
     */
    getScheduleShift: (shiftId: number, params: RequestParams = {}) =>
      this.request<ScheduleShiftResponse, ForbiddenResponse | void>({
        path: `/user/shifts/${shiftId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a schedule shift. This will also cascade delete employee availabilities. Authenticated user must have manager role.
     *
     * @tags Schedule Shift
     * @name DeleteScheduleShift
     * @summary Delete schedule shift
     * @request DELETE:/user/shifts/{shift_id}
     * @secure
     */
    deleteScheduleShift: (shiftId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/shifts/${shiftId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Update any property of the specified shift. Authenticated user must have manager role.
     *
     * @tags Schedule Shift
     * @name UpdateScheduleShift
     * @summary Update schedule shift
     * @request PATCH:/user/shifts/{shift_id}
     * @secure
     */
    updateScheduleShift: (shiftId: number, data: UpdateScheduleShiftRequest, params: RequestParams = {}) =>
      this.request<ScheduleShiftResponse, void>({
        path: `/user/shifts/${shiftId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a schedule with specified id. Managers can get all schedules they created, while employees may only get schedules from their team.
     *
     * @tags Schedule
     * @name GetScheduleById
     * @summary Get schedule by id
     * @request GET:/user/schedules/{schedule_id}
     * @secure
     */
    getScheduleById: (scheduleId: number, params: RequestParams = {}) =>
      this.request<ScheduleResponse, void>({
        path: `/user/schedules/${scheduleId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a specified schedule. This will also cascade delete schedule shifts and employee availabilities. Authenticated user must have manager role.
     *
     * @tags Schedule
     * @name DeleteSchedule
     * @summary Delete schedule
     * @request DELETE:/user/schedules/{schedule_id}
     * @secure
     */
    deleteSchedule: (scheduleId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/schedules/${scheduleId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Update any property of the specified schedule. Authenticated user must have manager role.
     *
     * @tags Schedule
     * @name UpdateSchedule
     * @summary Update schedule
     * @request PATCH:/user/schedules/{schedule_id}
     * @secure
     */
    updateSchedule: (scheduleId: number, data: UpdateScheduleRequest, params: RequestParams = {}) =>
      this.request<ScheduleResponse, void>({
        path: `/user/schedules/${scheduleId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the specified employee availability. Managers may access all employee availabilities, while employees will need to be in the specified schedule's team to access this resource.
     *
     * @tags Employee availability
     * @name GetEmployeeAvailability
     * @summary Get employee availability
     * @request GET:/user/availabilities/{availability_id}
     * @secure
     */
    getEmployeeAvailability: (availabilityId: number, params: RequestParams = {}) =>
      this.request<EmployeeAvailabilityResponse, ForbiddenResponse | void>({
        path: `/user/availabilities/${availabilityId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an employee availability. Authenticated user must have manager role.
     *
     * @tags Employee availability
     * @name DeleteEmployeeAvailability
     * @summary Delete employee availability
     * @request DELETE:/user/availabilities/{availability_id}
     * @secure
     */
    deleteEmployeeAvailability: (availabilityId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/availabilities/${availabilityId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Update any property (except actual employee) of the specified employee availability. Authenticated user must have manager role.
     *
     * @tags Employee availability
     * @name UpdateEmployeeAvailability
     * @summary Update employee availability
     * @request PATCH:/user/availabilities/{availability_id}
     * @secure
     */
    updateEmployeeAvailability: (
      availabilityId: number,
      data: UpdateEmployeeAvailabilityRequest,
      params: RequestParams = {},
    ) =>
      this.request<EmployeeAvailabilityResponse, void>({
        path: `/user/availabilities/${availabilityId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of team members of the specified team.
     *
     * @tags Team
     * @name GetTeamMembers
     * @summary Get team members
     * @request GET:/user/teams/{team_id}/members
     * @secure
     */
    getTeamMembers: (teamId: number, params: RequestParams = {}) =>
      this.request<UserResponse[], void>({
        path: `/user/teams/${teamId}/members`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of all schedules. Optionally you can filter by team by supplying the query parameter.
     *
     * @tags Schedule
     * @name GetSchedules
     * @summary Get all schedules
     * @request GET:/user/schedules
     * @secure
     */
    getSchedules: (query?: { team_id?: number }, params: RequestParams = {}) =>
      this.request<ScheduleResponse[], void>({
        path: `/user/schedules`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the solved schedule with employee assignments. Manager only route.
     *
     * @tags Schedule
     * @name SolveScheduleById
     * @summary Get solved schedule's employee assignments
     * @request GET:/user/schedules/{schedule_id}/solve
     * @secure
     */
    solveScheduleById: (scheduleId: number, params: RequestParams = {}) =>
      this.request<string, void | ScheduleUnsolvableResponse>({
        path: `/user/schedules/${scheduleId}/solve`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the invite by id. Authenticated user must have manager role.
     *
     * @tags Invite
     * @name GetInviteById
     * @summary Get sent invite
     * @request GET:/user/invites/{invite_id}
     * @secure
     */
    getInviteById: (inviteId: number, params: RequestParams = {}) =>
      this.request<InviteResponse, void>({
        path: `/user/invites/${inviteId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an invite. The invited employee will not be able to register after this operation.  Authenticated user must have manager role.
     *
     * @tags Invite
     * @name DeleteInvite
     * @summary Delete invite
     * @request DELETE:/user/invites/{invite_id}
     * @secure
     */
    deleteInvite: (inviteId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/invites/${inviteId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the currently authenticated user's employees - manager only route.
     *
     * @tags Employee
     * @name GetEmployees
     * @summary Get the authenticated manager's employees
     * @request GET:/user/employees
     * @secure
     */
    getEmployees: (params: RequestParams = {}) =>
      this.request<UserResponse[], void>({
        path: `/user/employees`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if the currently authenticated user has correct credentials (has logged in and has supplied correct bearer JWT token in header).
     *
     * @tags User
     * @name ValidateAuthentication
     * @summary Check if currently authenticated user is valid
     * @request GET:/user/authentication
     * @secure
     */
    validateAuthentication: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/authentication`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * @description You can register a new user with the manager role by only supplying their name, email, password and job title. By adding a valid invite token (which the employee receives by mail) to the request body, the newly registered user will have the employee role.
     *
     * @tags User
     * @name CreateUser
     * @summary Register a new user
     * @request POST:/users
     */
    createUser: (data: CreateUserRequest, params: RequestParams = {}) =>
      this.request<UserResponse, void | InviteInvalidResponse>({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Login an existing user with their email and password. The API will return a newly created JWT Bearer token with its expiry date.
     *
     * @tags Authentication
     * @name Login
     * @summary Login an existing user
     * @request POST:/login
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<TokenResponse, void>({
        path: `/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  version = {
    /**
     * @description Return the current version of the API which is specified inside gradle.build file.
     *
     * @tags Version
     * @name GetVersion
     * @summary Get current version
     * @request GET:/version
     */
    getVersion: (params: RequestParams = {}) =>
      this.request<VersionResponse, any>({
        path: `/version`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
