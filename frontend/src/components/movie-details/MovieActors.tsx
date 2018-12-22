import * as React from 'react';
import "../../App.css";
import image from 'src/images/no-photo-icon-10.jpg';

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
                            {
                                actor.pictureUrl !== null
                                ? <img src = {`http://image.tmdb.org/t/p/w45${actor.pictureUrl}`}/>
                                : <img className = "altSize" src = {image}/>
                            }
                            &nbsp;&nbsp;<h5 className = "personInfo">{actor.name}</h5> 
                        </div> 
                    ))
                }
            </div>
        );
    }
}