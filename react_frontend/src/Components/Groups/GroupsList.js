import React from "react";
import { useQuery, gql } from '@apollo/client';

import GroupCard from './GroupCard';

const USER_GROUPS = gql`
  query groups($userID: ID!, $time: String!, $dataPoints: Int!) {
    user(id: $userID, time: $time, dataPoints: $dataPoints){
      groups{
        _id
        name
        users {
          username
        }
        subscribedStocks
        stocksData{
          total {
            data {
              closePrice
            }
          }
        }
      }
    }
  }
`;

function GroupsList(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  let { loading, error, data } = useQuery(USER_GROUPS, {
    variables: { userID: USERID, time: '1D', dataPoints: 7 },
    fetchPolicy: "cache-first"
  });


  if (error) {
    console.log(error)
    return <p>Error :(</p>;
  }


  return (
    <div className="column columns is-multiline is-10 is-centered" style={{ marginTop: '0px' }}>

      {loading ?
        <div className="column is-8 card" style={{ marginTop: '13px' }}>
          <progress className="progress is-small is-dark" max="100">15%</progress>
        </div>
      :
        data.user.groups.map(group => {
          return (
            <div key={group._id} className="column is-narrow">
              <GroupCard colour="light" group={group} />
            </div>)
        })
      }

    </div>
  );
}

export default GroupsList;
