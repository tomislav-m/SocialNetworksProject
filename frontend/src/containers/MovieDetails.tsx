import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import AppState from '../states/AppState';

@inject('state')
@observer
export default class MovieDetails extends React.Component<{ state: AppState }> {
    public render() {
        return (
            <div>
                <Header state = {this.props.state}/>
            </div>
        );
    }
}