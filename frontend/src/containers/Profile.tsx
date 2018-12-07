import * as React from 'react';
import Header from '../components/Header';
import AppState from '../states/AppState';
import { observer, inject } from 'mobx-react';

@inject('state')
@observer
export default class Profile extends React.Component<{ state: AppState }> {
    public render() {
        return(
            <div>
                <Header state = {this.props.state} />
            </div>
        );
    }
}