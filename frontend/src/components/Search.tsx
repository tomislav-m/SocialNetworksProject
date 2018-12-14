import * as React from 'react';
import { FormGroup, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import '../App.css';

interface IState {
    title: string;
}

export default class Search extends React.Component< {}, IState > {
    
    constructor(props: any) {
        super(props);
        this.state = {
            title: '',
        }
    }
    public getMovieByTitle = () => {
        fetch(`http://localhost:5000/api/movies/search/${this.state.title}`)
        .then(response => response.json())
        .then(response =>{
            console.log(response)
        })
        .catch(error => console.log(error))
    }

    public handleInputChange = (event: any) => {
        this.setState({
            title: event.target.value
        });
    }
    public render() {
        return (
            <FormGroup className="searchInput">
                <InputGroup>
                    <FormControl type="text" placeholder="Search movies" value={this.state.title} onChange = {this.handleInputChange}/>
                    <InputGroup.Button>
                        <Button onClick = {this.getMovieByTitle}>
                            <Glyphicon glyph="search"/>
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }
}