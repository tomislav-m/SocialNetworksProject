import * as React from "react";
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "../App.css";
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from "src/utils/ApiKeys";
import { IMobxStore } from '../stores/mobxStore';
import image from '../images/favicon.png';
import { imageLoginSize, login, appName, loginButtons } from '../utils/Emotions';

interface IProps {
    history?: any;
    mobxStore?: IMobxStore
}
@inject('mobxStore')
@observer
export default class Login extends React.Component< IProps > {
    public failure = () => {
        console.log("Failure");
    };
    @action
    public responseGoogle = (response: any) => {
        this.props.mobxStore!.firstName = response.profileObj.givenName;
        this.props.mobxStore!.lastName = response.profileObj.familyName;
        this.props.mobxStore!.email = response.profileObj.email;
        this.props.mobxStore!.accessToken = response.Zi.id_token;
        this.props.mobxStore!.imageUrl = response.profileObj.imageUrl;
        localStorage.setItem('firstName', response.profileObj.givenName);
        localStorage.setItem('lastName', response.profileObj.familyName);
        localStorage.setItem('email', response.profileObj.email);
        localStorage.setItem('accessToken', response.Zi.id_token);
        localStorage.setItem('imageUrl', response.profileObj.imageUrl);
        const data = JSON.stringify({
            AccessToken: this.props.mobxStore!.accessToken, 
            Email: this.props.mobxStore!.email, 
            FirstName: this.props.mobxStore!.firstName, 
            LastName: this.props.mobxStore!.lastName,
            ImageUrl: this.props.mobxStore!.imageUrl
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
            console.log(res)
            this.props.mobxStore!.token = res.token;
            localStorage.setItem('id', res.id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('movieRatings', res.movieRatings);
            this.props.history.push("/movies");
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
    };

    public responseFacebook = (response: any) => {
        console.log(response);
        this.props.mobxStore!.firstName = response.first_name;
        this.props.mobxStore!.lastName = response.last_name;
        this.props.mobxStore!.email = response.email;
        this.props.mobxStore!.accessToken = response.accessToken;
        const data = JSON.stringify({
            access_token: this.props.mobxStore!.accessToken, 
            Email: this.props.mobxStore!.email, 
            first_name: this.props.mobxStore!.firstName, 
            last_name: this.props.mobxStore!.lastName
        });

        console.log(this.props.mobxStore!);
    
        fetch("http://localhost:5000/api/users/facebook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
        })
        .then((res) => res.json())
        .then((res) => {
            this.props.mobxStore!.token = res.token;
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
