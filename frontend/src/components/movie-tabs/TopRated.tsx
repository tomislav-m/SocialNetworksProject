import * as React from 'react';
import * as _ from 'lodash';
import { IMovie } from 'src/utils/Typings';
import TopRatedRecommInfo from '../TopRatedRecommInfo';
import Pagination from 'react-js-pagination';

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
        this.getTopRated();
    }

    public getTopRated(){
        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/movies/top-rated?pageSize=20`)
        .then(response => response.json())
        .then((response: any[]) => {
            this.setState({ 
                movies: response,
                loading:false
            }); 
        })
        .catch(error => console.error('Error:', error));
    }

    public handlePageChange = (selectedPage: number) => {
        console.log(`active page is ${selectedPage}`);
        this.setState({
            activePage: selectedPage,
            loading: true
        });
        fetch(`http://localhost:5000/api/movies/top-rated?pageSize=20&pageNum=${selectedPage}`)
        .then(response => response.json())
        .then(response => {
            this.setState( {
                movies: response,
                loading: false
            })
        })
        .catch((error) => {
            console.error("Error:", error);
            this.props.history.push("/error");
        });
        console.log(this.state.movies);
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
                { !this.state.loading && this.renderBody()}
                <div>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={200}
                        pageRangeDisplayed={10}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}