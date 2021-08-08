import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

const NOT_FRIENDS_QUERY = gql`
  query notFriendsQuery($userID: ID!) {
    user(id: $userID){
      notFriends {
        _id
        username
      }
    }
  }
`;
// query says add, but its more like send friend request
const ADD_FRIEND = gql`
  mutation addFriend($receiverID: String!, $senderID: String!) {
    sendFriendRequest(receiverID: $receiverID, senderID: $senderID) {
      notFriends{
        _id
        username
      }
    }
  }
`;

function AddFriends(params) {
  //const [reload, setReload] = useState(false);

  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  const [addFriend, { data: resultData, error: addFriendError }] = useMutation(ADD_FRIEND);//, {onCompleted: () => {
  //   console.log("done here", resultData);
  //   setReload(true);
  // }});
  let { loading, error, data } = useQuery(NOT_FRIENDS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });

  function addClick(e) {
    addFriend({ variables: { receiverID: e.currentTarget.getAttribute('data-userid'), senderID: USERID } }).catch(err =>console.error(err));
  }

  function generateMarkup(list) {
    return (list.map(friend => {
      return (
        <article key={friend._id} className="post">
          <div className="user">
            <div className="username">
              <span className="icon" style={{ marginRight: '15px' }}>
                <i className="fas fa-2x fa-user"></i>
              </span>
              <h4>{friend.username}</h4>
            </div>
            <div className="field level is-grouped">
              <div className="control">
                <a className="button is-rounded is-success" data-userid={friend._id} onClick={addClick}>Add</a>
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
    <div>
      {addFriendError && <p>Forbidden - Cannot add friend</p>}
      { resultData ? generateMarkup(resultData.sendFriendRequest.notFriends) : generateMarkup(data.user.notFriends)}
    </div>
  )
}

export default AddFriends;