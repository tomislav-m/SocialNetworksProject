import * as React from 'react';
import * as _ from 'lodash';
import { IMovie, IGenre } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import { Checkbox, Button } from 'react-bootstrap';
import TopRatedRecommInfo from './movie-info/TopRatedRecommInfo';
import { genreBox, genres } from 'src/utils/Emotions';

interface IState {
    movies: IMovie[];
    loading: boolean;
    activePage: number;
    genres: IGenre[];
    name: boolean[];
    checkedItems: Map<string, boolean>;
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
            checkedItems: new Map(),
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

    public handleChange = (e: any) => {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    }

    public getSelected = () => {
        console.log(this.state.checkedItems);
    }

    public render() {
        return (
            <div className = {genreBox}>
                <div>
                    {
                    this.state.genres.map(item => (
                        <div key={item.id}>
                            <label>
                                <Checkbox name={item.name} checked={!!this.state.checkedItems.get(item.name)} onChange={this.handleChange}>
                                    {item.name}
                                </Checkbox>
                            </label>
                        </div>
                    ))
                    }
                    <Button type="submit" onClick={this.getSelected}>Filter</Button>
                </div>
                <div className = {genres}>
                    { !this.state.loading && this.renderBody()}
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