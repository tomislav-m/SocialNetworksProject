import * as React from 'react';
import * as _ from 'lodash';
import { IMovie, IGenre } from 'src/utils/Typings';
import Pagination from 'react-js-pagination';
import { Checkbox, Button } from 'react-bootstrap';
import TopRatedRecommInfo from 'src/components/movie/TopRatedRecommInfo';


interface IState {
    movies: IMovie[];
    loading: boolean;
    activePage: number;
    genres: IGenre[];
    name: boolean[];
}
export default class Recommended extends React.Component<{ history?: any }, IState>{
    constructor(props: any) {
        super(props);
        this.state = { 
            movies: [] ,
            loading: false,
            activePage: 1,
            genres: [],
            name: []
        };

    }

    public componentDidMount() {
        this.getRecommended();
        this.getGenres();
    }

    public getRecommended(){
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

    public handleInputChange(event : any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
    
        this.setState({
            name: value
        });
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

    public getGenres = () => {
        fetch("http://localhost:5000/api/genres")
        .then(response => response.json())
        .then((response: IGenre[]) => {
            this.setState({
                genres: response
            })  
        })
        .catch(error => console.error("Error:", error));
    }

    public renderSelectGenres = () => {
        const genres: any[] = new Array();
        let key = 1;
        _.forEach(this.state.genres, (i) => {
            console.log(i.name)
            genres.push(
                <div key={key} className="genres">
                    <Checkbox>
                        {i.name}
                    </Checkbox>
                </div>
            )
            key++;
        });
        return genres;
        
    }

    

    public render() {
        return (
            <div>
                <div>
                    { this.renderSelectGenres()}
                    Is going:
                    <input
                        name="isGoing"
                        type="checkbox"
                        checked={true}
                        onChange={this.handleInputChange} 
                    />
                    <Button type="submit">Filter</Button>
                </div>
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