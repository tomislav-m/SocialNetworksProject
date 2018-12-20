import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import '../App.css';
import TopWatched from 'src/components/movie-tabs/TopWatched';
import TopRated from 'src/components/movie-tabs/TopRated';
import Recommended from 'src/components/movie-tabs/Recommended';

export default class MovieTabs extends React.Component {
    public render() {
        return (
            <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example" className="movieTabs">
                <Tab eventKey={1} title="Top watched">
                    <TopWatched/>
                </Tab>
                <Tab eventKey={2} title="Top rated">
                    <TopRated/>
                </Tab>
                <Tab eventKey={3} title="Recommended">
                    <Recommended/>
                </Tab>
            </Tabs>
        );
    }
}