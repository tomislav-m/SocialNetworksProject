import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as _ from 'lodash'; 
import IGenres from '../components/utils/Typings';

interface IProps {
    onClose: () => void;
    onSave: () => void;
}

interface IState {
    genres: IGenres[];
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
        .then((response: IGenres[]) => {
            console.log("Success:", JSON.stringify(response));
            this.setState({
                genres: response
            })  
        })
        .catch(error => console.error("Error:", error));
    }

    public renderBody = () => {
        const forecast: any[] = new Array();
        let key = 1;
        _.forEach(this.state.genres, (i) => {
            console.log(i.name)
            forecast.push(
                <div key={key}>
                    {i.name}
                </div>
            )
            key++;
        });
        return forecast;
    }

    public render() {
        return (
            <Modal show={true} onHide={this.props.onClose}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Select preferred genres</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                {
                    this.renderBody()
                }
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                    <Button onClick = {this.props.onSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}