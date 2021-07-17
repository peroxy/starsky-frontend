import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Dimmer, Divider, Form, Grid, GridColumn, Loader, Segment } from 'semantic-ui-react';
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

export const SchedulePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number>();
    const [notFound, setNotFound] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
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

        if (id) {
            const scheduleId = parseInt(id);
            loadData.push(
                apis.scheduleApi.getScheduleById({ scheduleId: scheduleId }).then((response) => {
                    setSchedule(response);
                }),
            );
        }

        loadData.push(apis.teamApi.getTeams().then((response) => setTeams(response)));

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(responseToString(reason));
                setNotFound(true);
            })
            .finally(() => setLoading(false));
    }

    function getFirstFormColumn() {
        return (
            <>
                <Form.Input
                    defaultValue={schedule?.scheduleName}
                    labelPosition="left"
                    label="Schedule name:"
                    name={formScheduleName}
                    required
                    minLength={1}
                    placeholder="My Schedule"
                    icon="tag"
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
                />
                <Form.Dropdown
                    placeholder="Select Team"
                    search
                    label="Team:"
                    required
                    selection
                    options={teams.map((team) => {
                        return { text: team.name, key: team.id, value: team.id, icon: 'users' };
                    })}
                    defaultValue={schedule?.teamId}
                    onChange={(event, data) => setSelectedTeamId(data.value as number)}
                />
            </>
        );
    }

    function getSecondFormColumn() {
        return (
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
    }

    function getScheduleButton() {
        let content = 'Create';
        if (schedule) {
            content = 'Save';
        }
        return (
            <Grid columns={2}>
                <GridColumn>
                    <Button content="Delete" icon="trash" negative floated={'left'} />
                </GridColumn>
                <GridColumn>
                    <Button content={content} icon="checkmark" positive floated={'right'} />
                </GridColumn>
            </Grid>
        );
    }

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
            <Segment as={Form} name={formName} className={segmentClass}>
                {segmentChildren}
            </Segment>
        );
    };

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : notFound ? (
        <NotFound header="Schedule Not Found" goBackWhere={GoBackTo.Schedules} />
    ) : (
        <>
            <Helmet title={'Schedule | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Schedules} authenticatedUser={authenticatedUser!}>
                {getLayout()}
            </NavigationBar>
        </>
    );
};
