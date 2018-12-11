import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import { css } from 'emotion';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'

const container = css`
    display: grid;
    grid-template-columns: 0.5fr 1fr;
`
const box = css`
    display: grid;
    grid-auto-rows: 50px 200px 20px;
`
const rating = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
`
const ratingStars = css`
    
`

interface IProps{
    movie: IMovie;
}

export default class MovieInfo extends React.Component<IProps> {

    public function() {
        console.log('bla')
    }

    public render() {
        return (
            <div>
                <br/>
                <div className = {container}>
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
                    <div className = {box}>
                        <div className = "movieTitle">{this.props.movie.title}</div>
                        <div>{this.props.movie.overview}</div>
                        <div className = {rating}>
                            <div>{this.props.movie.vote_average}</div>
                            <div className = {ratingStars}><Rater total={5} rating={2} /></div>
                        </div>
                    </div>
                </div>                  
            </div>
        );
    }
}