import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Dimmer, Divider, Form, Grid, GridColumn, Icon, Loader, Progress, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { ScheduleResponse, TeamResponse, UserResponse } from '../../api/__generated__';
import { responseToString } from '../../api/httpHelpers';
import NotFound, { GoBackTo } from '../NotFound';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMediaQuery } from 'react-responsive';
import { MAX_MOBILE_WIDTH } from '../../util/mediaConstants';
import { dateToEpoch, epochToDate } from '../../util/dateHelper';
import { ErrorModal } from '../modals/ErrorModal';
import { SCHEDULES_ROUTE } from '../../routing/routeConstants';
import { ErrorDetails, getErrorDetails, getErrorNotOccurred } from '../../util/errorHelper';
import { Scheduler } from '../Scheduler';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';

export const SchedulePage: React.FC = () => {
    const [loading, setLoading] = useState({ initialLoad: true, processing: false, autoSolve: false });
    const [solvingPercentage, setSolvingPercentage] = useState(0);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [teamMembers, setTeamMembers] = useState<UserResponse[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number>();
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState<ErrorDetails>(getErrorNotOccurred());
    const [showTeamFieldError, setShowTeamFieldError] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [notificationSent, setNotificationSent] = useState(false);

    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
    const history = useHistory();
    const { token } = useAuth();
    const apis = useApi(token);
    const isMobile = useMediaQuery({ query: `(max-width: ${MAX_MOBILE_WIDTH}px)` });

    const formName = 'formSchedule';
    const formScheduleName = 'formScheduleName';
    const formMaxHoursPerEmployee = 'formMaxHoursPerEmployee';
    const formMaxShiftsPerEmployee = 'formMaxShiftsPerEmployee';
    const formMaxHoursPerShift = 'formMaxHoursPerShift';

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        const loadData = [];

        if (location.state == null) {
            loadData.push(
                apis.userApi.getUser().then((response) => {
                    setAuthenticatedUser(response);
                }),
            );
        } else {
            setAuthenticatedUser(location.state as UserResponse);
        }

        if (id && id != 'new') {
            const scheduleId = parseInt(id);
            loadData.push(
                apis.scheduleApi.getScheduleById({ scheduleId: scheduleId }).then(async (response) => {
                    setSchedule(response);
                    setDateRange({ start: epochToDate(response.scheduleStart).toDate(), end: epochToDate(response.scheduleEnd).toDate() });
                    setSelectedTeamId(response.teamId);
                    await apis.teamApi.getTeamMembers({ teamId: response.teamId }).then((members) => setTeamMembers(members));
                }),
            );
        }

        loadData.push(apis.teamApi.getTeams().then((response) => setTeams(response)));

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(responseToString(reason));
                setNotFound(true);
            })
            .finally(() => setLoading({ initialLoad: false, processing: false, autoSolve: false }));
    }

    const getFirstFormColumn = () => (
        <>
            <Form.Input
                defaultValue={schedule?.scheduleName}
                labelPosition="left"
                label="Schedule name:"
                name={formScheduleName}
                required
                minLength={1}
                placeholder="My Schedule"
                icon="calendar"
                iconPosition="left"
            />
            <Form.Field label="Date range:" required style={{ marginBottom: 0 }} />
            <DatePicker
                selectsRange
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={(update: [Date, Date]) => setDateRange({ start: update[0], end: update[1] })}
                placeholderText="Click to select date range"
                required
                wrapperClassName="datePicker"
                calendarStartDay={1}
            />
            <Form.Dropdown
                floating
                labeled
                placeholder="Select Team"
                search
                label="Team:"
                required
                error={showTeamFieldError}
                selection
                options={teams.map((team) => {
                    return { text: team.name, key: team.id, value: team.id, icon: 'users' };
                })}
                defaultValue={schedule?.teamId}
                onChange={(event, data) => setSelectedTeamId(data.value as number)}
            />
        </>
    );

    const getSecondFormColumn = () => (
        <>
            <Form.Input
                defaultValue={schedule?.maxHoursPerEmployee}
                labelPosition="left"
                label="Max total hours per employee:"
                name={formMaxHoursPerEmployee}
                required
                placeholder="40"
                icon="user"
                iconPosition="left"
                type="number"
                min={1}
            />
            <Form.Input
                defaultValue={schedule?.maxHoursPerShift}
                labelPosition="left"
                label="Max hours per single shift:"
                name={formMaxHoursPerShift}
                required
                placeholder="8"
                icon="clock"
                iconPosition="left"
                type="number"
                min={1}
            />
            <Form.Input
                defaultValue={schedule?.maxShiftsPerEmployee}
                labelPosition="left"
                label="Max total shifts per employee:"
                name={formMaxShiftsPerEmployee}
                required
                placeholder="5"
                icon="user"
                iconPosition="left"
                type="number"
                min={1}
            />
        </>
    );

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedTeamId) {
            setShowTeamFieldError(true);
            return;
        }

        setError(getErrorNotOccurred());
        setLoading({ initialLoad: false, processing: true, autoSolve: false });
        const formData = new FormData(event.currentTarget);
        const scheduleName = formData.get(formScheduleName) as string;
        const maxEmployeeHours = parseInt(formData.get(formMaxHoursPerEmployee) as string);
        const maxShifts = parseInt(formData.get(formMaxShiftsPerEmployee) as string);
        const maxShiftHours = parseInt(formData.get(formMaxHoursPerShift) as string);

        let saveSchedule: Promise<ScheduleResponse>;
        if (schedule) {
            saveSchedule = apis.scheduleApi.patchSchedule({
                scheduleId: schedule.id,
                updateScheduleRequest: {
                    scheduleName: scheduleName,
                    maxHoursPerEmployee: maxEmployeeHours,
                    maxShiftsPerEmployee: maxShifts,
                    maxHoursPerShift: maxShiftHours,
                    teamId: selectedTeamId,
                    scheduleStart: dateToEpoch(dateRange.start!),
                    scheduleEnd: dateToEpoch(dateRange.end!),
                },
            });
        } else {
            saveSchedule = apis.scheduleApi.postSchedule({
                teamId: selectedTeamId as number,
                createScheduleRequest: {
                    scheduleName: scheduleName,
                    maxHoursPerEmployee: maxEmployeeHours,
                    maxShiftsPerEmployee: maxShifts,
                    maxHoursPerShift: maxShiftHours,
                    scheduleStart: dateToEpoch(dateRange.start!),
                    scheduleEnd: dateToEpoch(dateRange.end!),
                },
            });
        }
        await saveSchedule
            .then(async (response) => {
                setSchedule(response);
                window.history.replaceState(null, '', response.id.toString());
                await apis.teamApi.getTeamMembers({ teamId: response.teamId }).then((members) => setTeamMembers(members));
            })
            .catch(async (reason) => setError(await getErrorDetails(reason)))
            .finally(() => {
                setLoading({ initialLoad: false, processing: false, autoSolve: false });
                setShowTeamFieldError(false);
            });
    };

    const onDelete = async () => {
        if (!schedule) {
            return;
        }

        setLoading({ initialLoad: false, processing: true, autoSolve: false });
        setError(getErrorNotOccurred());

        await apis.scheduleApi
            .deleteSchedule({ scheduleId: schedule.id })
            .then(() => history.push(SCHEDULES_ROUTE, authenticatedUser))
            .catch(async (reason) => setError(await getErrorDetails(reason)))
            .finally(() => setLoading({ initialLoad: false, processing: false, autoSolve: false }));
    };

    const onAutoSolveConfirmed = async () => {
        if (!schedule) {
            return;
        }

        setLoading({ processing: false, initialLoad: false, autoSolve: true });

        const increaseProgress = setInterval(() => {
            setSolvingPercentage((prevState) => prevState + 0.5);
        }, 55);

        const solvedAssignments = await apis.scheduleApi
            .solveScheduleById({ scheduleId: schedule.id })
            .catch(async (reason) => setError(await getErrorDetails(reason)));

        if (!solvedAssignments) {
            setLoading({ initialLoad: false, processing: false, autoSolve: false });
            clearInterval(increaseProgress);
            setSolvingPercentage(0);
            return;
        }

        await apis.employeeAssignmentApi
            .putEmployeeAssignment({ scheduleId: schedule.id, putEmployeeAssignmentRequest: solvedAssignments })
            .catch(async (reason) => setError(await getErrorDetails(reason)))
            .finally(() => {
                clearInterval(increaseProgress);
                setSolvingPercentage(0);
                setLoading({ initialLoad: false, processing: false, autoSolve: false });
            });
    };

    const onEmployeeNotifyConfirmed = async () => {
        if (!schedule) {
            return;
        }
        setLoading({ processing: true, initialLoad: false, autoSolve: false });

        await apis.scheduleApi
            .notifyScheduleEmployees({ scheduleId: schedule.id })
            .then(() => setNotificationSent(true))
            .catch(async (reason) => setError(await getErrorDetails(reason)))
            .finally(() => setLoading({ initialLoad: false, processing: false, autoSolve: false }));
    };

    const getScheduleButton = () => {
        let content = 'Create';
        if (schedule) {
            content = 'Save';
        }
        return (
            <Grid columns={'equal'}>
                <GridColumn>
                    {schedule && (
                        <ConfirmActionModal
                            title={'Delete Schedule'}
                            message={`Are you sure you want to delete this schedule '${schedule.scheduleName}'? This will also delete any shifts/assignments.`}
                            icon={<Icon name={'trash'} />}
                            onConfirm={() => onDelete()}
                            trigger={<Button content="Delete" icon="trash" negative floated={'left'} type={'button'} disabled={loading.autoSolve} />}
                        />
                    )}
                </GridColumn>
                <GridColumn textAlign={'center'}>
                    {schedule && (
                        <>
                            <ConfirmActionModal
                                title={'Auto-solve schedule'}
                                message={`Automatically solve the schedule and suggest employee assignments for the created shifts.
                            Make sure you have created shifts for this schedule.
                            Please note that this will delete any existing employee assignments that might exist.`}
                                icon={<Icon name={'bolt'} />}
                                onConfirm={onAutoSolveConfirmed}
                                trigger={<Button content="Auto-solve schedule" primary icon="bolt" type={'button'} disabled={loading.autoSolve} />}
                            />

                            <ConfirmActionModal
                                title={'Notify employees'}
                                message={`Would you like to send an email notification to every employee that has a shift assigned for this schedule?`}
                                icon={<Icon name={'mail'} />}
                                onConfirm={onEmployeeNotifyConfirmed}
                                trigger={
                                    <Button
                                        content={notificationSent ? 'Notified successfully!' : 'Notify employees'}
                                        primary={!notificationSent}
                                        color={notificationSent ? 'green' : undefined}
                                        icon="mail"
                                        type={'button'}
                                        disabled={loading.autoSolve || notificationSent}
                                    />
                                }
                            />
                        </>
                    )}
                </GridColumn>
                <GridColumn>
                    <Button content={content} icon="checkmark" positive floated={'right'} type="submit" disabled={loading.autoSolve} />
                </GridColumn>
            </Grid>
        );
    };

    const getLayout = () => {
        let segmentClass = '';
        let segmentChildren = (
            <>
                <Grid columns="2">
                    <Grid.Column>{getFirstFormColumn()}</Grid.Column>
                    <Grid.Column>{getSecondFormColumn()}</Grid.Column>
                </Grid>
                <Divider />
                {getScheduleButton()}
            </>
        );

        if (isMobile) {
            segmentClass = 'left-margin right-margin';
            segmentChildren = (
                <>
                    {getFirstFormColumn()}
                    {getSecondFormColumn()}
                    <Divider />
                    {getScheduleButton()}
                </>
            );
        }
        return (
            <>
                <Segment as={Form} name={formName} className={segmentClass} loading={loading.processing} onSubmit={onSubmit} disabled={loading.autoSolve}>
                    {segmentChildren}
                    {error.occurred ? <ErrorModal error={error} onOkClick={() => setError(getErrorNotOccurred())} /> : null}
                </Segment>
                {loading.autoSolve ? (
                    <Progress
                        label={'Please wait...'}
                        autoSuccess
                        indicating
                        size={'large'}
                        percent={solvingPercentage}
                        style={{ margin: 'auto', width: '50%' }}
                    />
                ) : schedule ? (
                    <Scheduler schedule={schedule} employees={teamMembers} />
                ) : null}
            </>
        );
    };

    return loading.initialLoad ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : notFound ? (
        <NotFound header="Schedule Not Found" goBackWhere={GoBackTo.Schedules} />
    ) : (
        <>
            <Helmet title={'Schedule | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Schedules} authenticatedUser={authenticatedUser!} fullWidth>
                {getLayout()}
            </NavigationBar>
        </>
    );
};
