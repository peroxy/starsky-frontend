import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBarV2 } from '../NavigationBar';
import { useLocation } from 'react-router-dom';
import { TeamResponse, UserResponse } from '../../api/__generated__';
import { Dimmer, Icon, List, Loader } from 'semantic-ui-react';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';
import { responseToString } from '../../api/httpHelpers';

export const TeamsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);

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
            apis.teamApi.getTeams().then((value) => {
                setTeams(value);
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
            <NavigationBarV2 activeMenuItem={ActiveMenuItem.Teams} authenticatedUser={authenticatedUser!} />
            <Helmet title={'Teams | Starsky'} />
            <List divided relaxed size={'massive'} selection className={'left-margin right-margin'}>
                {teams.map((team) => (
                    <List.Item key={team.id}>
                        <Icon name={'users'} />
                        <List.Content>
                            <List.Header as={'a'}>{team.name}</List.Header>
                            <List.Description>Lead: {team.ownerName}</List.Description>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    );
};
