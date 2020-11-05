import React, {useState} from 'react';
import {LoginModel} from "../api/models";
import {StarskyApiClient} from "../api/starskyApiClient";
import {ErrorResponse, TokenResponse} from "../api/responses";
import {AuthContext} from "./AuthProvider";
import {useHistory} from 'react-router-dom';
import {DASHBOARD_ROUTE} from "../routing/routeConstants";
import {Button, Form, Grid, Header, Message, Segment, Image} from 'semantic-ui-react';
import logo from '../logo.svg'

export function LoginPage() {

    const [loginStatus, setLoginStatus] = useState("");
    const {setToken, clearToken} = React.useContext(AuthContext);
    const history = useHistory()
    const apiClient = new StarskyApiClient();

    const htmlEmailElement = "loginEmail";
    const htmlPasswordElement = "loginPassword";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const model: LoginModel = {
            email: data.get(htmlEmailElement) as string,
            password: data.get(htmlPasswordElement) as string
        }

        const response = await apiClient.login(model);
        if (isErrorResponse(response)) {
            setLoginStatus(response.error_detail);
            clearToken()
        } else {
            setLoginStatus("Successfully logged in!");
            setToken(response.access_token);
            history.push(DASHBOARD_ROUTE);
        }
    }

    const isErrorResponse = (response: TokenResponse | ErrorResponse): response is ErrorResponse => {
        return (response as ErrorResponse).error_code !== undefined;
    }


    let errorLabel: JSX.Element | null = null;
    if (loginStatus !== "") {
        errorLabel = <label>{loginStatus}</label>;
    }

    return (
        <div>
            {/*<form onSubmit={handleSubmit}>*/}
            {/*    <label htmlFor={htmlEmailElement}>Email:</label>*/}
            {/*    <input type="email" name={htmlEmailElement} id={htmlEmailElement} required/>*/}
            {/*    <label htmlFor={htmlPasswordElement}>Password:</label>*/}
            {/*    <input type="password" name={htmlPasswordElement} id={htmlPasswordElement} minLength={8} maxLength={72} required/>*/}
            {/*    <input type="submit" value="Login"/>*/}
            {/*</form>*/}
            {/*{errorLabel}*/}

            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src={logo}/> Log-in to your account
                    </Header>
                    <Form size='large' onSubmit={handleSubmit}>
                        <Segment stacked>
                            <Form.Input name={htmlEmailElement} fluid icon='user' iconPosition='left' placeholder='E-mail address' type='email' required/>
                            <Form.Input name={htmlPasswordElement} fluid icon='lock' iconPosition='left' placeholder='Password' type='password' minLength={8}
                                        maxLength={72} required/>
                            <Button color='teal' fluid size='large' type='submit'>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        New here? <a href='#'>Register now!</a>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>


    );
}