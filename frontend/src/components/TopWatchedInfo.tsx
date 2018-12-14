
import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox, movieInfoRating } from 'src/utils/Emotions';
import Truncate from 'react-truncate';

interface IProps {
    history?: any;
    movieID: string;
    topWatched: boolean;
}

interface IState {
    movie: IMovie;
}

export default class TopWatchedInfo extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = { 
            movie: {
                id: '', 
                title: '',
                overview: '',
                poster_path: '',
                voteAverage: 0,
                rating: 0,
                ratingCount: 0,
                runtime: '',
                release_date: '',
                genre_ids: [],
                actorsIds: [],
                directorsIds: [],
                soundtrackId: ''
            }
        };
    }
    public componentDidMount() {
        this.getMovieInfo();
    }

    public getMovieInfo(){
        fetch(`https://api.themoviedb.org/3/movie/${this.props.movieID}?api_key=687a2e7fcee1a717e582f9665c5bf685&language=en-US`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                movie: response
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            // this.props.history.push("/error");
        });
        fetch(`http://localhost:5000/api/movies/${this.props.movieID}`)
        .then(response => response.json())
        .then(response => {
            this.setState( {
                movie : {
                    ...this.state.movie,
                    voteAverage : response.voteAverage,
                    rating : response.rating,
                    ratingCount: response.ratingCount,
                    runtime: response.runtime,
                    release_date: response.release_date,
                    genre_ids: response.genre_ids,
                    actorsIds: response.actorsIds,
                    directorsIds: response.directorsIds,
                    soundtrackId: response.soundtrackId
                }
            })
        })
        .catch((error) => {
            console.error("Error:", error);
            // this.props.history.push("/error");
        });
    }

    public renderInfoRating = () => {
        return (
            <div>
                <div className = "rate">
                    {this.state.movie.voteAverage}
                </div>/10
                <div className = "rate">
                    {this.state.movie.rating}
                </div>/5
            </div >
        )
    }

    public render() {
        const tooltip = (
            <Tooltip id="tooltip">
                <strong>Number of votes</strong>
            </Tooltip>
        );

        return (
            <div className = {movieInfoContainer}>
                <Link 
                    to ={{
                        pathname: `/movies/${this.state.movie.id}`,
                        state:  { movie: this.state.movie} 
                    }}
                >
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.state.movie.poster_path}`} alt = "No image"/>
                </Link>
                <div className = {movieInfoBox}>
                    <div className = "movieTitle">
                        <Link 
                            to ={{
                                pathname: `/movies/${this.state.movie.id}`,
                                state:  { movie: this.state.movie} 
                            }}
                        >
                            {this.state.movie.title}
                        </Link>
                    </div>
                    <div>
                    <Truncate lines={7} ellipsis={
                        <span>... 
                            <Link 
                                to ={{
                                    pathname: `/movies/${this.state.movie.id}`,
                                    state:  { movie: this.state.movie} 
                                }}
                            >Read more
                            </Link>
                        </span>}>
                        {this.state.movie.overview}
                    </Truncate> 
                    </div>

                    <div className = {movieInfoRating}>
                        <div>
                            { this.renderInfoRating()}
                            <OverlayTrigger placement="right" overlay={tooltip}>
                                <Badge>
                                    {this.state.movie.ratingCount}
                                </Badge>
                            </OverlayTrigger>
                        </div>
                        <div className = "ratingStars">
                            Rate   <Rater total={5} rating={0} />
                        </div>
                    </div>
                </div>
            </div>                  
        );
    }
}