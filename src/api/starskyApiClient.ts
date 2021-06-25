import {env} from "../util/envHelper";
import {
    AuthenticationApi,
    Configuration,
    EmployeeApi,
    EmployeeAssignmentApi,
    EmployeeAvailabilityApi,
    InviteApi,
    ScheduleApi,
    ScheduleShiftApi,
    TeamApi,
    UserApi,
    VersionApi
} from "./__generated__";

export type Apis = {
    authenticationApi: AuthenticationApi,
    employeeApi: EmployeeApi,
    employeeAssignmentApi: EmployeeAssignmentApi,
    employeeAvailabilityApi: EmployeeAvailabilityApi,
    inviteApi: InviteApi,
    scheduleApi: ScheduleApi,
    scheduleShiftApi: ScheduleShiftApi,
    teamApi: TeamApi,
    userApi: UserApi,
    versionApi: VersionApi
};

const basePath = env("REACT_APP_BACKEND_HOST");


export function useApi(accessToken: string | null): Apis {
    let configuration: Configuration = new Configuration({
        basePath: basePath,
        accessToken: accessToken ? accessToken : undefined
    });

    return {
        authenticationApi: new AuthenticationApi(configuration),
        employeeApi: new EmployeeApi(configuration),
        employeeAssignmentApi: new EmployeeAssignmentApi(configuration),
        employeeAvailabilityApi: new EmployeeAvailabilityApi(configuration),
        inviteApi: new InviteApi(configuration),
        scheduleApi: new ScheduleApi(configuration),
        teamApi: new TeamApi(configuration),
        userApi: new UserApi(configuration),
        scheduleShiftApi: new ScheduleShiftApi(configuration),
        versionApi: new VersionApi(configuration)
    };
}