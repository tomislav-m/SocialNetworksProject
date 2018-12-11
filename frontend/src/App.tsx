import * as React from 'react';
import Header from './components/Header'
import Search from './components/Search';
import MovieTabs from './components/MovieTabs';
import AppState from './states/AppState';
import { inject, observer } from 'mobx-react';

@inject('state')
@observer
class App extends React.Component< { state: AppState }> {
  public render() {
    return (
      <div>
        <Header state = { this.props.state }/>
        <Search/>
        <MovieTabs/>
      </div>
    );
  }
}

export default App;
