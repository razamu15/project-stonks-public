import React from "react";
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard';
import Friends from './Friends';
import Requests from './Requests';
import '../../Styles/Account.css'

function Account(props) {
  let { path, url } = useRouteMatch();

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-2 has-text-left">
          <aside className="menu is-hidden-mobile">
            <p className="menu-label">General</p>
            <ul className="menu-list">
              <li><a className="is-active"><Link to={`${url}`}>Dashboard</Link></a></li>
            </ul>
            <p className="menu-label">Social</p>
            <ul className="menu-list">
              <li><a><Link to={`${url}/friends`}>Friends</Link></a></li>
              <li><a><Link to={`${url}/requests`}>Friend Requests</Link></a></li>
              <li><a>Groups</a></li>
            </ul>
          </aside>
        </div>
        <Switch>
          <Route exact path={path}>
            <Dashboard />
          </Route>
          <Route path={`${path}/friends`}>
            <Friends />
          </Route>
          <Route path={`${path}/requests`}>
            <Requests />
          </Route>
        </Switch>
      </div>
    </div>

  );
}

export default Account;

