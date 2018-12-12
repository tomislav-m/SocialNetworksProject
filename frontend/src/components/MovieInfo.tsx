import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {movieInfocontainer, movieInfobox, movieInforating } from 'src/utils/Emotions'

interface IProps{
    movie: IMovie;
}

export default class MovieInfo extends React.Component<IProps> {

    public render() {
        const tooltip = (
            <Tooltip id="tooltip">
              <strong>Number of votes</strong>
            </Tooltip>
          );
        return (
            <div className = {movieInfocontainer}>
                <Link to ={`/movies/${this.props.movie.id}`}>
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
                </Link>
                <div className = {movieInfobox}>
                    <div className = "movieTitle">
                        <Link to={`/movies/${this.props.movie.id}`}>{this.props.movie.title}</Link>
                    </div>
                    <div>{this.props.movie.overview}</div>
                    <div className = {movieInforating}>
                        <div>
                            <div>
                                <div className = "rate">
                                    {this.props.movie.vote_average}
                                </div>/10
                            </div >
                            <OverlayTrigger placement="right" overlay={tooltip}>
                                <Badge>
                                    {this.props.movie.vote_count}
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