import * as React from 'react';

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
                        <h5>{actor.name}</h5>
                    ))
                }
            </div>
        );
    }
}