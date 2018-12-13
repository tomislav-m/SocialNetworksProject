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
                        <img className = {imageSize} src = {this.props.mobxStore!.imageUrl} alt = "No image"/>
                    </div>
                    <div className = {profileCss}>
                        Name: {this.props.mobxStore!.firstName} <br/>
                        Last name: {this.props.mobxStore!.lastName} <br/>
                        Email: {this.props.mobxStore!.email}
                    </div>
                </div>
            </div>
        );
    }
}