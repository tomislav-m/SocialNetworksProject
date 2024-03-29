import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Profile from './components/Profile';
import MovieDetails from './components/movie-details/MovieDetails';
import ErrorPage from './components/ErrorPage';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
      <BrowserRouter>
          <div>
            <Route exact path={"/login"} component={Login}/>
            <Route exact path={"/"} component={App}/>
            <Route exact path={"/movies/:movieID"} component={MovieDetails}/>
            <Route exact path={"/profile"} component={Profile}/>
            <Route exact path={"/error"} component={ErrorPage}/>
          </div>
      </BrowserRouter>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
