import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
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
          <Route exact path={"/movies"} component={App}/>
          <Route exact path={"/profile/:userID"} component={Profile}/>
          <Route exact path={"/movies/:movieID"} component={Movie}/>
        </div>
    </BrowserRouter>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
