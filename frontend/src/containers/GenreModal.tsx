import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface IProps {
    onClose: () => void;
    onSave: () => void;
}
export default class GenreModal extends React.Component<IProps> {
    public render() {
        return (
            <Modal show={true} onHide={this.props.onClose}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>One fine body...</Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                    <Button onClick = {this.props.onSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}