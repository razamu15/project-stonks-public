import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Line } from "react-chartjs-2";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

const config = {
  options: {
    elements: {
      point: {
        radius: 0,
        hitRadius: 5,
        hoverRadius: 5
      }
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: false,
        },
      }]
    }
  }
};

function GroupCard({group, colour}) {
  let { url } = useRouteMatch();
  let data = group.stocksData.total.data.map(bar => bar.closePrice);
  let dayIndexes = lastWeek();
  let counter = -1;

  const chartData = (canvas) => {
    // Gradient color - this week
    let gradientThisWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientThisWeek.addColorStop(0, '#5555FF');
    gradientThisWeek.addColorStop(1, '#9787FF');
  
    // Gradient color - previous week
    let gradientPrevWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientPrevWeek.addColorStop(0, '#FF55B8');
    gradientPrevWeek.addColorStop(1, '#FF8787');
  
    return {
      labels: DAYS,
      datasets: [
        {
          label: 'This week',
          data: data,
          backgroundColor: colour === "dark" ? gradientThisWeek : gradientPrevWeek ,
          borderColor: 'transparent',
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#FFFFFF',
          lineTension: 0.40,
        }
      ]
    }
  }

  function lastWeek(){
    let curDate = new Date();
    let prevDate = new Date();
    let result = [];
    for (let i = 0; i < 7; i++) {
      prevDate.setDate(curDate.getDate()-1);
      result.push(prevDate.getDay());
      curDate.setDate(prevDate.getDate());
    }
    result.reverse();
    return result;
  }

  return (
    <div key={group._id} data-groupid={group._id} className="card">
      <Link to={`${url}/${group._id}`}>
        <div className="card-content has-text-left">

          <div className="msg-subject">
            <span className="msg-subject"><strong id="fake-subject-1">{group.name}</strong></span>
          </div>
          <div className="msg-snippet">
            <p id="fake-snippet-1">{group.users.map(user => {
              return `${user.username}`
            }).slice(0,2).join(", ")} and { Math.max(group.users.length-2,0) } more </p>
          </div>

          <div className="info">
            <span className={colour === "dark" ? "legend legend--this" : "legend legend--prev"}></span><p className="annotations">Weekly Performance</p>
          </div>
          <div className="annotations" style={{color: 'black'}}>
            { group.subscribedStocks.slice(0,3).join(', ') } and { Math.max(group.subscribedStocks.length-3,0) } more
          </div>

        </div>
      </Link>
      <Line
        data={chartData}
        options={config.options} />

      <div className="axis">
        {group.stocksData.total.data.map(bar => {
          counter += 1;
          return (
            <div key={counter} className="tick">
              <span style={{color: 'black'}}>{DAYS[ dayIndexes[counter] ] }</span>
              <span className="value value--this">{bar.closePrice.toFixed(2)}</span>
            </div>
          )
        })}
      </div>

    </div>

  )

}

export default GroupCard;