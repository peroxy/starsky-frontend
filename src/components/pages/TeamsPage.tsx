import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBarV2 } from '../NavigationBar';
import { useLocation } from 'react-router-dom';
import { TeamResponse, UserResponse } from '../../api/__generated__';
import { Button, Dimmer, Icon, List, Loader } from 'semantic-ui-react';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';
import { responseToString } from '../../api/httpHelpers';
import { TeamModal } from '../modals/TeamModal';

export const TeamsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);

    const [employees, setEmployees] = useState<UserResponse[]>([]);

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
            apis.employeeApi.getEmployees().then((value) => {
                setEmployees(value);
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

            <TeamModal
                modalHeader={'Create a new team'}
                employees={employees}
                modalOkButtonText={'Create'}
                trigger={<Button color={'green'} icon={'users'} content={'Create a new team'} className={'left-margin right-margin'} size={'big'} />}
                onOkButtonClick={handleCreateTeamButton}
            />

            <List divided relaxed size={'massive'} selection className={'left-margin right-margin'}>
                {teams.map((team) => (
                    <List.Item key={team.id}>
                        <Icon name={'users'} />
                        <List.Content>
                            <List.Header as={'a'}>{team.name}</List.Header>
                            <List.Description>Lead: {team.ownerName}</List.Description>
                            <TeamModal
                                modalHeader={'Edit team'}
                                employees={employees}
                                modalOkButtonText={'Save'}
                                trigger={<Button color={'orange'} icon={'edit'} content={'Edit team'} className={'left-margin right-margin'} size={'small'} />}
                                onOkButtonClick={handleEditTeamButton}
                                teamName={team.name}
                                getTeamMembers={apis.teamApi.getTeamMembers({ teamId: team.id as number })}
                            />
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    );

    async function handleCreateTeamButton(teamName: string, teamMembers: UserResponse[]) {
        const team = await apis.teamApi.postTeam({ createTeamRequest: { name: teamName } });
        await apis.teamApi.putTeamMembers({
            teamId: team.id as number,
            createTeamMemberRequest: teamMembers.map((value) => ({ employeeId: value.id as number })),
        });
        setTeams((previousState) => [...previousState, team]);
    }

    async function handleEditTeamButton(teamName: string, teamMembers: UserResponse[]) {
        //TODO: will have to pass team ID aswell here to update the state in the list
        throw Error('TODO: NOT IMPLEMENTED');
    }
};
