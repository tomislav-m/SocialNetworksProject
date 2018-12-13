import * as React from 'react';
import Header from '../components/Header';
import { IMobxStore } from '../stores/mobxStore';
import { observer, inject } from 'mobx-react';
import {profileContainer, imageCss, profileCss, imageSize} from 'src/utils/Emotions';

interface IProps {
    mobxStore?: IMobxStore
}

@inject('mobxStore')
@observer
export default class Profile extends React.Component< IProps > {
    public render() {
        return(
            <div>
                <Header firstName = {this.props.mobxStore!.firstName} />
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