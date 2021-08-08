import React, { useState } from "react";
import { useMutation, gql } from '@apollo/client';

const UPDATE_BRACKET = gql`
  mutation testBracket($id: ID!, $newBracket: [Int!]!) {
    setBracket(id: $id, newBracket: $newBracket) {
      _id
    }
  }
`;

function Bracket(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [bracket, setBracket] = useState([]);
  const [changeBracket, { data,error }] = useMutation(UPDATE_BRACKET);

  function updateBracket(){
    let newArr = [];
    bracket.split(",").forEach(element => {
      newArr.push(parseInt(element));
    });

    changeBracket({ variables: { id: USERID, newBracket: newArr } }).catch(err =>console.error(err));
  }

  return (
    <div className="tile is-parent">
      <article className="tile is-child box">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <span className="subtitle">Bracket</span>
            </div>
          </div>
          <div className="level-right">
            <div className="field has-addons">
              <div className="control has-icons-left">
                <div className="select">
                  <select onChange={e => { setBracket(e.target.value) }} name="privacy">
                    <option value="0,100">[0,100]</option>
                    <option value="100,1000">[100,1000]</option>
                    <option value="1000,10000">[1000,10000]</option>
                  </select>
                </div>
                <span className="icon  is-left">
                  <i className="fas fa-user-lock" />
                </span>
              </div>
              <div className="control">
                <button type="submit" className="button is-info" onClick={() => updateBracket()}>Update</button>
              </div>
            </div>
          </div>
        </nav>
        {error && <p>Error :( Forbidden</p>}
      </article>
    </div>
  )
}

export default Bracket;