import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { IMobxStore } from '../stores/mobxStore';
import { RouteComponentProps } from "react-router-dom";
import { movieContainer, firstMovieBox, secondMovieBox } from 'src/utils/Emotions';

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
                <div className = {movieContainer}>
                    <div className = {firstMovieBox}>
                        <img src = {`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} alt = "No image"/>
                        <div className = {secondMovieBox}>
                            <div>
                                {movie.title} <br/>
                                {movie.release_date} <br/>
                                {movie.runtime} <br/>
                                {movie.genre_ids} 
                            </div>
                            <div>
                                {movie.voteAverage} <br/>
                                {movie.ratingCount} <br/>
                                {movie.rating} <br/>
                            </div>  
                        </div>
                    </div>
                    
                    <div>
                        {movie.overview} 
                    </div>

                    <div>
                        {movie.actorsIds} <br/>
                        {movie.directorsIds} <br/>
                        {movie.soundtrackId}
                    </div>
                </div> 
            </div>
        );
    }
}