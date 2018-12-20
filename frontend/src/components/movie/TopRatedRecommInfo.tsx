import * as React from 'react';
import "../../App.css";
import { IMovie } from 'src/utils/Typings';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {movieInfoContainer, movieInfoBox, movieInfoRating } from 'src/utils/Emotions';
import Truncate from 'react-truncate';

interface IProps{
    movie: IMovie;
}

interface IState {
    rate: number;
}

export default class TopRatedRecommInfo extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state ={ 
            rate: 0
        };
    }

    public rate = (event: any) =>{
        this.setState({ rate: event.rating }, () => {
            const key = this.props.movie.id;
            const obj = {};
            obj[key] = this.state.rate;
            const data = JSON.stringify(obj);
            fetch(`http://localhost:5000/api/users/add-ratings/${localStorage.getItem('id')}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        })
        console.log(this.props.movie.id)
        // const movieId: string = this.props.location.state.movie.id; 
    }

    public render() {
        const tooltip1 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.props.movie.voteAverage).toFixed(1)} based on IMDB, TMDB and RT user ratings</strong>
            </Tooltip>
        );
        const tooltip2 = (
            <Tooltip id="tooltip">
                <strong>{Number(this.props.movie.rating).toFixed(1)} based on {this.props.movie.ratingCount} user ratings</strong>
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

                    <div className = {movieInfoRating}>
                    <div>
                            <OverlayTrigger placement="right" overlay={tooltip1}>
                                <div className = "rate">
                                    {Number(this.props.movie.voteAverage).toFixed(1)}
                                </div>
                            </OverlayTrigger>/5
                        
                            <br/>
                            
                            <OverlayTrigger placement="right" overlay={tooltip2}>
                                <div className = "rate">
                                    {Number(this.props.movie.rating).toFixed(1)}
                                </div>
                            </OverlayTrigger>/5     
                        </div>

                        <div className = "ratingStars">
                            Rate this movie:
                            <div className="sizeStars"> 
                                <Rater total={5} rating={0} onRate={this.rate}/>  
                            </div>
                        </div> 
                    </div>
                </div>
            </div>                  
        );
    }
}