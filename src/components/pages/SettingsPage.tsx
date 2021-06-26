import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Dimmer, Divider, Form, Grid, GridColumn, Header, Icon, Image, List, Loader, Message, Segment, Transition } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { UserResponse } from '../../api/__generated__';
import { ActiveMenuItem, NavigationBarV2 } from '../NavigationBar';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';

export const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserResponse | null>(null);
    const [alertDescription, setAlertDescription] = useState('');
    const [alert, setAlert] = useState(false);

    const formEmail = 'registerEmail';
    const formPassword = 'registerPassword';
    const formPasswordConfirm = 'registerPasswordConfirm';
    const formName = 'registerName';
    const formJobTitle = 'registerJobTitle';

    const location = useLocation();

    const { token } = useAuth();
    const apis = useApi(token);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        if (location.state == null) {
            await apis.userApi
                .getUser()
                .then((response) => {
                    setAuthenticatedUser(response);
                })
                .catch((reason) => console.error(reason));
        } else {
            setAuthenticatedUser(location.state as UserResponse);
        }
        setLoading(false);
    }

    return loading ? (
        <Dimmer active inverted>
            <Loader content="Please wait..." />
        </Dimmer>
    ) : (
        <>
            <NavigationBarV2 activeMenuItem={ActiveMenuItem.Settings} authenticatedUser={authenticatedUser!} />
            <Helmet title={'Settings | Starsky'} />
            <Divider hidden />
            <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="top">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="teal" textAlign="center">
                        Edit your profile
                    </Header>
                    <Form size="large">
                        <Segment stacked>
                            <Form.Input
                                name={formName}
                                id={formName}
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Your name"
                                type="text"
                                required
                                minLength={1}
                                defaultValue={authenticatedUser?.name}
                            />
                            <Form.Input
                                name={formJobTitle}
                                fluid
                                icon="briefcase"
                                iconPosition="left"
                                placeholder="Job Title"
                                type="text"
                                minLength={1}
                                maxLength={128}
                                required
                                defaultValue={authenticatedUser?.jobTitle}
                            />
                            <Form.Input
                                name={formEmail}
                                id={formEmail}
                                fluid
                                icon="mail"
                                iconPosition="left"
                                placeholder="E-mail address"
                                type="email"
                                required
                                defaultValue={authenticatedUser?.email}
                            />
                            <Grid columns={2}>
                                <Grid.Column>
                                    <Form.Input
                                        name={formPassword}
                                        fluid
                                        icon="lock"
                                        iconPosition="left"
                                        placeholder="New Password"
                                        type="password"
                                        minLength={8}
                                        maxLength={72}
                                    />
                                </Grid.Column>
                                <Divider vertical />
                                <Grid.Column>
                                    <Form.Input
                                        name={formPasswordConfirm}
                                        fluid
                                        icon="lock"
                                        iconPosition="left"
                                        placeholder="Confirm"
                                        type="password"
                                        minLength={8}
                                        maxLength={72}
                                    />
                                </Grid.Column>
                            </Grid>
                            <Divider />

                            <Button color="teal" fluid size="large" type="submit">
                                Save
                            </Button>
                        </Segment>
                    </Form>
                    <Transition visible={alert} animation="fade" duration={1000}>
                        <Message header={alertDescription} content={'Saving failed. Please try again.'} negative compact size={'small'} />
                    </Transition>
                </Grid.Column>
            </Grid>
        </>
    );
};
