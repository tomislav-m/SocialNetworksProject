import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { IMobxStore } from '../stores/mobxStore';
import { RouteComponentProps } from "react-router-dom";

interface IRouteParams {
    movieID: string; 
}

interface IProps extends RouteComponentProps<IRouteParams>{ 
    mobxStore?: IMobxStore
}

interface IState {
    loading: boolean;
}

@inject('mobxStore')
@observer
export default class MovieDetails extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state ={ loading: true };
    }

    public render() {
        const  { movie } = this.props.location.state;
        return (
            <div>
                <Header firstName = {this.props.mobxStore!.firstName}/>
                <img src = {`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} alt = "No image"/>
                
                {movie.title}
                {movie.overview} 
                {movie.release_date} <br/>
                {movie.runtime} <br/>
                {movie.voteAverage} <br/>
                {movie.ratingCount} <br/>
                {movie.rating} <br/>
                {movie.genre_ids} <br/>
                {movie.actorsIds} <br/>
                {movie.directorsIds} <br/>
                {movie.soundtrackId}
            </div>
        );
    }
}