import React, { useState } from "react";
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import '../../Styles/Groups.css';

import GroupsList from './GroupsList';
import CreateGroup from './CreateGroup/CreateGroup';
import Messenger from './Messenger/Messenger';

function Groups(props) {
  let { path, url } = useRouteMatch();
  let [showList, setshowList] = useState(true);

  function updateView() {
    setshowList(old => !old)
  }

  return (
    <Switch>
      <Route path={`${path}/:groupID`}>
        <Messenger />
      </Route>
      <Route exact path={path}>
        {showList ?
          <div className="columns is-multiline is-centered">
            <div className="card column is-10 columns is-multiline is-centered" id="mail-app">
              <div className="column is-full">
                <div className="columns">
                  <div id="room-name" className="column is-10 has-text-left has-text-weight-bold is-size-5">
                    Groups
                  </div>
                  <div className="action-buttons column is-2" onClick={updateView}>
                    <div className="compose has-text-centered">
                      <a className="button is-info is-block is-bold">
                        <span className="compose">New Group</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <GroupsList />

          </div> : <CreateGroup updateView={updateView} />}
      </Route>
      
    </Switch>



  );

}


export default Groups;

