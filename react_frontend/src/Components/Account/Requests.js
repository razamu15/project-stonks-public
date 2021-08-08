import React, { useEffect,useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

  const USER_QUERY = (userID) => gql`
      query {
        user(id: "${userID}"){
          username

          sentReqs {
            _id
            username
          }
          receivedReqs {
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
  const ACCEPT_FRIEND = gql`
    mutation addFriend($receiverID: String!, $senderID: String!, $relationship: String!) {
      changeFriendStatus(receiverID: $receiverID, senderID: $senderID, relationship: $relationship) {
        _id
      }
    }
    `;
function Dashboard(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;

  const { loading, error, data } = useQuery(USER_QUERY(USERID));
  const [removeRequest, { data:resultData, error: removeFriendError }] = useMutation(REMOVE_FRIEND);
  const [acceptFriend, { data: acceptedData, error: acceptFriendError }] = useMutation(ACCEPT_FRIEND);
  const [visSentRequests, setSentRequests] = useState([]);
  const [visRecRequests, setRecRequests] = useState([]);

  useEffect(() => {
    if (data) {
      setSentRequests(data.user.sentReqs);
      setRecRequests(data.user.receivedReqs)
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  function revokeRequest(user){
    setSentRequests(visSentRequests.filter((item) => item._id !== user._id));
    removeRequest({ variables: { senderID: USERID, receiverID: user._id } }).catch(err =>console.error(err));
  }

  function acceptRequest(user){
    setRecRequests(visRecRequests.filter((item) => item._id !== user._id));
    acceptFriend({ variables: { senderID: user._id, receiverID: USERID, relationship:"friends" } }).catch(err =>console.error(err));
  }
  return (
        <div className="column is-10">
          <section className="hero is-info welcome is-small block">
            <div className="hero-body">
              <div className="container is-pulled-left">
                <h1 className="title has-text-left" >Hello, {data.user.username}</h1>
                <h2 className="subtitle">SEE YOUR REQS</h2>
              </div>
            </div>
          </section>
          {removeFriendError && <p>Forbidden - Cannot revoke request</p>}
          {acceptFriendError && <p>Forbidden - Cannot accept request</p>}

          <div className="columns is-multiline">
            <div className="column is-6 block">
              <div className="card events-card">
                <header className="card-header">
                  <p className="card-header-title">Received Friend Requests</p>
                  <a className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fa fa-angle-down" aria-hidden="true" />
                    </span>
                  </a>
                </header>
                <div className="card-table">
                  <div className="content">
                    <table className="table is-fullwidth is-striped">
                      <tbody>
                        {visRecRequests.map((req_user) => {
                          return (
                            <tr>
                              <td width="5%"><i class="fas fa-user-friends" /></td>
                              <td>{req_user.username}</td>
                              <td className="level-right"><button onClick={() => acceptRequest(req_user)} className="button is-small is-success" >Accept</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-6 block">
              <div className="card events-card">
                <header className="card-header">
                  <p className="card-header-title">Sent Friend Requests</p>
                  <a className="card-header-icon" aria-label="more options">
                    <span className="icon">
                      <i className="fa fa-angle-down" aria-hidden="true" />
                    </span>
                  </a>
                </header>
                <div className="card-table">
                  <div className="content">
                    <table className="table is-fullwidth is-striped">
                      <tbody>
                        {visSentRequests.map((req_user) => {
                          return (
                            <tr>
                              <td width="5%"><i class="fas fa-user-friends" /></td>
                              <td>{req_user.username}</td>
                              <td className="level-right"><button className="button is-small is-danger" onClick={() => revokeRequest(req_user)}>Revoke</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default Dashboard;

