import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ScheduleResponse, UserResponse } from '../../api/__generated__';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { responseToString } from '../../api/httpHelpers';
import { Dimmer, Icon, List, Loader } from 'semantic-ui-react';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';

export const SchedulesPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

    const location = useLocation();

    const { token } = useAuth();
    const apis = useApi(token);

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

        loadData.push(
            apis.scheduleApi.getSchedules({}).then((response) => {
                setSchedules(response);
            }),
        );

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(responseToString(reason));
            })
            .finally(() => setLoading(false));
    }

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <>
            <Helmet title={'Schedules | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Schedules} authenticatedUser={authenticatedUser!}>
                <List divided relaxed size={'big'} selection className={'left-margin right-margin'}>
                    {schedules.map((schedule) => (
                        <List.Item key={schedule.id}>
                            <Icon name={'clock'} />
                            <List.Content>
                                <List.Header as={'a'}>{schedule.scheduleName}</List.Header>
                                <List.Description>Job title: {schedule.scheduleStart}</List.Description>
                                <List.Description>E-mail: {schedule.scheduleEnd}</List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </NavigationBar>
        </>
    );
};
