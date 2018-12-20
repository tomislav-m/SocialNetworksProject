import * as React from 'react';
import { FormGroup, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import "../../App.css";
import SearchModal from 'src/components/search/SearchModal';
import { IMovie } from 'src/utils/Typings';
import ReactLoading from 'react-loading';

interface IState {
    searchInput: string;
    showSearchModal: boolean;
    movies: IMovie[];
    loading: boolean;
}

export default class Search extends React.Component< {}, IState > {
    
    constructor(props: any) {
        super(props);
        this.state = {
            searchInput: '',
            showSearchModal: false,
            movies: [],
            loading: false
        }
    }
    public getMovieByTitle = () => {
        this.setState({ loading: true });
        fetch(`http://localhost:5000/api/movies/search/${this.state.searchInput}`)
        .then(response => response.json())
        .then(response =>{
            console.log(response);
            this.setState({ 
                movies: response,
                showSearchModal: true,
                loading: false
            });
        })
        .catch(error => console.log(error))
    }

    public handleEnterPress = (event: any) => {
        if(event.key === 'Enter') {
            this.getMovieByTitle();
        }
    }

    public handleInputChange = (event: any) => {
        this.setState({
            searchInput: event.target.value
        });
    }

    public closeSearchModal = () => {
        this.setState({ showSearchModal: false });
    }

    public render() {
        return (
            <FormGroup className="searchInput">
                <InputGroup onKeyPress={this.handleEnterPress}>
                    <FormControl type="text" placeholder="Search movies" value={this.state.searchInput} onChange = {this.handleInputChange}/>
                    <InputGroup.Button>
                        <Button onClick = {this.getMovieByTitle}>
                            <Glyphicon glyph="search"/>
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
                { this.state.showSearchModal && 
                    <SearchModal title={this.state.searchInput} movies={this.state.movies} onClose={this.closeSearchModal}/>
                }
                { this.state.loading && <ReactLoading type="spin" color="black" width="35%" height="15em" />}
            </FormGroup>
        );
    }
}