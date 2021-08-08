import React from "react";
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import '../../../Styles/Messenger.css'

import { ProvideMessageContext } from '../../Utils/MessageContext';
import GroupChat from './GroupChat';
import GroupPortfolio from './GroupPortfolio';

const GROUP_DATA = gql`
  query groupData($groupID: ID!, $time: String!, $dataPoints: Int!) {
    group(id:$groupID, time:$time, dataPoints:$dataPoints){
      _id
      name
      subscribedStocks
      stocksData { 
				total {
					data {
            startEpochTime
						closePrice
					}
				}
				stocks {
					ticker
					data {
						startEpochTime
						closePrice
					}
				}
      }
      messages {
        _id
        content
        createdAt
        user {
          username
        }
        context {
          startEpochTime
          endEpochTime
          bar
          stock
        }
      }
    }
  }
`;

function Messenger(props) {
  let { groupID } = useParams();
  const { loading, error, data } = useQuery(GROUP_DATA, {
    variables: { groupID: groupID, time: '15Min', dataPoints: 96 },
    fetchPolicy: "network-only"
  });

  if (loading) {
    return (
      <div className="container is-fluid">
      <div className="columns is-centered is-multiline card" style={{ margin: '25px 0px 0px 0px', backgroundColor: 'white' }}>
        <div className="column is-6 is-offset-3 columns" style={{ margin: '0px', padding: '20px', borderBottom: '1px solid rgb(121 119 119)' }}>
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
    <div className="container is-fluid">
      <div className="columns is-centered is-multiline card" style={{ margin: '25px 0px 0px 0px', backgroundColor: 'white' }}>
        <div className="column is-full columns" style={{ margin: '0px', padding: '0px', borderBottom: '1px solid rgb(121 119 119)' }}>
          <div id="room-name" className="column is-4 has-text-left has-text-weight-bold is-vcentered">
            {data.group.name}
          </div>
          <div className="column is-2 is-offset-6 ">
            <div className="control is-grouped is-align-items-end">
              <a className="button is-small"><i className="fa fa-users-cog" /></a>
              <a className="button is-small"><i className="fa fa-cogs" /></a>
            </div>
          </div>
        </div>

        <ProvideMessageContext defaultContext={{
          mode: "no-context",
          stock: 'total',
          start: "",
          end: "",
          bar: 'closePrice'
        }}>
          <GroupChat groupID={groupID} messages={data.group.messages} />
          <GroupPortfolio groupID={groupID} groupData={data.group} />
        </ProvideMessageContext>

      </div>
    </div>
  );

}


export default Messenger;

