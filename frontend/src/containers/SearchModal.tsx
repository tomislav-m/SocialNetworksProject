import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as _ from 'lodash'; 
import { IMovie } from 'src/utils/Typings';
import SearchInfo from './SearchInfo';

interface IProps {
    title: string;
    movies: IMovie[];
    onClose: () => void;
}

export default class SearchModal extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public renderBody = () => {
        const movies: any[] = new Array();
        let key = 1;
        _.forEach(this.props.movies, (i) => {
            movies.push(
                <div key = {key}>
                    <SearchInfo movie = {i}/>
                </div>
            )
            key++;
        });
        return movies;
    }

    public render() {
        return (
            <Modal show={true} onHide={this.props.onClose}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Results for: {this.props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{this.renderBody()}</Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}