import React from "react";

import Interests from './Interests';
import Stocks from './Stocks';
import Bracket from './Bracket';
import Privacy from './Privacy';

function Dashboard(props) {
  const USERNAME = JSON.parse(localStorage.getItem("user")).username;

  return (
    <div className="column is-10">
      <section className="hero is-info welcome is-small block">
        <div className="hero-body">
          <div className="container is-pulled-left">
            <h1 className="title has-text-left" >Hello, {USERNAME}</h1>
            <h2 className="subtitle">I hope you are having a great day!</h2>
          </div>
        </div>
      </section>
      <section className="info-tiles">
        <div className="tile is-ancestor has-text-left">
          <Privacy />
          <Bracket />
        </div>
      </section>
      <div className="columns is-multiline">
        <Interests />
        <Stocks />
      </div>
    </div>
  );
}

export default Dashboard;

