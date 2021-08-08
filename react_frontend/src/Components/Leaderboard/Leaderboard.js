import React, { useState } from "react";
import { useQuery, gql } from '@apollo/client';

import '../../Styles/Leaderboard.css'
import FriendsList from './FriendsList';
import Profile from './Profile';

const FRIENDS_DATA = gql`
  query friendsData($userID: ID!, $time: String!, $dataPoints: Int!) {
    user(id:$userID, time:$time, dataPoints:$dataPoints){
      friends {
        _id
        username
        stocksData {
          total {
            performance {
              changeAmount
              changePercentage
              endPrice
            }
          }
        }
      }
    }
  }
`;

function Leaderboard(props) {
  const USER = JSON.parse(localStorage.getItem("user"));
  const [userView, setUserView] = useState('');

  function updateUserView(e) {
    let newUser = e.currentTarget.getAttribute('data-userid');
    setUserView(newUser);
  }

  const { loading, error, data } = useQuery(FRIENDS_DATA, {
    variables: { userID: USER.userID, time: '1D', dataPoints: 10 },
    fetchPolicy: "cache-first"
  });


  if (loading) {
    return (
      <div className="container">
        <div className="columns is-centered" style={{ margin: '0px' }}>
          <div className="column is-8 card" style={{ marginTop: '13px' }}>
            <progress className="progress is-small is-dark" max="100">15%</progress>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    console.log(error)
    return <p>Error :(</p>;
  }

  return (
    <div className="container">
      <div className="columns is-centered" style={{ margin: '0px' }}>
        <FriendsList friends={data.user.friends} userClick={updateUserView} />

        {userView !== '' ? <Profile user={userView} /> :
          <div className="column is-8 card" style={{ marginTop: '13px' }}>
            Choose a Friend to view their profile
        </div>
        }
      </div>
    </div>

  );
}

export default Leaderboard;