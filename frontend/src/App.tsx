import * as React from 'react';
import Header from './components/Header'
import Search from './components/search/Search';
import MovieTabs from './components/movie-tabs/MovieTabs';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Header/>
        <Search/>
        <MovieTabs/>
      </div>
    );
  }
}

export default App;
