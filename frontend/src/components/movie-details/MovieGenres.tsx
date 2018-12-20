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
                    this.props.genres.map((genre:any) => (
                        <h5 className = "genres">{genre}, &nbsp;</h5>
                    ))
                }
            </div>
        );
    }
}