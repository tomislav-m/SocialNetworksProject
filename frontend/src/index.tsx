import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Movies from './Movies';
import Login from './containers/Login';
import Profile from './containers/Profile';
import Movie from './containers/Movie';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
    <BrowserRouter>
        <div>
          <Route exact path={"/"} component={Login}/>
          <Route exact path={"/movies"} component={Movies}/>
          <Route exact path={"/movies/:movieID"} component={Movie}/>
          <Route exact path={"/profile"} component={Profile}/>
        </div>
    </BrowserRouter>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
