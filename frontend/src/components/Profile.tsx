import * as React from 'react';
import Header from './Header';
import {profileContainer, imageCss, profileCss, imageSize} from 'src/utils/Emotions';

export default class Profile extends React.Component {
    public render() {
        return(
            <div>
                <Header/>
                <div className = {profileContainer}>
                    <div className = {imageCss}>
                        <img className = {imageSize} src = {localStorage.getItem('imageUrl')!} alt = "No image"/>
                    </div>
                    <div className = {profileCss}>
                        Name: {localStorage.getItem('firstName')} <br/>
                        Last name: {localStorage.getItem('lastName')} <br/>
                        Email: {localStorage.getItem('email')}
                    </div>
                </div>
            </div>
        );
    }
}