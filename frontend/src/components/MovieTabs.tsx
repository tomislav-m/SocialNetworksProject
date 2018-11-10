import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import '../App.css';

export default class MovieTabs extends React.Component {
    public render() {
        return (
                <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example" className="movieTabs">
                    <Tab eventKey={1} title="Top watched">
                        Tab 1 content
                </Tab>
                    <Tab eventKey={2} title="Top rated">
                        Tab 2 content
                </Tab>
                    <Tab eventKey={3} title="Recommended">
                        Tab 3 content
                </Tab>
                </Tabs>
        );
    }
}