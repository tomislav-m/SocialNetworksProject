import * as React from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "../App.css";
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from "src/utils/ApiKeys";
import image from '../images/favicon.png';
import { imageLoginSize, login, appName, loginButtons } from '../utils/Emotions';
import ReactLoading from 'react-loading';

interface IProps {
    history?: any;
}

interface IState {
    loading: boolean;
}

export default class Login extends React.Component<IProps, IState > {
    constructor(props: any) {
        super(props);
        this.state = { 
            loading: false
        };
    }

    public failure = () => {
        console.log("Failure");
    };

    public responseGoogle = (response: any) => {
        this.setState({ loading: true });
        localStorage.setItem('firstName', response.profileObj.givenName);
        localStorage.setItem('lastName', response.profileObj.familyName);
        localStorage.setItem('email', response.profileObj.email);
        localStorage.setItem('accessToken', response.Zi.id_token);
        localStorage.setItem('imageUrl', response.profileObj.imageUrl);
        const data = JSON.stringify({
            AccessToken: localStorage.getItem('accessToken'), 
            Email: localStorage.getItem('email'), 
            FirstName: localStorage.getItem('firstName'), 
            LastName: localStorage.getItem('lastName'),
            ImageUrl: localStorage.getItem('imageUrl')
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
            localStorage.setItem('id', res.id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('movieRatings', res.movieRatings);
            this.props.history.push("/");
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
    };

    public responseFacebook = (response: any) => {
        this.setState({ loading: true });
        localStorage.setItem('firstName', response.first_name);
        localStorage.setItem('lastName', response.last_name);
        localStorage.setItem('email', response.email);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('imageUrl', response.picture.data.url);
        const data = JSON.stringify({
            access_token: localStorage.getItem('accessToken'), 
            Email: localStorage.getItem('email'), 
            first_name: localStorage.getItem('firstName'), 
            last_name: localStorage.getItem('lastName')
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
            console.log(res)
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

    public renderLogin = () => {
        return(
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
        );
    }

    public render() {
        return (
        <div className={login}>
            <div className = {appName}>Movie SNApp</div>
            <img className = {imageLoginSize} src = {image}/>
            { !this.state.loading && this.renderLogin()}
            { this.state.loading && <ReactLoading type="spin" color="black" width="5%" height="5em"/>}
        </div>
        );
    }
}
