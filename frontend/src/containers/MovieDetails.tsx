import * as React from 'react';
import Header from '../components/Header';
import { inject, observer } from 'mobx-react';
import { IMobxStore } from '../stores/mobxStore';
import { RouteComponentProps } from "react-router-dom";
import { movieDetailsRating, infoBox, titleBox, overviewBox, movieContainer, firstMovieBox, secondMovieBox } from 'src/utils/Emotions';
import Moment from 'react-moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Rater from 'react-rater';
import * as _ from 'lodash';

interface IRouteParams {
    movieID: string; 
}

interface IProps extends RouteComponentProps<IRouteParams>{ 
    mobxStore?: IMobxStore;
}

interface IState {
    loading: boolean;
    directors: string[];
    actors: string[];
    genres: string[];
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
            genres: new Array
        };
    }

    public componentDidMount(){
        this.setState({ loading: true });
        this.getPeople('directors', this.props.location.state.movie.directorsIds)
        this.getGenres(this.props.location.state.movie.genre_ids)
    }

    public getGenres(genreIds:string[]) {
        const array : string [] = new Array();
        genreIds.forEach(genreId => {
            // console.log(genreId)
            fetch(`http://localhost:5000/api/genres/${genreId}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.name)
                array.push(response.name)
            })
        })
        this.setState({
            genres: array,
            loading: false
        })
        
    }

    public getPeople(people: string, peopleIds: string[],) {
        const array : string[] = new Array();
        peopleIds.forEach(id => {
            console.log(id)
            fetch(`http://localhost:5000/api/people/${id}`)
            .then(response => response.json())
            .then(response => {
                array.push(response.name);
                people === 'directors' 
                    ? this.setState({ directors: array})
                    : this.setState({ actors: array })
            })
        })
        console.log('array'+ array)
    }

    public getSoundtrack(soundtrackId: string[]) {
        console.log(soundtrackId)
        // api za dohvaćanje soundtracka???
    }

    public renderDirectors = () => {
        console.log('renderDirectors:' + this.state.directors);
        const array: any[] = new Array();
        let key = 1;
        _.forEach(this.state.directors, (i) => {
            array.push(
                <div key={key}>
                    <p> <strong> { i }</strong></p>
                </div>
            )
            key++;
        });
        return array;
    }

    public renderGenres = () => {
        const array: any[] = new Array();
        _.forEach(this.state.genres, (i) => {
            array.push(
                    <h5>{ i }, </h5>
            )
        });
        return array;
    }
    


    public renderBody = () => {
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
        return(
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
                                Genres:  {this.renderGenres()}
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
                        Director:
                        {this.renderDirectors()}<br/>
                        Actors:
                        {} <br/>
                        Soundtrack:
                        {this.getSoundtrack(movie.soundtrackId)}
                    </div>
                </div> 
            </div>
        )
    }
    public render() {
        
        return (
            <div>
                {!this.state.loading && this.renderBody()}
            </div>
        );
    }
}