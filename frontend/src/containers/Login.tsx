import * as React from "react";
import { observer, inject } from 'mobx-react';
import GoogleLogin from "react-google-login";
import "../App.css";
import { GOOGLE_CLIENT_ID } from "src/components/api-keys/ApiKeys";
import AppState from '../states/AppState';

interface IUser {
    AccessToken: string;
    Email: string;
    FirstName: string;
    LastName: string;
}
interface IState {
    user: IUser;
}

@observer
export default class Login extends React.Component< { history?: any, state?: AppState }, IState > {
    public failure = () => {
        console.log("Failure");
    };

    public responseGoogle = (response: any) => {
        console.log(response);
        console.log(response.Zi.id_token);
        this.setState({
            user: {
                AccessToken: response.Zi.id_token,
                Email: response.profileObj.email,
                FirstName: response.profileObj.givenName,
                LastName: response.profileObj.familyName
            }
        });
        this.props.state.firstName = response.Zi.id_token;
        console.log(this.state.user);
        fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
        })
        .then(res => {
            console.log(res.json())
        });
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
