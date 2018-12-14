import * as React from 'react';
import * as _ from 'lodash';
import { IMovie } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import TopWatchedMovies from '../TopWatchedMovies';

interface IState {
    movies: IMovie[];
    totalPages: number;
    activePage: number;
    totalItemsCount: number;
    loading: boolean;
}

export default class TopWatched extends React.Component<{ history?: any }, IState>{
    constructor(props: any) {
        super(props);
        this.state = { 
            movies: [],
            totalPages: 1,
            activePage: 1,
            totalItemsCount:1,
            loading: false
        };
    }

    public componentDidMount() {
        this.getTopWatched();
    }

    public getTopWatched(){
        this.setState({ loading: true });
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=687a2e7fcee1a717e582f9665c5bf685&language=en-US`)
        .then(response => response.json())
        .then(response => {
            this.setState( {
                activePage: response.page,
                totalPages: response.total_pages,
                movies: response.results,
                totalItemsCount: response.total_results,
                loading: false
            })
        })
        .catch((error) => {
            console.error("Error:", error);
            // this.props.history.push("/error");
        });
    }

    public handlePageChange = (selectedPage: number) => {
        console.log(`active page is ${selectedPage}`);
        this.setState({
            activePage: selectedPage,
            loading: true
        });
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=687a2e7fcee1a717e582f9665c5bf685&language=en-US&page=${selectedPage}`)
        .then(response => response.json())
        .then(response => {
            this.setState( {
                activePage: response.page,
                totalPages: response.total_pages,
                movies: response.results,
                totalItemsCount: response.total_results,
                loading: false
            })
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
        console.log(this.state.movies);
    }

    public render() {
        return (
            <div>
                { !this.state.loading && <TopWatchedMovies movies={this.state.movies}/>}
                <div>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}