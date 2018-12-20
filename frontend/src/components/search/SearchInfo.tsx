import * as React from 'react';
import '../../App.css';
import { IMovie } from 'src/utils/Typings';
import 'react-rater/lib/react-rater.css'
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox } from 'src/utils/Emotions';
import Truncate from 'react-truncate';

interface IProps{
    movie: IMovie;
}

export default class SearchInfo extends React.Component<IProps> {

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
                            {this.props.movie.overview}
                        </Truncate> 
                    </div>

                </div>
            </div>                  
        );
    }
}