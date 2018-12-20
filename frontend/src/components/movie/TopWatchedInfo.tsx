
import * as React from 'react';
import "../../App.css";
import { IMovie } from 'src/utils/Typings';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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
    rate: number;
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
            rate: 0
        };
    }
    public componentDidMount() {
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
                }
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    public rate = (event: any) =>{
        this.setState({ rate: event.rating }, () => {
            const key = this.state.movie.id;
            const obj = {};
            obj[key] = this.state.rate;
            const data = JSON.stringify(obj);
            fetch(`http://localhost:5000/api/users/add-ratings/${localStorage.getItem('id')}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        })
        console.log(this.state.movie.id)
        // const movieId: string = this.props.location.state.movie.id; 
    }

    public renderRating = () => {
        const tooltip1 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.state.movie.voteAverage).toFixed(1)} based on IMDB, TMDB and RT user ratings</strong>
            </Tooltip>
        );
        const tooltip2 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.state.movie.rating).toFixed(1)} based on {this.state.movie.ratingCount} user ratings</strong>
            </Tooltip>
        );

        return (
            <div className = {movieInfoRating}>
                    <div>
                        <OverlayTrigger placement="right" overlay={tooltip1}>
                            <div className = "rate">
                                {Number(this.state.movie.voteAverage).toFixed(1)}
                            </div>
                        </OverlayTrigger>/5
                    
                        <br/>
                        
                        <OverlayTrigger placement="right" overlay={tooltip2}>
                            <div className = "rate">
                                {Number(this.state.movie.rating).toFixed(1)}
                            </div>
                        </OverlayTrigger>/5     
                    </div>

                    <div className = "ratingStars">
                        Rate this movie:  
                        <div className="sizeStars"> 
                            <Rater total={5} rating={0} onRate={this.rate}/>  
                        </div>
                    </div> 
                </div>
        );
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
                    { this.renderRating()}
                </div>
            </div>                  
        );
    }
}