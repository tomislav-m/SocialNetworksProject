import * as React from "react";
import { observer, inject } from 'mobx-react';
import GoogleLogin from "react-google-login";
import "../App.css";
import { GOOGLE_CLIENT_ID } from "src/components/api-keys/ApiKeys";
import AppState from '../states/AppState';

/*interface IUser {
    AccessToken: string;
    Email: string;
    FirstName: string;
    LastName: string;
}
interface IState {
    user: IUser;
}*/

@inject('state')
@observer
export default class Login extends React.Component< { history?: any, state: AppState } > {
    public failure = () => {
        console.log("Failure");
    };

    public responseGoogle = (response: any) => {
        console.log(response);
        console.log(response.Zi.id_token);
        /*this.setState({
            user: {
                AccessToken: response.Zi.id_token,
                Email: response.profileObj.email,
                FirstName: response.profileObj.givenName,
                LastName: response.profileObj.familyName
            }
        });*/
        this.props.state.firstName = response.profileObj.givenName;
        this.props.state.lastName = response.profileObj.familyName;
        this.props.state.email = response.profileObj.email;
        this.props.state.accessToken = response.Zi.id_token;
        const data = JSON.stringify({AccessToken: this.props.state.accessToken, Email: this.props.state.email, FirstName: this.props.state.firstName, LastName: this.props.state.lastName});
    
        fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
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
