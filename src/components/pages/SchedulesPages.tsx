import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ScheduleResponse, TeamResponse, UserResponse } from '../../api/__generated__';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { Button, Dimmer, Icon, List, Loader } from 'semantic-ui-react';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { epochToDate } from '../../util/dateHelper';
import { SCHEDULE_ROUTE, TEAMS_ROUTE } from '../../routing/routeConstants';

export const SchedulesPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
    const [teams, setTeams] = useState<TeamResponse[]>([]);

    const location = useLocation();
    const history = useHistory();
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
            apis.scheduleApi.getSchedules({}).then((response) => setSchedules(response)),
            apis.teamApi.getTeams().then((response) => setTeams(response)),
        );

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.log(reason);
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
                <Button
                    content={'Create new schedule'}
                    icon="calendar alternate outline"
                    primary
                    size="big"
                    onClick={() => history.push(SCHEDULE_ROUTE.replace(':id', 'new'), authenticatedUser)}
                />
                <List divided relaxed size={'big'} selection className={'left-margin'}>
                    {schedules.map((schedule) => (
                        <List.Item key={schedule.id} onClick={() => history.push(SCHEDULE_ROUTE.replace(':id', schedule.id.toString()), authenticatedUser)}>
                            <Icon name={'calendar alternate outline'} />
                            <List.Content>
                                <List.Header as={'a'}>{schedule.scheduleName}</List.Header>
                                <List.Description>Team: {teams.find((value) => value.id == schedule.teamId)?.name}</List.Description>
                                <List.Description>
                                    {epochToDate(schedule.scheduleStart).toLocaleDateString()} - {epochToDate(schedule.scheduleEnd).toLocaleDateString()}
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </NavigationBar>
        </>
    );
};
