import * as React from 'react';
import Header from '../Header';
import { RouteComponentProps } from "react-router-dom";
import { trailer, ratingStars, movieDetailsRating, titleBox, overviewBox, movieContainer, firstMovieBox, secondMovieBox } from 'src/utils/Emotions';
import Moment from 'react-moment';
import Rating from '../rate/Rating';
import AverageRates from '../rate/AverageRates';
import MovieGenres from './MovieGenres';
import MovieDirectors from './MovieDirectors';
import MovieActors from './MovieActors';
import MovieSoundtrack from './MovieSoundtrack';
import MovieTrailer from './MovieTrailer';
import { YOUTUBE_API_KEY } from 'src/utils/ApiKeys';

interface IRouteParams {
    movieID: string; 
}
interface IProps extends RouteComponentProps<IRouteParams>{ 
}
interface IState {
    loading: boolean;
    directors: any[];
    actors: any[];
    genres: any[];
    rate: number;
    soundtracks: any[];
    artists: any[];
    soundtrackTitle: string;
    trailerID: string;
}

export default class MovieDetails extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state ={ 
            loading: false, 
            directors: new Array,
            actors: new Array,
            genres: new Array,
            rate: 0, 
            soundtracks: new Array,
            artists: new Array, 
            soundtrackTitle: "",
            trailerID: "",
        };
    }

    public componentDidMount(){
        this.setState({ loading: true });
        if(this.props.location.state.movie.directorsIds !== undefined){
            this.getPeople('directors', this.props.location.state.movie.directorsIds)
        }
        if(this.props.location.state.movie.genre_ids !== undefined){
            this.getGenres(this.props.location.state.movie.genre_ids)
        }
        if(this.props.location.state.movie.actorsIds !== undefined){
            this.getPeople('actors', this.props.location.state.movie.actorsIds)
        }
        if(this.props.location.state.movie.id !== undefined){
            this.getSoundtrack(this.props.location.state.movie.id)
        }
        if(this.props.location.state.movie.title !== undefined){
            this.getTrailer(this.props.location.state.movie.title)
        }
    }

    public getGenres(genreIds:string[]) {
        const array : string[] = new Array();
        genreIds.forEach(genreId => {
            fetch(`http://localhost:5000/api/genres/${genreId}`)
            .then(response => response.json())
            .then(response => {
                array.push(response.name)
            })
            .catch(error => console.log(error))
        })
        this.setState({genres: array})
    }

    public getPeople(people: string, peopleIds: string[],) {
        const array : string[] = new Array();
        peopleIds.forEach(id => {
            fetch(`http://localhost:5000/api/people/${id}`)
            .then(response => response.json())
            .then(response => {
                array.push(response);
                people === 'directors' 
                    ? this.setState({ directors: array})
                    : this.setState({ actors: array })
            })
            .catch(error => console.log(error))
        })
    }

    public getSoundtrack(movieId: string) {
        fetch(`http://localhost:5000/api/Albums/${movieId}`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                soundtracks: response.songs, 
                soundtrackTitle: response.title,
                artists: response.artistsList
            })
        })
        .catch(error => console.log(error))
        
    }

    public getTrailer(movieTitle: string) {
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}%20trailer&key=${YOUTUBE_API_KEY}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            console.log(response.items[0].id.videoId)
            this.setState({
                trailerID: response.items[0].id.videoId
            })
        })
        .catch(error => console.log(error))
    }

    public render() {
        const  { movie } = this.props.location.state;
        
        return (
            <div>
                <Header/>
                <div className = {movieContainer}>
                    <div className = {firstMovieBox}>
                        <img src = {`http://image.tmdb.org/t/p/w185/${movie.poster_path}`} alt = "No image"/>
                        <div className = {secondMovieBox}>
                            <div className = {titleBox}>
                                {movie.title}
                            </div>

                            <div>
                                Release date: <Moment format="D MMMM YYYY">{movie.release_date || "No information"}</Moment><br/>
                                Runtime: {movie.runtime || "No information"} <br/>
                                <MovieGenres genres = {this.state.genres}/>
                            </div>
                        
                            <div className = {movieDetailsRating}>
                                <AverageRates movie={movie}/>
                                <div className = {ratingStars}>
                                    <Rating movie={movie}/>
                                </div> 
                            </div> 
                        </div>
                    </div>
                    <br/>
                    <div className = {trailer}>
                        <div>
                            { this.state.trailerID && <MovieTrailer trailerID = {this.state.trailerID}/> }
                            <div className = {overviewBox}>
                                <b>Overview: </b>
                                <br/>
                                {movie.overview || "No information"} 
                            </div>
                            <br/>
                            <MovieSoundtrack soundtracks = {this.state.soundtracks} artists = {this.state.artists} soundtrackTitle = {this.state.soundtrackTitle}/>
                        </div>
                        <div> 
                            <br/>
                            { this.state.directors && <MovieDirectors directors = {this.state.directors}/> }
                            <br/>
                            { this.state.actors && <MovieActors actors = {this.state.actors}/> } 
                            <br/>
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}