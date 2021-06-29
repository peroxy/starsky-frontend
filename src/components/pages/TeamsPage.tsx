import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ActiveMenuItem, NavigationBarV2 } from '../NavigationBar';
import { useLocation } from 'react-router-dom';
import { TeamResponse, UserResponse } from '../../api/__generated__';
import { Button, Dimmer, Divider, Dropdown, Form, Grid, GridColumn, Header, Icon, Input, Label, List, Loader, Message, Modal, Table } from 'semantic-ui-react';
import { useApi } from '../../api/starskyApiClient';
import { useAuth } from '../AuthProvider';
import { responseToString } from '../../api/httpHelpers';
import { TeamModal } from '../modals/TeamModal';

export const TeamsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [modalOpen, setModalOpen] = React.useState(false);

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
                                //TODO: teamMembers=()=>UserResponse[] <-- change teammembers to a function call so we dont have to load all of team members of all teams.. this should be probably just apis.teamApi call?
                            />
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    );

    async function handleCreateTeamButton(teamName: string, teamMembers: UserResponse[]) {
        const team = await apis.teamApi.createTeam({ createTeamRequest: { name: teamName } });
        const assignTeamMemberPromises: Promise<void>[] = [];
        for (const teamMember of teamMembers) {
            //TODO: this will only assign, but also has to delete the previous team members.. should first implement the PUT method at backend...
            assignTeamMemberPromises.push(apis.teamApi.createTeamMember({ teamId: team.id as number, userId: teamMember.id as number }));
        }
        await Promise.all(assignTeamMemberPromises);
    }

    async function handleEditTeamButton(teamName: string, teamMembers: UserResponse[]) {
        throw Error('TODO: NOT IMPLEMENTED');
    }
};
