import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Login from './containers/Login';
import Profile from './containers/Profile';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
    <BrowserRouter>
        <div>
          <Route exact path={"/"} component={App}/>
          <Route exact path={"/login"} component={Login}/>
          <Route exact path={"/profile"} component={Profile}/>
        </div>
    </BrowserRouter>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
