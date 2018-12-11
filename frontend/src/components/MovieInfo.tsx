import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import { css } from 'emotion';

const container = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const box = css`
    display: grid;
    grid-auto-rows: default;
`

interface IProps{
    movie: IMovie;
}

export default class MovieInfo extends React.Component<IProps> {

    public render() {
        return (
            <div>
                <br/>
                <div className = {container}>
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
                    <div className = {box}>
                        <div>{this.props.movie.title}</div>
                        <div>{this.props.movie.overview}</div>
                        <div>{this.props.movie.vote_average}</div>
                    </div>
                </div>                  
            </div>
        );
    }
}