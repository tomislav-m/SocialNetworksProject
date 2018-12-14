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
        this.getTopRated();
    }

    public getTopRated(){
        fetch(`http://localhost:5000/api/movies/top-rated`)
        .then(response => response.json())
        .then((response: any[]) => {
            console.log(response);
            /* const movies= response.map(movie => {
                const mappedMovie: IMovie = {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.plot,
                    poster_path: movie.posterUrl,
                    voteAverage: movie.voteAverage,
                    ratingCount: movie.voteCount
                }
                return mappedMovie;
            });
            this.setState({ movies }); */
        })
        .catch(error => console.error('Error:', error));
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.state.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <MovieInfo movie = {i} topWatched={false} activePage={1}/>
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