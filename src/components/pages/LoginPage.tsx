import React, {useState} from 'react';
import {useAuth} from "../AuthProvider";
import {Link, useHistory} from 'react-router-dom';
import {APP_ROUTE, REGISTER_ROUTE} from "../../routing/routeConstants";
import {Button, Form, Grid, Header, Image, Message, Segment, Transition} from 'semantic-ui-react';
import logo from '../../images/logo.png'
import {Helmet} from 'react-helmet';
import {useApi} from "../../api/starskyApiClient";
import {responseToString} from "../../api/httpHelpers";
import {LoginRequest} from "../../api/__generated__/starskyApi";

export function LoginPage() {

    const [loginStatus, setLoginStatus] = useState("");
    const [alert, setAlert] = useState(false);

    const {setToken, clearToken} = useAuth();
    const history = useHistory();
    const apiClient = useApi({accessToken: null});

    const htmlEmailElement = "loginEmail";
    const htmlPasswordElement = "loginPassword";

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const request: LoginRequest = {
            email: formData.get(htmlEmailElement) as string,
            password: formData.get(htmlPasswordElement) as string
        }

        const response = await apiClient.login.login({email: request.email, password: request.password});

        if (response.ok) {
            setLoginStatus("");
            setAlert(false);
            setToken(response.data.access_token as string);
            history.push(APP_ROUTE);
        } else {
            setLoginStatus("Login failed.");
            console.error(responseToString(response));
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
            clearToken();
            form.reset();
        }
    }

    return (
        <div>
            <Helmet title={"Starsky | Login"}/>
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src={logo}/> Login to your account
                    </Header>
                    <Form size='large' onSubmit={handleOnSubmit}>
                        <Segment stacked>
                            <Form.Input name={htmlEmailElement} fluid icon='mail' iconPosition='left' placeholder='E-mail address' type='email' required/>
                            <Form.Input name={htmlPasswordElement} fluid icon='lock' iconPosition='left' placeholder='Password' type='password' minLength={8}
                                        maxLength={72} required/>
                            <Button color='teal' fluid size='large' type='submit'>
                                Login
                            </Button>

                        </Segment>
                    </Form>
                    <Transition visible={alert} animation='fade' duration={1000}>
                        <Message header={loginStatus} content={"We could not log you in. Please check your credentials."} negative compact size={"small"}/>
                    </Transition>
                    <Message>
                        New here? <Link to={REGISTER_ROUTE}>Register now!</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    );
}