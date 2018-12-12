import * as React from 'react';
import Header from '../components/Header';
import { AppState } from '../states/AppState';
import { observer, inject } from 'mobx-react';
import {profileContainer, imageCss, profileCss, imageSize} from 'src/utils/Emotions';

@inject('appState')
@observer
export default class Profile extends React.Component<{ appState: AppState }> {
    public render() {
        return(
            <div>
                <Header firstName = {this.props.appState.firstName} />
                <div className = {profileContainer}>
                    <div className = {imageCss}>
                        <img className = {imageSize} src = {this.props.appState.imageUrl} alt = "No image"/>
                    </div>
                    <div className = {profileCss}>
                        Name: {this.props.appState.firstName} <br/>
                        Last name: {this.props.appState.lastName} <br/>
                        Email: {this.props.appState.email}
                    </div>
                </div>
            </div>
        );
    }
}