import * as React from 'react';

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
                        <h5>{director.name}</h5>
                    ))
                }
            </div>
        );
    }
}