import * as React from 'react';
import { Modal, Button, Checkbox } from 'react-bootstrap';
import * as _ from 'lodash'; 
import "../App.css";
import { IGenre } from 'src/utils/Typings';

interface IProps {
    onClose: () => void;
    onSave: () => void;
    genres: IGenre[];
}
interface IState {
    checkedItems: Map<string, boolean>;
}
export default class GenreModal extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = { 
            checkedItems: new Map(),
        };
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
            <Modal show={true} onHide={this.props.onClose} bsSize="small">
                <Modal.Header closeButton={true}>
                    <Modal.Title>Select favourite genres</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        {
                        this.props.genres.map(item => (
                            <div key={item.id}>
                                <label>
                                    <Checkbox name={item.name} checked={!!this.state.checkedItems.get(item.name)} onChange={this.handleChange}>
                                        {item.name}
                                    </Checkbox>
                                </label>
                            </div>
                        ))
                        }
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick = {this.props.onClose}>Close</Button>
                    <Button onClick = {this.props.onSave} bsStyle="primary">Filter</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}