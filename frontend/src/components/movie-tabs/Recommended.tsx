import * as React from 'react';
import * as _ from 'lodash';
import { IMovie, IGenre } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import TopRatedRecommInfo from './movie-info/TopRatedRecommInfo';
import GenreModal from 'src/components/GenreModal';
import { Button } from 'react-bootstrap';
import { genreButton } from 'src/utils/Emotions';
import { paginationBoxRecom } from 'src/utils/Emotions';

interface IState {
    movies: IMovie[];
    loading: boolean;
    activePage: number;
    genres: IGenre[];
    name: boolean[];
    showGenreModal: boolean;
}

export default class Recommended extends React.Component<{ history?: any }, IState>{
    constructor(props: any) {
        super(props);
        this.state = { 
            movies: [] ,
            loading: false,
            activePage: 1,
            genres: [],
            name: [],
            showGenreModal: false
        };
    }

    public componentDidMount() {
        this.getRecommended();
        this.getGenres();
    }

    public getRecommended(){
        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/users/recommend/${localStorage.getItem('id')}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
        })
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
        this.setState({ activePage: selectedPage });
    }

    public renderFirstTen = () => {
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
        const moviesToBeDropped = movies.length >= 10 ? movies.length - 10 : 0;
        return _.dropRight(movies, moviesToBeDropped);
    }

    public renderBetween = () => {
        let movies: any[] = new Array();
        let key = 1;
        _.forEach(this.state.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <TopRatedRecommInfo movie = {i}/>
                </div>
            )
            key++;
        });
        const moviesToBeDropped = movies.length >= 20 ? movies.length - 20 : 0;
        movies = _.drop(movies, 10)
        return _.dropRight(movies, moviesToBeDropped);
    }

    public renderLastTen = () => {
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
        return _.drop(movies, 20);
    }

    public openGenreModal = () => {
        this.setState({ showGenreModal: true })
    }

    public closeGenreModal = () => {
        this.setState({ showGenreModal: false })
    }

    public filter = (checked: string[]) => {
        console.log(checked);
        this.setState({ loading: true });
        const genres = checked.join(',');
        fetch(`http://localhost:5000/api/users/recommend/${localStorage.getItem('id')}?genres=${genres}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
        })
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
        this.closeGenreModal();
    }

    public getGenres = () => {
        fetch("http://localhost:5000/api/genres")
        .then(response => response.json())
        .then((response: IGenre[]) => {
            this.setState({
                genres: response
            })  
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    public render() {
        const movies = this.state.movies;
        return (
            <div>
                <div className = {genreButton} >
                    <Button onClick={this.openGenreModal} bsStyle="primary">Choose genres</Button>
                </div>
                {this.state.showGenreModal && <GenreModal genres = {this.state.genres} onClose={this.closeGenreModal} onFilter={this.filter}/>}
                { !this.state.loading && this.state.activePage === 1 && this.renderFirstTen()}
                { !this.state.loading && this.state.activePage === 2 && movies.length > 10 && this.renderBetween()}
                { !this.state.loading && this.state.activePage === 3 && movies.length > 20 && this.renderLastTen()}
                { !this.state.loading && 
                <div className = {paginationBoxRecom}>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={10}
                        totalItemsCount={movies.length}
                        pageRangeDisplayed={Math.ceil(movies.length/10)}
                        onChange={this.handlePageChange}
                    />
                </div> }
            </div>
        );
    }
}