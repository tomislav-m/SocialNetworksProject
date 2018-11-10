import * as React from 'react';
import GoogleLogin from 'react-google-login';

export default class Login extends React.Component<{ history?: any }>{

    public failure=() => {
        console.log("Failure")
    }

    public responseGoogle=() => {
        this.props.history.push("/movies");
    }
    public render() {
        const clientId = "559727149142-nk8h7to43174uadf0ajh66u524480g6q.apps.googleusercontent.com";
        return(
            <div>
                <GoogleLogin onSuccess={this.responseGoogle} onFailure={this.failure} clientId={clientId} buttonText="Login"/>         
            </div>
        );
    }
}