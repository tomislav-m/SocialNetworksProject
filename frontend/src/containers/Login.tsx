import * as React from "react";
import { observer, inject } from 'mobx-react';
import GoogleLogin from "react-google-login";
import "../App.css";
import { GOOGLE_CLIENT_ID } from "src/utils/ApiKeys";
import AppState from '../states/AppState';

@inject('appState')
@observer
export default class Login extends React.Component< { history?: any, appState: AppState } > {
    public failure = () => {
        console.log("Failure");
    };

    public responseGoogle = (response: any) => {
        this.props.appState.firstName = response.profileObj.givenName;
        this.props.appState.lastName = response.profileObj.familyName;
        this.props.appState.email = response.profileObj.email;
        this.props.appState.accessToken = response.Zi.id_token;
        const data = JSON.stringify({
            AccessToken: this.props.appState.accessToken, 
            Email: this.props.appState.email, 
            FirstName: this.props.appState.firstName, 
            LastName: this.props.appState.lastName
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
            this.props.appState.token = res.token;
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
