import * as React from 'react';
import Rater from 'react-rater';
import { IMovie } from 'src/utils/Typings';

interface IProps{
    movie: IMovie;
}

interface IState {
    rate: number;
}

export default class Rating extends React.Component<IProps, IState > {
    
    constructor(props: any) {
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
    }

    public render() {
        return (
            <div className = "ratingStars">
                Rate this movie:
                <div className="sizeStars"> 
                    <Rater total={5} rating={this.state.rate} onRate={this.rate}/>  
                </div>
            </div> 
        );
    }
}