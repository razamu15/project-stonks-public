import React, { useEffect } from "react";
import { Switch, Route, useHistory } from 'react-router-dom';
import { useAuth, PrivateRoute } from './Utils/Auth';

import Landing from './External/Landing';
import Login from './External/Login';
import Register from './External/Register';
import Home from './Home';
import Navbar from './Navbar'

import logo from '../logo.svg';
import '../Styles/App.css'

function App() {
  let auth = useAuth();
  let history = useHistory();

  useEffect(() => {
    auth.checkSession(() => {
      history.push('/home');
    });
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <Navbar />
          <Landing logo={logo} />
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
