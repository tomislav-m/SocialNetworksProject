
import * as React from 'react';
import { IMovie } from 'src/utils/Typings';
import 'react-rater/lib/react-rater.css';
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox, movieInfoRating } from 'src/utils/Emotions';
import Truncate from 'react-truncate';
import Rating from '../../rate/Rating';
import AverageRates from '../../rate/AverageRates';

interface IProps {
    movieID: string;
}

interface IState {
    movie: IMovie;
    loading: boolean;
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
            },
            loading: false
        };
    }
    public componentDidMount() {
        this.setState({ loading: true });
        this.getMovieInfo();
        this.getMovieRatings();
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
        });
    }

    public getMovieRatings(){
        fetch(`http://localhost:5000/api/movies/${this.props.movieID}`)
        .then(r => r.json())
        .then(r => {
            this.setState( {
                movie : {
                    ...this.state.movie,
                    voteAverage : r.voteAverage,
                    rating : r.rating,
                    ratingCount: r.ratingCount,
                    runtime: r.runtime,
                    release_date: r.release_date,
                    genre_ids: r.genre_ids,
                    actorsIds: r.actorsIds,
                    directorsIds: r.directorsIds,
                    soundtrackId: r.soundtrackId
                },
                loading: false
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    public render() {
        
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
                        <Truncate lines={4} ellipsis={
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
                    {!this.state.loading && 
                        <div className = {movieInfoRating}>
                            <AverageRates movie={this.state.movie}/>
                            <Rating movie={this.state.movie}/>
                        </div>
                    }
                </div>
            </div>                  
        );
    }
}