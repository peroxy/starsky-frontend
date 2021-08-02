import React, { ReactNode, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Dimmer, Grid, GridColumn, Icon, List, Loader } from 'semantic-ui-react';
import { ActiveMenuItem, NavigationBar } from '../NavigationBar';
import { InviteResponse, UserResponse } from '../../api/__generated__';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { ConfirmActionModal } from '../modals/ConfirmActionModal';
import { ErrorModal } from '../modals/ErrorModal';
import { ErrorDetails, getErrorDetails, getErrorNotOccurred } from '../../util/errorHelper';

export const InvitationsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<{ loading: boolean; inviteId: number }>({ loading: false, inviteId: -1 });
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [invites, setInvites] = useState<InviteResponse[]>([]);
    const [error, setError] = useState<ErrorDetails>(getErrorNotOccurred());

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
            apis.inviteApi.getInvites().then((response) => {
                setInvites(response);
            }),
        );

        await Promise.all(loadData)
            .catch((reason: Response) => {
                console.error(reason);
            })
            .finally(() => setLoading(false));
    }

    function getStatus(invite: InviteResponse, expiryDate: Date) {
        let status;
        let statusIcon: ReactNode;
        if (invite.hasRegistered) {
            status = 'Registered';
            statusIcon = <Icon name="check circle" />;
        } else if (new Date() > expiryDate) {
            status = 'Expired';
            statusIcon = <Icon name="warning circle" />;
        } else {
            status = 'Pending...';
            statusIcon = <Icon name="wait" />;
        }
        return { status, statusIcon };
    }

    async function handleOnConfirm(inviteId: number) {
        setError(getErrorNotOccurred());
        setDeleting({ loading: true, inviteId: inviteId });
        await apis.inviteApi
            .deleteInvite({ inviteId: inviteId })
            .then(() => {
                setInvites(invites.filter((invite) => invite.id != inviteId));
            })
            .catch(async (reason) => {
                setError(await getErrorDetails(reason));
            });
        setDeleting({ loading: false, inviteId: -1 });
    }

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <>
            <Helmet title={'Invitations | Starsky'} />
            <NavigationBar activeMenuItem={ActiveMenuItem.Invitations} authenticatedUser={authenticatedUser!}>
                {error.occurred ? <ErrorModal error={error} onOkClick={() => setError(getErrorNotOccurred())} /> : null}
                <List divided relaxed size={'big'} className={'left-margin right-margin'}>
                    {invites.map((invite) => {
                        const expiryDate = new Date(invite.expiresOn * 1000);
                        const { status, statusIcon } = getStatus(invite, expiryDate);
                        return (
                            <List.Item key={invite.id}>
                                <Grid>
                                    <GridColumn mobile={13} tablet={7} computer={3}>
                                        <List.Content>
                                            <List.Header>{invite.employeeName}</List.Header>
                                            <List.Description>{invite.employeeEmail}</List.Description>
                                            <List.Description>Expires: {expiryDate.toLocaleString()}</List.Description>
                                            <List.Description className="padded">
                                                <i>{status} </i>
                                                {statusIcon}
                                            </List.Description>
                                        </List.Content>
                                    </GridColumn>
                                    <GridColumn>
                                        <ConfirmActionModal
                                            title={'Delete Invite'}
                                            message={
                                                'Would you like to revoke this invite? ' +
                                                'This action is permanent - the employee will not be able to register with the invite link again and' +
                                                ' you will have to re-send the invite.'
                                            }
                                            icon={<Icon name={'trash alternate outline'} />}
                                            onConfirm={() => handleOnConfirm(invite.id)}
                                            trigger={
                                                <Button icon={'x'} loading={deleting.loading && invite.id === deleting.inviteId} disabled={deleting.loading} />
                                            }
                                        />
                                    </GridColumn>
                                </Grid>
                            </List.Item>
                        );
                    })}
                </List>
            </NavigationBar>
        </>
    );
};
