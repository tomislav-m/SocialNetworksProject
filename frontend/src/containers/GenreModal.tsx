import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface IProps {
    onClose: () => void;
    onSave: () => void;
}
export default class GenreModal extends React.Component<IProps> {

    public componentWillMount(){
        this.getGenres();
    }

    public getGenres = () => {
        fetch("http://localhost:5000/api/genres")
        .then(response => response.json())
        .then(response => console.log("Success:", JSON.stringify(response)))
        .catch(error => console.error("Error:", error));
    }

    public render() {
        return (
            <Modal show={true} onHide={this.props.onClose}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Select preferred genres</Modal.Title>
                </Modal.Header>

                <Modal.Body>modal</Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                    <Button onClick = {this.props.onSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}