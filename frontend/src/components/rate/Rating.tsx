import * as React from 'react';
import Rater from 'react-rater';
import { IMovie } from 'src/utils/Typings';

interface IProps{
    movie: IMovie;
}

interface IState {
    movieId: string;
    rate: number;
    loading: boolean;
}

export default class Rating extends React.Component<IProps, IState > {
    
    constructor(props: any) {
        super(props);
        this.state ={ 
            movieId: '',
            rate: 0,
            loading: false,
        };
    }

    public componentWillMount(){
        this.getMovieIdFromDatabase(this.props.movie.id)
    }

    public getMovieIdFromDatabase(movieId: string) {
        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/movies/${movieId}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then((response: any) => {
            this.setState({ 
                movieId: response.id,
            }, () => this.getRateForMovie(response.id)); 
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    public getRateForMovie(movieId: string) {  
        if(movieId !== ''){
            fetch(`http://localhost:5000/api/users/get-rating?userId=${localStorage.getItem('id')}&movieId=${movieId}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then((response: number) => {
                this.setState({ 
                    movieId,
                    rate: response,
                    loading: false
                }); 
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    public rate = (event: any) =>{
        if (localStorage.getItem('firstName') !== "") {
            this.setState({ rate: event.rating }, () => {
                const key = this.state.movieId;
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
        } else {
            console.log("You are not logged in!")
        }
    }

    public render() {
        if (!this.state.loading) {
            return (
                <div className = "ratingStars">
                    Rate this movie:
                    <div className="sizeStars"> 
                        <Rater total={5} rating={this.state.rate} onRate={this.rate}/>  
                    </div>
                </div> 
            );
        }
        return null
    }
}