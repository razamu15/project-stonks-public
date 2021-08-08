import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

function TagsCard(params) {
  const [search, setSearch] = useState("");

  const USERID = "6048faabe0e75b0b465cb8fc" //JSON.parse(localStorage.getItem("user")).userID;
  const [addTag, { data: addResult }] = useMutation(ADD_MUTATION);
  const [deleteTag, { data: delResult }] = useMutation(DELETE_MUTATION);

  let { loading, error, data } = useQuery(props.TAGS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });

  function deleteClick(e) {
    console.log("deleting interest", e.currentTarget.previousElementSibling.innerHTML);
    //deleteTag({ variables: { receiverID: e.currentTarget.getAttribute('data-userid'), senderID: USERID } })
  }

  function addClick(e) {
    e.preventDefault();
    console.log("adding tag", search);
    setSearch("");
    //addTag({ variables: { receiverID: e.currentTarget.getAttribute('data-userid'), senderID: USERID } })
  }

  function generateMarkup(list) {
    return (list.map(int => {
      return (
        <div class="control">
          <div class="tags has-addons">
            <span className="tag is-link">{int}</span>
            <a onClick={deleteClick} class="tag is-delete"></a>
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
          <p className="card-header-title">{props.cardTitle}</p>
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
                  <input className="input is-small" type="text" placeholder="Add an Category to Your Interests" onChange={ e => {setSearch(e.target.value)}} value={search} />
                  <span className="icon is-medium is-left">
                    <i className="fa fa-search" />
                  </span>
                  <span className="icon is-medium is-right">
                    <i className="fa fa-check" />
                  </span>
                </div>
                <div class="control">
                  <button class="button is-small is-info">Add</button>
                </div>
              </div>
            </form>

            <div class="field is-grouped is-grouped-multiline">
              {resultData ? generateMarkup(props.mutationListPath) : generateMarkup(props.queryListPath)}
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}

export default TagsCard;