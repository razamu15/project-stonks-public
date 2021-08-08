import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

const STOCKS_QUERY = gql`
  query stocksQuery($userID: ID!) {
    user(id: $userID){
      stocks
    }
  }
`;

const ADD_STOCK = gql`
  mutation addStock($userID: ID!, $stocksToAdd: [String!]!) {
    addStocks(id: $userID, newStocks: $stocksToAdd) {
      stocks
    }
  }
`;

const DELETE_STOCK = gql`
  mutation deleteStock($userID: ID!, $stocksToRem: [String!]!) {
    removeStocks(id: $userID, oldStocks: $stocksToRem) {
      stocks
    }
  }
`;

function Stocks(params) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;

  const [addStock, { data: addResult, error: addError, loading: addLoading }] = useMutation(ADD_STOCK);
  const [deleteStock, { data: delResult, error: delError, loading: delLoading }] = useMutation(DELETE_STOCK);
  let { loading, error, data } = useQuery(STOCKS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("view");

  function deleteClick(e) {
    deleteStock({ variables: { userID: USERID, stocksToRem: [e.currentTarget.previousElementSibling.innerHTML] } })
    setAction("delete");
  }

  function addClick(e) {
    e.preventDefault();
    addStock({ variables: { userID: USERID, stocksToAdd: [search] } });
    setAction("add");
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

  if (loading || addLoading || delLoading) {
    return (
      <div className="column is-6">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">Stocks</p>
            <a className="card-header-icon" aria-label="more options">
              <span className="icon">
                <i className="fa fa-angle-down" aria-hidden="true" />
              </span>
            </a>
          </header>
          <div className="card-content">
            <div className="content">
              <progress className="progress is-small is-dark" max="100">15%</progress>
            </div>
          </div>
        </div>
      </div >
    )
  }
  if (error || addError || delError) return <p>Error :(</p>;


  return (
    <div className="column is-6">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Stocks</p>
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
                  <input className="input is-small" type="text" placeholder="Add Stocks to Your Account" onChange={e => { setSearch(e.target.value) }} value={search} />
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

            {action === "view" ?
              <div className="field is-grouped is-grouped-multiline">
                {generateMarkup(data.user.stocks)}
              </div>
            :
              (action === "add" ?
                (addResult.addStocks.stocks.length === 0 ?
                  <>
                    <article className="message is-danger is-small">
                      <div className="message-body">Invalid Stock Symbol</div>
                    </article>
                    <div className="field is-grouped is-grouped-multiline">
                      {generateMarkup(data.user.stocks)}
                    </div>
                  </>
                :
                  <div className="field is-grouped is-grouped-multiline">
                    {generateMarkup(addResult.addStocks.stocks)}
                  </div>
                )
              :
                <div className="field is-grouped is-grouped-multiline">
                  {generateMarkup(delResult.removeStocks.stocks)}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Stocks;