import * as React from "react";
import { observer, inject } from 'mobx-react';
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "../App.css";
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from "src/utils/ApiKeys";
import { AppState } from '../states/AppState';
import image from '../images/favicon.png';
import { imageLoginSize, login, appName, loginButtons } from '../utils/Emotions';

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
        this.props.appState.imageUrl = response.profileObj.imageUrl;
        const data = JSON.stringify({
            AccessToken: this.props.appState.accessToken, 
            Email: this.props.appState.email, 
            FirstName: this.props.appState.firstName, 
            LastName: this.props.appState.lastName,
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
            this.props.history.push("/movies");
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
    };

    public responseFacebook = (response: any) => {
        console.log(response);
        this.props.appState.firstName = response.first_name;
        this.props.appState.lastName = response.last_name;
        this.props.appState.email = response.email;
        this.props.appState.accessToken = response.accessToken;
        const data = JSON.stringify({
            AccessToken: this.props.appState.accessToken, 
            Email: this.props.appState.email, 
            FirstName: this.props.appState.firstName, 
            LastName: this.props.appState.lastName
        });
    
        fetch("http://localhost:5000/api/users/facebook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
        })
        .then((res) => res.json())
        .then((res) => {
            this.props.appState.token = res.token;
            this.props.history.push("/movies");
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
    };

    public render() {
        return (
        <div className={login}>
            <div className = {appName}>Movie SNApp</div>
            <img className = {imageLoginSize} src = {image}/>
            <div className = {loginButtons}>
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    onSuccess={this.responseGoogle}
                    onFailure={this.failure}
                    buttonText="Login with Google"
                    className = "btnGoogle"
                />
                <FacebookLogin
                    appId={FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="first_name,last_name,email,picture"
                    callback={this.responseFacebook}
                    reAuthenticate={true}
                    onFailure={this.failure}
                    cssClass="btnFacebook"
                />
            </div>
        </div>
        );
    }
}
