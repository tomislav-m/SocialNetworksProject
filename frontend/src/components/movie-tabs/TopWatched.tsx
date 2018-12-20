import * as React from 'react';
import * as _ from 'lodash';
import { IMovie } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import TopWatchedInfo from 'src/components/movie/TopWatchedInfo';
import ReactLoading from 'react-loading';

interface IState {
    movies: IMovie[];
    totalPages: number;
    activePage: number;
    totalItemsCount: number;
    loading: boolean;
}

export default class TopWatched extends React.Component<{}, IState>{
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
        this.getTopWatched(1);
    }

    public getTopWatched(page: number){
        this.setState({ loading: true });
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=687a2e7fcee1a717e582f9665c5bf685&language=en-US&page=${page}`)
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
        });
    }

    public handlePageChange = (selectedPage: number) => {
        console.log(`active page is ${selectedPage}`);
        this.setState({
            activePage: selectedPage,
        }, () => this.getTopWatched(selectedPage));
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.state.movies, (i) => {
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
                { this.state.loading && <ReactLoading type="spin" color="black" width="35%" height="15em" className="loader"/>}
                { !this.state.loading && this.renderBody()}
                { !this.state.loading && 
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange}
                    />
                }
            </div>
        );
    }
}