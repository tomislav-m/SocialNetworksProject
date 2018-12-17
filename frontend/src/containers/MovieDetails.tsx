import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { IMobxStore } from '../stores/mobxStore';
import { RouteComponentProps } from "react-router-dom";
import { movieDetailsRating, infoBox, titleBox, overviewBox, movieContainer, firstMovieBox, secondMovieBox } from 'src/utils/Emotions';
import Moment from 'react-moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Rater from 'react-rater'

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
        const tooltip1 = (
            <Tooltip id="tooltip">
                <strong>{Number(movie.voteAverage).toFixed(1)} based on IMDB, TMDB and RT user ratings</strong>
            </Tooltip>
        );
        const tooltip2 = (
            <Tooltip id="tooltip">
                <strong>{Number(movie.rating).toFixed(1)} based on {movie.ratingCount} user ratings</strong>
            </Tooltip>
        );
        return (
            <div>
                <Header firstName = {this.props.mobxStore!.firstName}/>
                <div className = {movieContainer}>
                    <div className = {firstMovieBox}>
                        <img src = {`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} alt = "No image"/>
                        <div className = {secondMovieBox}>
                            <div className = {titleBox}>
                                {movie.title}
                            </div>

                            <div className = {infoBox}>
                                Release date: <Moment format="D MMMM YYYY">{movie.release_date}</Moment><br/>
                                Runtime: {movie.runtime} <br/>
                                Genres: {movie.genre_ids} 
                            </div>
                           
                            <div className = {movieDetailsRating}>
                                <div>
                                    <OverlayTrigger placement="right" overlay={tooltip1}>
                                        <div className = "rate">
                                            {Number(movie.voteAverage).toFixed(1)}
                                        </div>
                                    </OverlayTrigger>/5
                                    <br/>
                                    <OverlayTrigger placement="right" overlay={tooltip2}>
                                        <div className = "rate">
                                            {Number(movie.rating).toFixed(1)}
                                        </div>
                                    </OverlayTrigger>/5 
                                    <div>
                                        Rate this movie:  <Rater total={5} rating={0} />  
                                    </div>  
                                </div>
                            </div> 
                        </div>
                    </div>
                    
                    <div className = {overviewBox}>
                        {movie.overview} 
                    </div>

                    <div>
                        Ispis redatelja, glumaca i soundtrackova
                        {/*movie.actorsIds*/} <br/>
                        {/*movie.directorsIds*/} <br/>
                        {/*movie.soundtrackId*/}
                    </div>
                </div> 
            </div>
        );
    }
}