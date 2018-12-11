import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import { AppState } from '../states/AppState';
import { RouteComponentProps } from "react-router-dom";

interface IRouteParams {
    movieID: string; 
}

interface IProps extends RouteComponentProps<IRouteParams>{ 
    appState: AppState;
}

@inject('appState')
@observer
export default class MovieDetails extends React.Component<IProps> {

    @action
    public componentDidMount() {
        fetch(`http://localhost:5000/api/movies/${this.props.match.params.movieID}`)
        .then(response => response.json())
        .then((response) => {
            console.log(response) 
            this.props.appState.title = response.title;
            this.props.appState.plot = response.plot;
            this.props.appState.directorsIds = response.directorsIds;
            this.props.appState.actorsIds = response.actorsIds;
            this.props.appState.genresIds = response.genresIds;
            this.props.appState.posterUrl = response.posterUrl;
            this.props.appState.soundtrackId = response.soundtrackId;
            this.props.appState.popularity = response.popularity; // kaj je ovo???
            this.props.appState.releaseDate = response.releaseDate;
            this.props.appState.runtime = response.runtime;
            this.props.appState.voteAverage = response.voteAverage;
            this.props.appState.voteCount = response.voteCount;
            
        })
        .catch(error => console.error("Error:", error));
    }
    public render() {
        return (
            <div>
                <Header firstName = {this.props.appState.firstName}/>
                <img src = {`http://image.tmdb.org/t/p/w185/${this.props.appState.posterUrl}`} alt = "No image"/>

                {this.props.appState.title}
                {this.props.appState.plot}
                {this.props.appState.releaseDate}
                {this.props.appState.runtime}
                {this.props.appState.voteAverage}
                {this.props.appState.voteCount}
            </div>
        );
    }
}