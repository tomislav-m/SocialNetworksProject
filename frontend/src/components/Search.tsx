import * as React from 'react';
import { FormGroup, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import '../App.css';

export default class Search extends React.Component {
    public render() {
        return (
            <FormGroup className="searchInput">
                <InputGroup>
                    <FormControl type="text" placeholder="Search movies"/>
                    <InputGroup.Button>
                        <Button>
                            <Glyphicon glyph="search"/>
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }
}