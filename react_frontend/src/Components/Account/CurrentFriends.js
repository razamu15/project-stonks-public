import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
  
const CHANGE_FRIEND_STATUS = gql`
    mutation addFriend($receiverID: String!, $senderID: String!, $relationship: String!) {
      changeFriendStatus(receiverID: $receiverID, senderID: $senderID, relationship: $relationship) {
        _id
      }
    }
    `;
const FRIENDS_QUERY = (userID) => gql`
      query {
        user(id: "${userID}"){
          friends {
            _id
            username
          }
        }
      }
    `;

const REMOVE_FRIEND = gql`
    mutation removeFriend($receiverID: String!, $senderID: String!) {
      removeFriendRequest(receiverID: $receiverID, senderID: $senderID) {
        _id
        sentReqs{
          _id
          username
        }
        receivedReqs{
          _id
          username
        }
      }
    }
    `;


function CurrentFriends(params) {
    const USERID = JSON.parse(localStorage.getItem("user")).userID;
    const [changeStatus, { data:resultData }] = useMutation(CHANGE_FRIEND_STATUS);
    const [deletedFriend, { data:removedData }] = useMutation(REMOVE_FRIEND);

    const { loading, error, data } = useQuery(FRIENDS_QUERY(USERID));
    const [visFriends, setFriends] = useState([]);

    useEffect(() => {
      if (data) {
        setFriends(data.user.friends)
      }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    function blockFriend(friendID){
      setFriends(visFriends.filter((item) => item._id !== friendID));
      changeStatus({ variables: { senderID: USERID, receiverID: friendID, relationship:"blocked" } })
      changeStatus({ variables: { senderID: friendID, receiverID: USERID, relationship:"blocked" } })
    }

    function deleteFriend(friendID){
      setFriends(visFriends.filter((item) => item._id !== friendID));
      deletedFriend({ variables: { senderID: USERID, receiverID: friendID} })
      deletedFriend({ variables: { senderID: friendID, receiverID: USERID} })
    }
    return (
      <div>
        {visFriends.map(friend => {
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
                    <a className="button is-rounded is-warning" onClick={() => blockFriend(friend._id)}>Block</a>
                  </div>
                  <div className="control">
                    <button className="button is-rounded is-danger" onClick={() => deleteFriend(friend._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    )
  }

export default CurrentFriends;