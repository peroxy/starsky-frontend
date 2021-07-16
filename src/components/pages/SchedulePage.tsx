import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Dimmer, Form, Grid, GridColumn, Label, Loader, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { ScheduleResponse, UserResponse } from '../../api/__generated__';
import { responseToString } from '../../api/httpHelpers';
import NotFound, { GoBackTo } from '../NotFound';
import { epochToDate } from '../../util/dateHelper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMediaQuery } from 'react-responsive';
import { MAX_MOBILE_WIDTH } from '../../util/mediaConstants';

export const SchedulePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
    const { token } = useAuth();
    const apis = useApi(token);
    const isMobile = useMediaQuery({ query: `(max-width: ${MAX_MOBILE_WIDTH}px)` });

    const formName = 'formSchedule';
    const formScheduleName = 'formScheduleName';
    const formScheduleFrom = 'formScheduleFrom';
    const formScheduleTo = 'formScheduleTo';

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

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(responseToString(reason));
                setNotFound(true);
            })
            .finally(() => setLoading(false));
    }

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
                <Segment className="left-margin" floated="left" as={Form}>
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
                </Segment>
            </NavigationBar>
        </>
    );
};
