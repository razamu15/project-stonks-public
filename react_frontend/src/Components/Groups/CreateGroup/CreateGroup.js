import React, { useState, useEffect } from "react";
import { useMutation, gql } from '@apollo/client';

import AddStocks from './AddStocks';
import AddUsers from './AddUsers';

const GROUP_MUTATION = gql`
  mutation makeGroup($name: String!, $users: [String!]!, $stocks: [String!]!, $admins: [String!]!) {
    createGroup(name: $name, users: $users, admins: $admins, stocks: $stocks){   
      _id
      name
      createdAt
      users {
        username
      }
      subscribedStocks
    }
  }
`;

function CreateChat(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [createGroup, { error, data: resultData }] = useMutation(GROUP_MUTATION);
  const [name, setName] = useState("")
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);

  function addStocks(val) {
    setStocks(old => [...old, val]);
  }

  function addUsers(val) {
    setUsers(old => [...old, val]);
  }

  function removeStocks(val) {
    setStocks(stocks.filter(ticker => ticker !== val));
  }

  function removeUsers(val) {
    setUsers(users.filter(user => user._id !== val._id));
  }

  useEffect(() => {
    if (resultData) {
      props.updateView();
    }
  }, [resultData])

  function save() {
    createGroup({ variables: {
      users: [...users.map(usr => usr._id), USERID],
      admins: [USERID],
      stocks: stocks,
      name: name,
    }});
    // setName("");
    // setUsers([]);
    // setStocks([]);
  }

  return (
    <div className="columns is-multiline is-centered">
      <div className="card column is-10" style={{ padding: '0px', marginTop: '15px' }}>
        <div className="columns" style={{ margin: '0px' }}>
          <div id="room-name" className="column has-text-left has-text-weight-bold is-size-5">
            Create Group
          </div>
          <div className="action-buttons column is-narrow" onClick={save}>
            <div className="compose has-text-centered">
              <a className="button is-info is-block is-bold">
                <span className="compose">Save</span>
              </a>
            </div>
          </div>
          <div className="action-buttons column is-narrow" onClick={props.updateView}>
            <div className="compose has-text-centered">
              <a className="button is-danger is-block is-bold">
                <span className="compose">Cancel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="columns column is-multiline is-centered is-full">
        <div className="column columns is-11" style={{ marginTop: '15px' }}>

          <div className="column is-6" style={{ paddingTop: '0px', paddingLeft: '0px' }}>
            <div className="column is-full" style={{ paddingTop: '0px' }}>
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">Group Name</p>
                  <a className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fa fa-angle-down" aria-hidden="true" />
                    </span>
                  </a>
                </header>
                <div className="card-content">
                  <form onSubmit={e => e.preventDefault()} >
                    <div className="field">
                      <p className="control has-icons-left">
                        <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} />
                        <span className="icon is-small is-left">
                          <i className="fas fa-users" />
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <AddStocks state={stocks} add={addStocks} remove={removeStocks} />
          </div>
          <AddUsers state={users} add={addUsers} remove={removeUsers} />

        </div>
      </div>
    </div>
  );
}


export default CreateChat;

