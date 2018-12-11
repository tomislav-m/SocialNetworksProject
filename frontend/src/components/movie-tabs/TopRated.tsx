import * as React from 'react';
import * as _ from 'lodash';
import { IMovie } from 'src/utils/Typings';
import MovieInfo from '../MovieInfo';

interface IState {
    movies: IMovie[];
}
export default class TopRated extends React.Component<{}, IState>{
    constructor(props: any) {
        super(props);
        this.state = { movies: [] };
    }

    public componentDidMount() {
        this.getTopWatched();
    }

    public getTopWatched(){
        fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=687a2e7fcee1a717e582f9665c5bf685&language=en-US')
        .then(response => response.json())
        .then(response => response.results)
        .then((response: IMovie[]) => {
            this.setState({
                movies: response
            })
        })
        .catch(error => console.error('Error:', error));
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.state.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <MovieInfo movie = {i}/>
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