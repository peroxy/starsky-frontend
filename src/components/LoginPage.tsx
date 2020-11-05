import React, {useState} from 'react';
import {LoginModel} from "../api/models";
import {StarskyApiClient} from "../api/starskyApiClient";
import {ErrorResponse, TokenResponse} from "../api/responses";
import {AuthContext} from "./AuthProvider";
import { useHistory } from 'react-router-dom';

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
            history.push("/app/dashboard");
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
            <form onSubmit={handleSubmit}>
                <label htmlFor={htmlEmailElement}>Email:</label>
                <input type="email" name={htmlEmailElement} id={htmlEmailElement} required/>
                <label htmlFor={htmlPasswordElement}>Password:</label>
                <input type="password" name={htmlPasswordElement} id={htmlPasswordElement} minLength={8} maxLength={72} required/>
                <input type="submit" value="Login"/>
            </form>
            {errorLabel}
        </div>
    );
}