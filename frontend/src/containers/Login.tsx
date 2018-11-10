import * as React from 'react';
import GoogleLogin from 'react-google-login';
import '../App.css';

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
            <div className="login">
                <GoogleLogin 
                    clientId={clientId}
                    onSuccess={this.responseGoogle} 
                    onFailure={this.failure}
                    buttonText="Login with Google"
                />         
            </div>
        );
    }
}