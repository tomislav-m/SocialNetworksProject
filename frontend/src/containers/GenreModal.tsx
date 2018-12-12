import * as React from 'react';
import { Modal, Button, Checkbox } from 'react-bootstrap';
import * as _ from 'lodash'; 
import "../App.css";
import { IGenre } from 'src/utils/Typings';

interface IProps {
    onClose: () => void;
    onSave: () => void;
}

interface IState {
    genres: IGenre[];
}
export default class GenreModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { genres: []};
    }

    public componentWillMount(){
        this.getGenres();
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

    public renderBody = () => {
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
            <Modal show={true} onHide={this.props.onClose} bsSize="small">
                <Modal.Header closeButton={true}>
                    <Modal.Title>Select favourite genres</Modal.Title>
                </Modal.Header>

                <Modal.Body>{this.renderBody()}</Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                    <Button onClick = {this.props.onSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}