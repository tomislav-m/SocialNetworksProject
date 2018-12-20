import * as React from 'react';
import Header from '../Header';
import { inject, observer } from 'mobx-react';
import { IMobxStore } from '../../stores/mobxStore';
import { RouteComponentProps } from "react-router-dom";
import { movieDetailsRating, infoBox, titleBox, overviewBox, movieContainer, firstMovieBox, secondMovieBox } from 'src/utils/Emotions';
import Moment from 'react-moment';
import Rating from '../rate/Rating';
import AverageRates from '../rate/AverageRates';
import MovieGenres from './MovieGenres';
import MovieDirectors from './MovieDirectors';
import MovieActors from './MovieActors';

interface IRouteParams {
    movieID: string; 
}

interface IProps extends RouteComponentProps<IRouteParams>{ 
    mobxStore?: IMobxStore;
}

interface IState {
    loading: boolean;
    directors: any[];
    actors: any[];
    genres: any[];
    rate: number;
}

@inject('mobxStore')
@observer
export default class MovieDetails extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state ={ 
            loading: false, 
            directors: new Array,
            actors: new Array,
            genres: new Array,
            rate: 0
        };
    }

    public componentDidMount(){
        this.setState({ loading: true });
        this.getPeople('directors', this.props.location.state.movie.directorsIds)
        this.getGenres(this.props.location.state.movie.genre_ids)
        this.getPeople('actors', this.props.location.state.movie.actorsIds)
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

    public getSoundtrack(soundtrackId: string[]) {
        console.log(soundtrackId)
        // api za dohvaćanje soundtracka???
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
                            <div className = {titleBox}>
                                {movie.title}
                            </div>

                            <div className = {infoBox}>
                                Release date: <Moment format="D MMMM YYYY">{movie.release_date || "no information"}</Moment><br/>
                                Runtime: {movie.runtime || "no information"} <br/>
                                <MovieGenres genres = {this.state.genres}/>
                            </div>
                        
                            <div className = {movieDetailsRating}>
                                <div>
                                    <AverageRates movie={movie}/>
                                    <Rating movie={movie}/>
                                </div>
                            </div> 
                        </div>
                    </div>
                    
                    <div className = {overviewBox}>
                        <b>Overview: </b>
                        {movie.overview} 
                    </div>

                    <div>
                        <br/>
                        <MovieDirectors directors = {this.state.directors}/> <br/>
                        <MovieActors actors = {this.state.actors}/> <br/>
                        <b>Soundtrack:</b>
                    </div>
                </div> 
            </div>
        );
    }
}