import * as React from 'react';
import * as _ from 'lodash';
import { IMovie } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import ReactLoading from 'react-loading';
import TopRatedRecommInfo from './movie-info/TopRatedRecommInfo';
import { paginationBox } from 'src/utils/Emotions';

interface IState {
    movies: IMovie[];
    loading: boolean;
    activePage: number;
}
export default class TopRated extends React.Component<{ history?: any }, IState>{
    constructor(props: any) {
        super(props);
        this.state = { 
            movies: [] ,
            loading: false,
            activePage: 1
        };

    }

    public componentDidMount() {
        this.getTopRated(1);
    }

    public getTopRated(page: number){
        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/movies/top-rated?pageSize=20&pageNum=${page}`)
        .then(response => response.json())
        .then((response: any[]) => {
            this.setState({ 
                movies: response,
                loading:false
            }); 
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    public handlePageChange = (selectedPage: number) => {
        console.log(`active page is ${selectedPage}`);
        this.setState({
            activePage: selectedPage,
            loading: true
        });
        this.getTopRated(selectedPage);
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.state.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <TopRatedRecommInfo movie = {i}/>
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
                <div className = {paginationBox}>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={200}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange}
                    />
                </div> }
            </div>
        );
    }
}