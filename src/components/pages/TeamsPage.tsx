import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBarV2 } from '../NavigationBar';
import { useLocation } from 'react-router-dom';
import { TeamResponse, UserResponse } from '../../api/__generated__';
import { Button, Dimmer, List, Loader } from 'semantic-ui-react';
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

            <List divided relaxed size={'massive'} className={'left-margin right-margin'} selection>
                {teams.map((team) => (
                    <List.Item key={team.id}>
                        <TeamModal
                            modalHeader={'Edit team'}
                            employees={employees}
                            modalOkButtonText={'Save'}
                            trigger={
                                <List.Content>
                                    <List.Header as="a" className={'truncate'}>
                                        {team.name}
                                    </List.Header>
                                    <List.Description>Lead: {team.ownerName}</List.Description>
                                </List.Content>
                            }
                            onOkButtonClick={handleEditTeamButton}
                            onDeleteButtonClick={handleDeleteTeamButton}
                            team={team}
                            getTeamMembers={() => apis.teamApi.getTeamMembers({ teamId: team.id as number })}
                        />
                    </List.Item>
                ))}
            </List>
        </>
    );

    async function handleCreateTeamButton(team: TeamResponse, teamMembers: UserResponse[]) {
        team = await apis.teamApi.postTeam({ createTeamRequest: { name: team.name as string } });
        if (teamMembers.length > 0) {
            await apis.teamApi.putTeamMembers({
                teamId: team.id as number,
                createTeamMemberRequest: teamMembers.map((value) => ({ employeeId: value.id as number })),
            });
        }
        setTeams((previousState) => [...previousState, team]);
    }

    async function handleEditTeamButton(team: TeamResponse, teamMembers: UserResponse[], teamMembersUpdated?: boolean) {
        const existingTeam = teams.find((value) => value.id == team.id);
        if (existingTeam && existingTeam.name != team.name) {
            team = await apis.teamApi.patchTeam({ teamId: team.id as number, updateTeamRequest: { name: team.name } });
        }
        if (teamMembersUpdated) {
            await apis.teamApi.putTeamMembers({
                teamId: team.id as number,
                createTeamMemberRequest: teamMembers.map((value) => ({ employeeId: value.id as number })),
            });
        }
        const updatedTeams = [...teams];
        updatedTeams[updatedTeams.findIndex((value) => value.id == team.id)] = team;
        setTeams(updatedTeams);
    }

    async function handleDeleteTeamButton(teamId: number) {
        await apis.teamApi.deleteTeam({ teamId: teamId });
        setTeams(teams.filter((team) => team.id != teamId));
    }
};
