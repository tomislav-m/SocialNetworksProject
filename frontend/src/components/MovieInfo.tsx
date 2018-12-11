import * as React from 'react';
import '../App.css';
import { IMovie } from 'src/utils/Typings';
import { css } from 'emotion';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const container = css`
    display: grid;
    grid-template-columns: 0.5fr 1fr;
    padding-top: 2em;
`
const box = css`
    display: grid;
    grid-auto-rows: 50px 175px 20px;
`
const rating = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
`

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
            <div className = {container}>
                <Link to ={`/movies/${this.props.movie.id}`}>
                    <img src = {`http://image.tmdb.org/t/p/w185/${this.props.movie.poster_path}`} alt = "No image"/>
                </Link>
                <div className = {box}>
                    <div className = "movieTitle">
                        <Link to={`/movies/${this.props.movie.id}`}>{this.props.movie.title}</Link>
                    </div>
                    <div>{this.props.movie.overview}</div>
                    <div className = {rating}>
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
                            Rate   <Rater total={10} rating={0} />
                        </div>
                    </div>
                </div>
            </div>                  
        );
    }
}