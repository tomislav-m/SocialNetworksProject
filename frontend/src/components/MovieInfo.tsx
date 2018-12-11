import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';

interface IProps{
    movie: IMovie;
}

export default class MovieInfo extends React.Component<IProps> {

    public render() {
        console.log(this.props.movie)
        return (
            <div>
                <br/>
                {this.props.movie.title}
                <br/>
                {this.props.movie.overview}
                <br/>
                {this.props.movie.vote_average}
                <br/>
                <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
            </div>
        );
    }
}