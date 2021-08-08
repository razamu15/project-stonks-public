import React from "react";
import { Link } from "react-router-dom";
function Landing(props) {

  return (
    <div>
      <header className="App-header">
      <img src={props.logo} className="App-logo" alt="logo" />

      </header>
    </div>
  );
}

export default Landing;
