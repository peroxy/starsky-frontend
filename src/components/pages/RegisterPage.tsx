import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Dimmer, Divider, Form, Grid, Header, Image, Loader, Message, Segment, Transition } from 'semantic-ui-react';
import logo from '../../images/logo.png';
import { LOGIN_ROUTE, TEAMS_ROUTE } from '../../routing/routeConstants';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useApi } from '../../api/starskyApiClient';
import { CreateUserRequest, InviteInvalidResponse, LoginRequest, UserResponse } from '../../api/__generated__';
import { HttpStatusCode, responseToString } from '../../api/httpHelpers';

export function RegisterPage(): JSX.Element {
    const [alertDescription, setAlertDescription] = useState('');
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { setToken, clearToken, token } = useAuth();

    const formEmail = 'registerEmail';
    const formPassword = 'registerPassword';
    const formName = 'registerName';
    const formJobTitle = 'registerJobTitle';
    const formPasswordConfirm = 'registerPasswordConfirm';

    const [inviteHeader, setInviteHeader] = useState('');
    const [showInviteHeader, setShowInviteHeader] = useState(false);

    const history = useHistory();
    const apis = useApi(token);

    interface QueryParams {
        registerToken: string | null;
        name: string | null;
        email: string | null;
        manager: string | null;
    }

    const getQueryParams = (url: string): QueryParams => {
        const query = new URLSearchParams(url);
        return {
            name: query.get('name'),
            email: query.get('email'),
            registerToken: query.get('token'),
            manager: query.get('manager'),
        };
    };

    const { search } = useLocation();
    const queryParams = getQueryParams(search);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        setLoading(true);
        if (token != null) {
            await apis.userApi
                .validateAuthentication()
                .then(() => {
                    history.replace(TEAMS_ROUTE);
                })
                .catch((reason: Response) => {
                    console.error(responseToString(reason));
                    clearToken();
                });
        }

        if (queryParams.registerToken == null) {
            setShowInviteHeader(false);
            setLoading(false);
            return;
        }

        if (queryParams.email != null && queryParams.name != null && queryParams.manager != null) {
            //TODO: rework this to use state and defaultValue field instead
            const emailNode = document.getElementById(formEmail) as HTMLInputElement;
            if (emailNode) {
                emailNode.value = queryParams.email;
            }
            const nameNode = document.getElementById(formName) as HTMLInputElement;
            if (nameNode) {
                nameNode.value = queryParams.name;
            }
            setInviteHeader(`You have been invited by ${queryParams.manager}!`);
            setShowInviteHeader(true);
        }
        setLoading(false);
    }

    /*
      Register a new user - event that gets triggered on registration form submittal.
     */
    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        setAlert(false);
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const password = formData.get(formPassword) as string;
        const passwordConfirm = formData.get(formPasswordConfirm) as string;

        if (password != passwordConfirm) {
            setPasswordsMatch(false);
            setLoading(false);
            return;
        }

        setPasswordsMatch(true);

        const request: CreateUserRequest = {
            email: formData.get(formEmail) as string,
            password: password,
            name: formData.get(formName) as string,
            jobTitle: formData.get(formJobTitle) as string,
            inviteToken: showInviteHeader ? (queryParams.registerToken as string) : undefined,
        };

        try {
            const userResponse = await apis.userApi.createUser({ createUserRequest: request });
            setAlertDescription('');
            await loginNewUser(userResponse, { email: request.email, password: request.password as string });
        } catch (error) {
            console.error(error);
            let alertMessage = 'Registration failed.';
            if (error instanceof Response) {
                if (error.status === HttpStatusCode.CONFLICT) {
                    alertMessage = `Email (${request.email}) already exists!`;
                } else if (error.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    const errorResponse = (await error.json()) as InviteInvalidResponse;
                    alertMessage = errorResponse.error as string;
                }
            }
            setAlertDescription(alertMessage);
            setAlert(true);
        } finally {
            setLoading(false);
        }
    };

    /*
        Logins the freshly registered user - this should probably be removed when email verification is implemented.
     */
    const loginNewUser = async (user: UserResponse, request: LoginRequest) => {
        return apis.authenticationApi
            .login({ loginRequest: request })
            .then((response) => {
                setAlertDescription('');
                setAlert(false);
                setToken(response.accessToken as string);
                history.push(TEAMS_ROUTE, user);
            })
            .catch((reason) => {
                setAlertDescription('Automatic login failed after registration!');
                console.error(reason);
                setAlert(true);
                clearToken();
            });
    };

    return (
        <div>
            <div hidden={!loading}>
                <Dimmer active inverted>
                    <Loader content="Please wait..." />
                </Dimmer>
            </div>
            <div hidden={loading}>
                <Helmet title={'Register | Starsky'} />
                <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" color="teal" textAlign="center">
                            <Image src={logo} /> Register a new account
                        </Header>
                        <Message
                            header={inviteHeader}
                            hidden={!showInviteHeader}
                            content={`We have prefilled your info supplied by ${queryParams.manager}, feel free to change it.`}
                            positive
                            compact
                            size={'small'}
                        />
                        <Form size="large" onSubmit={handleOnSubmit}>
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
                                />
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <Form.Input
                                            name={formPassword}
                                            fluid
                                            icon="lock"
                                            iconPosition="left"
                                            placeholder="Password"
                                            type="password"
                                            minLength={8}
                                            maxLength={72}
                                            required
                                            error={passwordsMatch ? false : "Passwords didn't match."}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input
                                            name={formPasswordConfirm}
                                            fluid
                                            placeholder="Confirm"
                                            type="password"
                                            minLength={8}
                                            maxLength={72}
                                            required
                                            error={!passwordsMatch}
                                        />
                                    </Grid.Column>
                                </Grid>
                                <Divider />

                                <Button color="teal" fluid size="large" type="submit">
                                    Register
                                </Button>
                            </Segment>
                        </Form>
                        <Transition visible={alert} animation="fade" duration={1000}>
                            <Message header={alertDescription} content={'Registration failed. Please try again.'} negative compact size={'small'} />
                        </Transition>
                        <Message>
                            Already have an account? <Link to={LOGIN_ROUTE}>Login now!</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        </div>
    );
}
