import * as React from 'react';
import "../../App.css";

interface IProps {
    directors: any[];
}
export default class MovieDirectors extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <b>Directors: </b>
                {
                    this.props.directors.map((director:any) => (
                        <div>
                            <br/>
                            <img className = "altSize" src = {`http://image.tmdb.org/t/p/w45${director.pictureUrl}`} alt = "No image"/> &nbsp;
                            <h5 className = "personInfo">{director.name}</h5>
                        </div>
                        
                    ))
                }
            </div>
        );
    }
}