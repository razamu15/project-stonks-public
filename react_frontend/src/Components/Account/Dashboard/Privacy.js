import React, { useState } from "react";
import { useMutation, gql } from '@apollo/client';


const UPDATE_PRIVACY = gql`
  mutation updatePrivacy($id: ID!, $privacy: String!) {
    setPrivacy(id: $id, privacy: $privacy) {
      _id
    }
  }
`;

function Privacy(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [priv, setPriv] = useState("");
  const [changePrivacy, { data, error }] = useMutation(UPDATE_PRIVACY);

  function updatePrivacy(){
    changePrivacy({ variables: { id: USERID, privacy: priv } }).catch(err =>console.error(err));
  }

  return (
    <div className="tile is-parent">
      <article className="tile is-child box">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <span className="subtitle">Privacy</span>
            </div>
          </div>
          <div className="level-right">
            <div className="field has-addons">
              <div className="control has-icons-left">
                <div className="select">
                  <select onChange={e => { setPriv(e.target.value) }} name="privacy">
                    <option value="friends">Friends Only</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <span className="icon  is-left">
                  <i className="fas fa-user-lock" />
                </span>
              </div>
              <div className="control">
                <button type="submit" className="button is-info" onClick={() => updatePrivacy()}>Update</button>
              </div>
            </div>
          </div>
        </nav>
        {error && <p>Error :( Forbidden</p>}
      </article>
    </div>
  )
}

export default Privacy;