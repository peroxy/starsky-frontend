import React, {useState} from 'react';
import {Helmet} from "react-helmet";
import {Button, Form, Grid, Header, Image, Message, Segment, Transition} from "semantic-ui-react";
import logo from "../../images/logo.png";
import {TEAMS_ROUTE, LOGIN_ROUTE} from "../../routing/routeConstants";
import {Link, useHistory} from "react-router-dom";
import {LoginModel, RegisterModel} from "../../api/models";
import {StarskyApiClient} from "../../api/starskyApiClient";
import {isErrorResponse, UserResponse} from "../../api/responses";
import {useAuth} from "../AuthProvider";

export function RegisterPage() {

    const [alertDescription, setAlertDescription] = useState("");
    const [alert, setAlert] = useState(false);

    const {setToken, clearToken} = useAuth();

    const formEmail = "registerEmail";
    const formPassword = "registerPassword";
    const formName = "registerName";

    const history = useHistory()
    const apiClient = new StarskyApiClient();

    /*
      Register a new user - event that gets triggered on registration form submittal.
     */
    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const model: RegisterModel = {
            email: formData.get(formEmail) as string,
            password: formData.get(formPassword) as string,
            name: formData.get(formName) as string
        }

        const response = await apiClient.register(model);
        if (isErrorResponse(response)) {
            setAlertDescription(response.error_detail);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        } else {
            setAlertDescription("");
            setAlert(false);
            await loginNewUser(response, model, form);
        }
    }

    /*
        Logins the freshly registered user - this should probably be removed when email verification is implemented.
     */
    const loginNewUser = async (user: UserResponse, model: LoginModel, form : HTMLFormElement) => {
        const response = await apiClient.login(model);
        if (isErrorResponse(response)) {
            setAlertDescription(response.error_detail);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
            clearToken();
        } else {
            setAlertDescription("");
            setAlert(false);
            setToken(response.access_token);
            history.push(TEAMS_ROUTE, user);
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
                    <Form size='large' onSubmit={handleOnSubmit}>
                        <Segment stacked>
                            <Form.Input name={formName} fluid icon='user' iconPosition='left' placeholder='Your name' type='text' required minLength={1}/>
                            <Form.Input name={formEmail} fluid icon='mail' iconPosition='left' placeholder='E-mail address' type='email' required/>
                            <Form.Input name={formPassword} fluid icon='lock' iconPosition='left' placeholder='Password' type='password' minLength={8} maxLength={72} required/>
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