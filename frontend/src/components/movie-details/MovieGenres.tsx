import * as React from 'react';
import "../../App.css";

interface IProps {
    genres: any[];
}
export default class MovieGenres extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <h5 className = "genres">Genres:&nbsp;</h5>
                {
                    (this.props.genres.length !== 0)
                        ? this.props.genres.map((genre:any) => {
                            if (this.props.genres.length - 1 === this.props.genres.indexOf(genre)) {
                                return(<h5 className = "genres">{genre}</h5>)
                            }
                            return(<h5 className = "genres" key={genre}>{genre}, &nbsp;</h5>)
                            
                        }) 
                        : "No information"
                }
            </div>
        );
    }
}