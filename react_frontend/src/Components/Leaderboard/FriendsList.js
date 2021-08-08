import React from "react";

function FriendsList(props) {
  return (
    <div className="column is-4 columns is-multiline has-text-left" style={{ margin: '0px 0px 0px 0px', alignItems:'start' }}>
      {props.friends.map(friend => {
        return (
          <article key={friend._id} data-userid={friend._id} className={friend.stocksData.total.performance.changeAmount > 0 ? "post card column is-full has-text-success" : "post card column is-full has-text-danger"} id="friend-list" onClick={props.userClick} >
            <div className="user">
              <div className="username">
                <span className="icon  has-text-black" style={{ marginRight: '15px' }}>
                  <i className="fas fa-2x fa-user"></i>
                </span>
                <h4 className="has-text-weight-bold has-background-white is-size-5">{friend.username}</h4>
              </div>
            </div>
            <div className="list-right">
              <span className="icon" style={{ marginRight: '15px' }}>
                <i className={friend.stocksData.total.performance.changeAmount > 0 ? "fas fa-2x fa-long-arrow-alt-up" : "fas fa-2x fa-long-arrow-alt-down"}></i>
              </span>
              <div className="perf has-text-weight-bold">
                <span className="icon-text level" style={{ marginBottom: '0px' }}>
                  <span className="icon">
                    <i className="fas fa-percent"></i>
                  </span>
                  <span>{friend.stocksData.total.performance.changePercentage.toFixed(2)}</span>
                </span>
                <span className="icon-text level">
                  <span className="icon">
                    <i className="fas fa-dollar-sign"></i>
                  </span>
                  <span>{friend.stocksData.total.performance.changeAmount.toFixed(2)}</span>
                </span>

              </div>
            </div>
          </article>
        )
      })}
    </div>
  );
}

export default FriendsList;