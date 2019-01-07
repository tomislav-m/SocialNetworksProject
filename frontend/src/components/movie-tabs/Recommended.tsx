import * as React from 'react';
import * as _ from 'lodash';
import { IMovie, IGenre } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import TopRatedRecommInfo from './movie-info/TopRatedRecommInfo';
import GenreModal from 'src/components/GenreModal';
import { Button } from 'react-bootstrap';
import { genreButton } from 'src/utils/Emotions';

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
        this.setState({
            activePage: selectedPage,
            loading: true
        });

        fetch(`http://localhost:5000/api/users/recommend/${localStorage.getItem('id')}?pageSize=20&pageNum=${selectedPage}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
        })
        .then(response => response.json())
        .then(response => {
            this.setState( {
                movies: response,
                loading: false
            })
        })
        .catch((error) => {
            console.error("Error:", error);
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

    public openGenreModal = () => {
        this.setState({ showGenreModal: true })
    }

    public closeGenreModal = () => {
        this.setState({ showGenreModal: false })
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
        return (
            <div>
                <div className = {genreButton} >
                    <Button onClick={this.openGenreModal} bsStyle="primary">Choose genres</Button>
                </div>
                {this.state.showGenreModal && <GenreModal genres = {this.state.genres} onClose={this.closeGenreModal} onSave={this.closeGenreModal}/>}
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