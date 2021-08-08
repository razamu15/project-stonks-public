import React from "react";
import { useQuery, gql } from '@apollo/client';
import ComparisionChart from '../Utils/ComparisionChart'

const FRIEND_DATA = gql`
  query friendsData($userID: ID!, $time: String!, $dataPoints: Int!) {
    user(id:$userID, time:$time, dataPoints:$dataPoints){
      _id
      username
      bracket
      stocks
      interests
      stocksData {
        total {
          data {
            closePrice
            startEpochTime
          }
        }
      }
    }
  }
`;

const OWN_DATA = gql`
  query ownData($userID: ID!, $time: String!, $dataPoints: Int!) {
    user(id:$userID, time:$time, dataPoints:$dataPoints){
      username
      stocksData {
        total {
          data {
            closePrice
            startEpochTime
          }
        }
      }
    }
  }
`;

function Profile(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;

  const { loading, error, data } = useQuery(FRIEND_DATA, {
    variables: { userID: props.user, time: '1D', dataPoints: 10 },
    fetchPolicy: "cache-first"
  });
  const { loading: ownLoading, error: ownError, data: ownData } = useQuery(OWN_DATA, {
    variables: { userID: USERID, time: '1D', dataPoints: 10 },
    fetchPolicy: "cache-first"
  });

  if (loading || ownLoading) {
    return (
      <div className="column is-8 card" style={{ marginTop: '13px' }}>
        <progress className="progress is-small is-dark" max="100">15%</progress>
      </div>
    )
  }
  if (error || ownError) {
    console.log(error, ownError)
    return <p>Error :(</p>;
  }

  return (
    <div className="column is-8 card" style={{ marginTop: '13px' }}>
      <section className="hero is-info welcome is-small block">
        <div className="hero-body">
          <div className="container is-pulled-left">
            <h1 className="title has-text-left" >{data.user.username}'s Profile</h1>
          </div>
        </div>
      </section>

      <div className="columns is-centered is-multiline">

        <div className="column is-6">
          <h2 className="subtitle profile-subtitle">Interests</h2>
          <div className="tags">
            {data.user.interests.map((interest) => <span key={interest} className="tag is-rounded is-primary">{interest}</span>)}
          </div>
        </div>

        <div className="column is-6">
          <h2 className="subtitle profile-subtitle">Stocks</h2>
          <div className="tags">
            {data.user.stocks.map((stk) => <span key={stk} className="tag is-rounded is-primary">{stk}</span>)}
          </div>
        </div>

        <div className="column is-10">
          <ComparisionChart
            precision={0.05}
            dataset1={data.user.stocksData.total.data.map(bar => { return { dataPoint: bar.closePrice, label: new Date(bar['startEpochTime'] * 1000).toLocaleDateString() } })}
            dataset2={ownData.user.stocksData.total.data.map(bar => { return { dataPoint: bar.closePrice, label: new Date(bar['startEpochTime'] * 1000).toLocaleDateString() } })}
            display1={data.user.username}
            display2={"You"}
          />
        </div>
        <article className="message is-small">
          <div className="message-body">
            Click on the legend to hide a dataset
          </div>
        </article>

      </div>
    </div>
  );
}

export default Profile;