import * as React from 'react';
import Header from './components/Header'
import Search from './components/Search';
import MovieTabs from './components/MovieTabs';

class Movies extends React.Component {
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

export default Movies;
