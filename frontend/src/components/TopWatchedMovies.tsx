import * as React from 'react';
import { IMovie } from 'src/utils/Typings';
import TopWatchedInfo from './TopWatchedInfo';
import * as _ from 'lodash';

interface IProps {
    movies: IMovie[];
}
export default class TopWatchedMovies extends React.Component<IProps>{
    constructor(props: any) {
        super(props);
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.props.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <TopWatchedInfo movieID = {i.id} topWatched={true} />
                </div>
            )
            key++;
        });
        return movies;
    }

    public render() {
        return (
            <div>
                {this.renderBody()}
            </div>
        );
    }
}