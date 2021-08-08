import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

const USERS_QUERY = gql`
  query notFriendsQuery($userID: ID!) {
    user(id: $userID){
      friends {
        _id
        username
      }
    }
  }
`;

function AddUsers(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;

  let { loading, error, data } = useQuery(USERS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });

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

  function addClick(e) {
    props.add({ _id: e.currentTarget.getAttribute('data-userid'), username: e.currentTarget.getAttribute('data-username') });
  }

  function removeClick(e) {
    props.remove({ _id: e.currentTarget.getAttribute('data-userid') });
  }

  function generateMarkup(action, list) {
    return (list.map(friend => {
      return (
        <article key={friend._id} className="post">
          <div className="user">
            <div className="username">
              <span className="icon" style={{ marginRight: '15px' }}>
                <i className="fas is-medium fa-user"></i>
              </span>
              <h4>{friend.username}</h4>
            </div>
            <div className="field level is-grouped">
              <div className="control">
                {action === "add" ?
                  <a className="button is-small is-rounded is-success" data-userid={friend._id} data-username={friend.username} onClick={addClick}>Add</a> :
                  <a className="button is-small is-rounded is-danger" data-userid={friend._id} data-username={friend.username} onClick={removeClick}>Remove</a>
                }
              </div>
            </div>
          </div>
        </article>
      )
    })
    )
  }

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error)
    return <p>Error :(</p>;
  }

  return (
    <div className="card has-text-left column is-6" id="group_user_add">
      <header className="card-header">
        <p className="card-header-title">Add Users</p>
        <a className="card-header-icon" aria-label="more options">
          <span className="icon">
            <i className="fa fa-angle-down" aria-hidden="true" />
          </span>
        </a>
      </header>
      <div className="card-content">
        <form onSubmit={handleSearch}>
          <div className="field has-addons">
            <div className="control is-expanded has-icons-left has-icons-right block">
              <input className="input is-small is-rounded" type="text" placeholder="Search For A User" onChange={handleSearchChange} value={search} />
              <span className="icon is-medium is-left">
                <i className="fa fa-search" />
              </span>
              <span className="icon is-medium is-right">
                <i className="fa fa-check" />
              </span>
            </div>
            <div className="control">
              <button className="button is-rounded is-small is-info" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>

        {search === "" ? generateMarkup("remove", props.state) : 
        generateMarkup("add", data.user.friends.filter(user => !props.state.map(el => el._id).includes(user._id)))}
      </div>
    </div>





  )
}

export default AddUsers;