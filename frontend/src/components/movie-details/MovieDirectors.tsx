import * as React from 'react';
import "../../App.css";
import image from 'src/images/no-photo-icon-10.jpg';

interface IProps {
    directors: any[];
}
export default class MovieDirectors extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <b>Directors: </b>
                {
                    (this.props.directors.length !== 0)
                    ? this.props.directors.map((director:any) => (
                        <div>
                            <br/>
                            {
                                director.pictureUrl !== null
                                ? <img src = {`http://image.tmdb.org/t/p/w45${director.pictureUrl}`}/>
                                : <img className = "altSize" src = {image}/>
                            }
                            &nbsp;&nbsp;<h5 className = "personInfo">{director.name || "no information"}</h5>
                        </div>
                    ))
                    : "no information"   
                } 
            </div>
        );
    }
}