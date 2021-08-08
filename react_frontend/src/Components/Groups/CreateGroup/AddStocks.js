import React, { useState } from "react";

function AddStocks(props) {
    const [search, setSearch] = useState("");

  function deleteClick(e) {
    props.remove(e.currentTarget.previousElementSibling.innerHTML);
	// props.addUser({})
  }

  function addClick(e) {
    e.preventDefault();
    props.add(search);
    setSearch("");
  }

  function generateMarkup(list) {
    let count = 0;
    return (list.map(int => {
      return (
        <div key={count+=1} className="control">
          <div className="tags has-addons">
            <span className="tag is-link">{int}</span>
            <a onClick={deleteClick} className="tag is-delete"></a>
          </div>
        </div>
      );
    })
    )
  }
  

  return (
    <div className="column is-full">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Add Stocks</p>
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
                  <input className="input is-small" type="text" placeholder="Add Stocks to track in this group" onChange={ e => {setSearch(e.target.value)}} value={search} />
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
              {generateMarkup(props.state)}
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}

export default AddStocks;