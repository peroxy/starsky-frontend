import React from 'react';
import {LoginModel} from "../api/models";
import {StarskyApiClient} from "../api/starskyApiClient";
import {ErrorResponse, TokenResponse} from "../api/responses";

interface ILoginState {
    loginStatus: string
}

export default class LoginPage extends React.Component<any, ILoginState> {

    private readonly htmlEmailElement: string;
    private readonly htmlPasswordElement: string;
    private apiClient: StarskyApiClient;

    constructor(props: any) {
        super(props);
        this.htmlEmailElement = "loginEmail";
        this.htmlPasswordElement = "loginPassword";
        this.apiClient = new StarskyApiClient();
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {loginStatus: ""};
    }

    private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const model: LoginModel = {
            email: data.get(this.htmlEmailElement) as string,
            password: data.get(this.htmlPasswordElement) as string
        }

        const response = await this.apiClient.login(model);
        if (this.isErrorResponse(response)) {
            this.setState({loginStatus: response.error_detail});
        } else {
            this.setState({loginStatus: "Successfully logged in!"});
            //TODO: redirect to dashboard and pass access token - or store in local storage?
        }
    }

    private isErrorResponse(response: TokenResponse | ErrorResponse): response is ErrorResponse {
        return (response as ErrorResponse).error_code !== undefined;
    }

    render() {
        let errorLabel: JSX.Element | null = null;
        if (this.state.loginStatus !== "") {
            errorLabel = <label>{this.state.loginStatus}</label>;
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor={this.htmlEmailElement}>Email:</label>
                    <input type="email" name={this.htmlEmailElement} id={this.htmlEmailElement} required/>
                    <label htmlFor={this.htmlPasswordElement}>Password:</label>
                    <input type="password" name={this.htmlPasswordElement} id={this.htmlPasswordElement} minLength={8}
                           maxLength={72} required/>
                    <input type="submit" value="Login"/>
                </form>
                {errorLabel}
            </div>
        );
    }


}