import * as React from "react";
import { observer, inject } from 'mobx-react';
import GoogleLogin from "react-google-login";
import "../App.css";
import { GOOGLE_CLIENT_ID } from "src/utils/ApiKeys";
import AppState from '../states/AppState';

@inject('state')
@observer
export default class Login extends React.Component< { history?: any, state: AppState } > {
    public failure = () => {
        console.log("Failure");
    };

    public responseGoogle = (response: any) => {
        this.props.state.firstName = response.profileObj.givenName;
        this.props.state.lastName = response.profileObj.familyName;
        this.props.state.email = response.profileObj.email;
        this.props.state.accessToken = response.Zi.id_token;
        const data = JSON.stringify({
            AccessToken: this.props.state.accessToken, 
            Email: this.props.state.email, 
            FirstName: this.props.state.firstName, 
            LastName: this.props.state.lastName
        });
    
        fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
        })
        .then((res) => res.json())
        .then((res) => {
            this.props.state.token = res.token;
        })
        .catch((error) => console.error("Error:", error));
        this.props.history.push("/movies");
    };

    public render() {
        return (
        <div className="login">
            <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.responseGoogle}
            onFailure={this.failure}
            buttonText="Login with Google"
            />
        </div>
        );
    }
}
