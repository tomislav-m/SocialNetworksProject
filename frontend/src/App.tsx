import * as React from 'react';
import Header from './components/Header'
import Search from './components/Search';
import MovieTabs from './components/MovieTabs';
import AppState from './states/AppState';
import { inject, observer } from 'mobx-react';

@inject('appState')
@observer
class App extends React.Component< { appState: AppState }> {
  public render() {
    return (
      <div>
        <Header firstName = { this.props.appState.firstName }/>
        <Search/>
        <MovieTabs/>
      </div>
    );
  }
}

export default App;
