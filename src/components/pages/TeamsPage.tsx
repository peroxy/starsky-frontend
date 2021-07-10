import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
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
            <Helmet title={'Teams | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Teams} authenticatedUser={authenticatedUser!}>
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
                                getTeamMembers={() => apis.teamApi.getTeamMembers({ teamId: team.id })}
                            />
                        </List.Item>
                    ))}
                </List>
            </NavigationBar>
        </>
    );

    async function handleCreateTeamButton(teamName: string | undefined, teamId: number, teamMembers: UserResponse[]) {
        const team = await apis.teamApi.postTeam({ createTeamRequest: { name: teamName as string } });
        if (teamMembers.length > 0) {
            await apis.teamApi.putTeamMembers({
                teamId: team.id,
                createTeamMemberRequest: teamMembers.map((value) => ({ employeeId: value.id })),
            });
        }
        setTeams((previousState) => [...previousState, team]);
    }

    async function handleEditTeamButton(teamName: string | undefined, teamId: number, teamMembers: UserResponse[], teamMembersUpdated?: boolean) {
        let existingTeam = teams.find((value) => value.id == teamId);
        if (!existingTeam) {
            return;
        }
        if (existingTeam.name != teamName) {
            existingTeam = await apis.teamApi.patchTeam({ teamId: teamId, updateTeamRequest: { name: teamName } });
        }
        if (teamMembersUpdated) {
            await apis.teamApi.putTeamMembers({
                teamId: teamId,
                createTeamMemberRequest: teamMembers.map((value) => ({ employeeId: value.id })),
            });
        }
        const updatedTeams = [...teams];
        updatedTeams[updatedTeams.findIndex((value) => value.id == teamId)] = existingTeam;
        setTeams(updatedTeams);
    }

    async function handleDeleteTeamButton(teamId: number) {
        await apis.teamApi.deleteTeam({ teamId: teamId });
        setTeams(teams.filter((team) => team.id != teamId));
    }
};
