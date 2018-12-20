import * as React from 'react';
import Header from './components/Header'
import Search from './components/search/Search';
import MovieTabs from './components/movie-tabs/MovieTabs';
import { IMobxStore } from './stores/mobxStore';
import { inject, observer } from 'mobx-react';

interface IProps {
  mobxStore?: IMobxStore
}

@inject('mobxStore')
@observer
class App extends React.Component< IProps > {
  public render() {
    return (
      <div>
        <Header firstName = { this.props.mobxStore!.firstName }/>
        <Search/>
        <MovieTabs/>
      </div>
    );
  }
}

export default App;
