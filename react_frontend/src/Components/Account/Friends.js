import React, { useState } from "react";

import AddFriends from './AddFriends';
import CurrentFriends from './CurrentFriends';


function Friends(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [search, setSearch] = useState("");

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function handleReset(e) {
    setSearch("");
  }

  function handleSearch(e) {
    e.preventDefault();
  }


  return (
    <div className="column is-10">
      <section className="hero is-info welcome is-small block">
        <div className="hero-body">
          <div className="container is-pulled-left">
            <h1 className="title has-text-left" >Hello</h1>
            <h2 className="subtitle">EDIT YOUR FRIENDS</h2>
          </div>
        </div>
      </section>
      <div className="columns is-multiline is-centered">
        <div className="column is-10">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title ind-header">Friends</p>
              <a className="card-header-icon" aria-label="more options">
                <span className="icon">
                  <i className="fa fa-angle-down" aria-hidden="true" />
                </span>
              </a>
            </header>

            <div className="card-content has-text-left">
              <div className="content">
                <form onSubmit={handleSearch}>
                  <div className="field has-addons">
                    <div className="control is-expanded has-icons-left has-icons-right block">
                      <input className="input is-medium is-rounded" type="text" placeholder="Search For A User" onChange={handleSearchChange} value={search} />
                      <span className="icon is-medium is-left">
                        <i className="fa fa-search" />
                      </span>
                      <span className="icon is-medium is-right">
                        <i className="fa fa-check" />
                      </span>
                    </div>
                    <div className="control">
                      <button className="button is-rounded is-medium is-info" onClick={handleReset}>Reset</button>
                    </div>
                  </div>
                </form>

                {search === "" ? <CurrentFriends /> : <AddFriends />}

              </div>

            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Friends;

