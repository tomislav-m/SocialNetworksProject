import * as React from 'react';
import Header from '../components/Header';
import { AppState } from '../states/AppState';
import { observer, inject } from 'mobx-react';

@inject('appState')
@observer
export default class Profile extends React.Component<{ appState: AppState }> {
    public render() {
        return(
            <div>
                <Header firstName = {this.props.appState.firstName} />
                Name: {this.props.appState.firstName} <br/>
                Last name: {this.props.appState.lastName} <br/>
                Email: {this.props.appState.email}
            </div>
        );
    }
}