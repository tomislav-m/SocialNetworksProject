import * as React from 'react';
import "../../App.css";

interface IProps {
    actors: any[];
}
export default class MovieActors extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <b>Actors: </b> 
                {
                    this.props.actors.map((actor:any) => (
                        <div>
                            <br/>
                            <img className = "altSize" src = {`http://image.tmdb.org/t/p/w45${actor.pictureUrl}`} alt = "No image"/> &nbsp;
                            <h5 className = "personInfo">{actor.name}</h5> 
                        </div> 
                    ))
                }
            </div>
        );
    }
}