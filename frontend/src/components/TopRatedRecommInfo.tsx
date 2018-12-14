import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox, movieInfoRating } from 'src/utils/Emotions';
import Truncate from 'react-truncate';

interface IProps{
    movie: IMovie;
    topWatched: boolean;
    activePage: number;
}

export default class TopRatedRecommInfo extends React.Component<IProps> {

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
                        pathname: `/movies/${this.props.movie.id}`,
                        state:  { movie: this.props.movie} 
                    }}
                >
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
                </Link>

                <div className = {movieInfoBox}>
                    <div className = "movieTitle">
                        <Link 
                            to ={{
                                pathname: `/movies/${this.props.movie.id}`,
                                state:  { movie: this.props.movie} 
                            }}
                        >
                            {this.props.movie.title}
                        </Link>
                    </div>

                    <div>
                    <Truncate lines={7} ellipsis={
                        <span>... 
                            <Link 
                                to ={{
                                    pathname: `/movies/${this.props.movie.id}`,
                                    state:  { movie: this.props.movie} 
                                }}
                            >Read more
                            </Link>
                        </span>}>
                        {this.props.movie.overview}
                    </Truncate> 
                    </div>

                    <div className = {movieInfoRating}>
                        <div>
                            <div>
                                <div className = "rate">
                                    {(this.props.movie.voteAverage).toFixed(1)}
                                </div>/5
                            </div>
                            <div>
                                <div className = "rate">
                                    {this.props.movie.rating}
                                </div>/5
                            </div>
                            <OverlayTrigger placement="right" overlay={tooltip}>
                                <Badge>
                                    {this.props.movie.ratingCount}
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