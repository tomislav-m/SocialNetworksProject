import * as React from 'react';
import { IMovie } from 'src/utils/Typings';
import 'react-rater/lib/react-rater.css'
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox, movieInfoRating } from 'src/utils/Emotions';
import Truncate from 'react-truncate';
import Rating from '../../rate/Rating';
import AverageRates from '../../rate/AverageRates';

interface IProps{
    movie: IMovie;
}

export default class TopRatedRecommInfo extends React.Component<IProps> {
    constructor(props: any){
        super(props);
    }

    public render() {    

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
                        <Truncate lines={4} ellipsis={
                            <span>... 
                                <Link 
                                    to ={{
                                        pathname: `/movies/${this.props.movie.id}`,
                                        state:  { movie: this.props.movie} 
                                    }}
                                >Read more
                                </Link>
                            </span>}>
                            {this.props.movie.overview || "No information"}
                        </Truncate> 
                    </div>

                    <div className = {movieInfoRating}>
                        <AverageRates movie={this.props.movie}/>
                        <Rating movie={this.props.movie}/>
                    </div>
                </div>
            </div>                  
        );
    }
}