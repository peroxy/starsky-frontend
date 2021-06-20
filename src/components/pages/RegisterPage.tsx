import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet";
import {Button, Form, Grid, Header, Image, Message, Segment, Transition} from "semantic-ui-react";
import logo from "../../images/logo.png";
import {APP_ROUTE, LOGIN_ROUTE} from "../../routing/routeConstants";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useAuth} from "../AuthProvider";
import {useApi} from "../../api/starskyApiClient";
import {CreateUserRequest, LoginRequest, UserResponse} from "../../api/__generated__/starskyApi";
import {responseToString} from "../../api/httpHelpers";

export function RegisterPage() {

    const [alertDescription, setAlertDescription] = useState("");
    const [alert, setAlert] = useState(false);

    const {setToken, clearToken} = useAuth();

    const formEmail = "registerEmail";
    const formPassword = "registerPassword";
    const formName = "registerName";

    const [inviteHeader, setInviteHeader] = useState("");
    const [showInviteHeader, setShowInviteHeader] = useState(false);

    const history = useHistory()
    const apiClient = useApi({accessToken: null});

    interface QueryParams {
        registerToken: string | null,
        name: string | null,
        email: string | null,
        manager: string | null
    }

    const getQueryParams = (url: string): QueryParams => {
        const query = new URLSearchParams(url);
        return {
            name: query.get('name'),
            email: query.get('email'),
            registerToken: query.get('token'),
            manager: query.get('manager')
        };
    }

    const {search} = useLocation()
    const queryParams = getQueryParams(search);

    useEffect(() => {
        if (queryParams.registerToken == null) {
            setShowInviteHeader(false);
            return;
        }

        if (queryParams.email != null && queryParams.name != null && queryParams.manager != null) {
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
    }, []);

    /*
      Register a new user - event that gets triggered on registration form submittal.
     */
    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const request : CreateUserRequest = {
            email: formData.get(formEmail) as string,
            password: formData.get(formPassword) as string,
            name: formData.get(formName) as string,
            job_title: "TODO",
            invite_token: showInviteHeader ? queryParams.registerToken as string : undefined
        };
        const response = await apiClient.users.createUser(request);
        if (response.ok) {
            setAlertDescription("");
            setAlert(false);
            await loginNewUser(response.data, {email: request.email, password: request.password as string}, form);
        } else {
            setAlertDescription(await responseToString(response));
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        }
    }

    /*
        Logins the freshly registered user - this should probably be removed when email verification is implemented.
     */
    const loginNewUser = async (user: UserResponse, request: LoginRequest, form: HTMLFormElement) => {
        const response = await apiClient.login.login(request);
        if (response.ok) {
            setAlertDescription("");
            setAlert(false);
            setToken(response.data.access_token as string);
            history.push(APP_ROUTE, user);
        } else {
            setAlertDescription("Login failed!");
            console.error(responseToString(response));
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
            clearToken();
        }
    }

    return (
        <div>
            <Helmet title={"Starsky | Register"}/>
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src={logo}/> Register a new account
                    </Header>
                    <Message header={inviteHeader} hidden={!showInviteHeader}
                             content={`We have prefilled your info supplied by ${queryParams.manager}, feel free to change it.`} positive compact
                             size={"small"}/>
                    <Form size='large' onSubmit={handleOnSubmit}>
                        <Segment stacked>
                            <Form.Input name={formName} id={formName} fluid icon='user' iconPosition='left' placeholder='Your name' type='text' required
                                        minLength={1}/>
                            <Form.Input name={formEmail} id={formEmail} fluid icon='mail' iconPosition='left' placeholder='E-mail address' type='email'
                                        required/>
                            <Form.Input name={formPassword} fluid icon='lock' iconPosition='left' placeholder='Password' type='password' minLength={8}
                                        maxLength={72} required/>
                            <Button color='teal' fluid size='large' type='submit'>
                                Register
                            </Button>
                        </Segment>
                    </Form>
                    <Transition visible={alert} animation='fade' duration={1000}>
                        <Message header={alertDescription} content={"Registration failed. Please try again."} negative compact size={"small"}/>
                    </Transition>
                    <Message>
                        Already have an account? <Link to={LOGIN_ROUTE}>Login now!</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    );
}