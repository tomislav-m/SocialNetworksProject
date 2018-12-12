import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { AppState } from '../states/AppState';
import { RouteComponentProps } from "react-router-dom";

interface IRouteParams {
    movieID: string; 
}

interface IProps extends RouteComponentProps<IRouteParams>{ 
    appState: AppState;
}

interface IState {
    loading: boolean;
}

@inject('appState')
@observer
export default class MovieDetails extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state ={ loading: true };
    }

    public render() {
        const  { movie } = this.props.location.state;
        console.log('*******', movie);

        return (
            <div>
                <Header firstName = {movie.firstName}/>
                <img src = {`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} alt = "No image"/>
                
                {movie.title}
                {/* sta je ovo? */}
                {movie.plot} 
                {movie.release_date}
                {/* sta je ovo? */}
                {movie.runtime} 
                {movie.vote_average}
                {movie.vote_count}
            </div>
        );
    }
}