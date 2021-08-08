import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

const INTERESTS_QUERY = gql`
  query interestsQuery($userID: ID!) {
    user(id: $userID){
      interests
    }
  }
`;

const ADD_INTEREST = gql`
  mutation addInterest($userID: ID!, $interestsToAdd: [String!]!) {
    addInterests(id: $userID, newInterests: $interestsToAdd) {
      interests
    }
  }
`;

const DELETE_INTEREST = gql`
  mutation deleteInterest($userID: ID!, $interestsToRem: [String!]!) {
    removeInterests(id: $userID, oldInterests: $interestsToRem) {
      interests
    }
  }
`;

function Interests(params) {
  const [search, setSearch] = useState("");

  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [addInterest, { data: addResult, error: addMutationError }] = useMutation(ADD_INTEREST);
  const [deleteInterest, { data: deleteResult, error: delMutationError }] = useMutation(DELETE_INTEREST);

  let { loading, error, data } = useQuery(INTERESTS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });

  function deleteClick(e) {
    deleteInterest({ variables: { userID: USERID, interestsToRem: [e.currentTarget.previousElementSibling.innerHTML] } }).catch(err =>console.error(err));
  }

  function addClick(e) {
    e.preventDefault();
    addInterest({ variables: { userID: USERID, interestsToAdd: [search] } }).catch(err =>console.error(err));
    setSearch("");
  }

  function generateMarkup(list) {
    let count = 0;
    return (list.map(int => {
      return (
        <div key={count += 1} className="control">
          <div className="tags has-addons">
            <span className="tag is-link">{int}</span>
            <a onClick={deleteClick} className="tag is-delete"></a>
          </div>
        </div>
      );
    })
    )
  }

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error)
    return <p>Error :(</p>;
  }

  return (
    <div className="column is-6">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Interests</p>
          <a className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </a>
        </header>
        <div className="card-content">
          <div className="content">
            <form onSubmit={addClick}>
              <div className="field has-addons">
                <div className="control is-expanded has-icons-left has-icons-right block">
                  <input className="input is-small" type="text" placeholder="Add an Category to Your Interests" onChange={e => { setSearch(e.target.value) }} value={search} />
                  <span className="icon is-medium is-left">
                    <i className="fa fa-search" />
                  </span>
                  <span className="icon is-medium is-right">
                    <i className="fa fa-check" />
                  </span>
                </div>
                <div className="control">
                  <button className="button is-small is-info">Add</button>
                </div>
              </div>
            </form>

            <div className="field is-grouped is-grouped-multiline">
              {addResult ? generateMarkup(addResult.addInterests.interests) : 
              (deleteResult ? generateMarkup(deleteResult.removeInterests.interests) : generateMarkup(data.user.interests))}
            </div>
              {addMutationError && <p>Forbidden - Cannot add interest</p>}
              {delMutationError && <p>Forbidden - Cannot remove interest</p>}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Interests;