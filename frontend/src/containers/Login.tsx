import * as React from 'react';
import GoogleLogin from 'react-google-login';

export default class Login extends React.Component<{ history?: any }>{

    public failure=() => {
        console.log("Failure")
    }

    public responseGoogle=() => {
        this.props.history.push("/");
    }
    public render() {
        return(
            <div>
                <GoogleLogin onSuccess={this.responseGoogle} onFailure={this.failure} clientId="909186931033-hv70f57pr1ijg3v72aqq0bu8hoeqkb1h.apps.googleusercontent.com" buttonText="Login"/>                
            </div>
        );
    }
}
