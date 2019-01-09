import * as React from 'react';
import { IMovie } from 'src/utils/Typings';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface IProps{
    movie: IMovie;
}

export default class AverageRates extends React.Component<IProps> {

    public render() {
        const tooltip1 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.props.movie.voteAverage).toFixed(1)} based on IMDB, Metacritic and Rotten Tomatoes user ratings</strong>
            </Tooltip>
        );
        const tooltip2 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.props.movie.rating).toFixed(1)} based on {this.props.movie.ratingCount} user ratings</strong>
            </Tooltip>
        );

        return (
            <div>
                <OverlayTrigger placement="right" overlay={tooltip1}>
                    <div className = "rate">
                        {this.props.movie.voteAverage ? Number(this.props.movie.voteAverage).toFixed(1) : '0'}
                    </div>
                </OverlayTrigger>/5
                <br/>
                <OverlayTrigger placement="right" overlay={tooltip2}>
                    <div className = "rate">
                        {this.props.movie.rating ? Number(this.props.movie.rating).toFixed(1) : '0'}
                    </div>
                </OverlayTrigger>/5     
            </div>
        );
    }
}