import React, {DetailedReactHTMLElement} from 'react';

interface ILoginState {
    email: string,
    password: string
}

export default class LoginPage extends React.Component<any, ILoginState>{

    private readonly htmlEmailElement: string;
    private readonly htmlPasswordElement: string;

    constructor(props:any) {
        super(props);
        this.htmlEmailElement = "loginEmail";
        this.htmlPasswordElement = "loginPassword";

        this.handleSubmit = this.handleSubmit.bind(this)

        // this.state = {
        //     email: "",
        //     password: ""
        // };
    }

    private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get(this.htmlEmailElement);
        const password = data.get(this.htmlPasswordElement);
        const response = await fetch("http://localhost:8080/auth/token", {
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password : password
            })
        });
        console.log(response.body);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor={this.htmlEmailElement}>Email:</label>
                    <input type="email" name={this.htmlEmailElement} id={this.htmlEmailElement} required/>

                    <label htmlFor={this.htmlPasswordElement}>Password:</label>
                    <input type="password" name={this.htmlPasswordElement} id={this.htmlPasswordElement} minLength={8} maxLength={72} required/>

                    <input type="submit" value="Login"/>
                </form>

            </div>
        );
    }


}