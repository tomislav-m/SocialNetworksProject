import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import Login from './containers/Login';
import Profile from './containers/Profile';
import MovieDetails from './containers/MovieDetails';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import appState from './states/AppState';

ReactDOM.render((
  <Provider appState = {appState}>
      <BrowserRouter>
          <div>
            <Route exact path={"/"} component={Login}/>
            <Route exact path={"/movies"} component={App}/>
            <Route exact path={"/movies/:movieID"} component={MovieDetails}/>
            <Route exact path={"/profile"} component={Profile}/>
          </div>
      </BrowserRouter>
  </Provider>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
