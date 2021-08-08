import React from "react";
import { Line } from "react-chartjs-2";


// this needs data and label fields
let CHARTS_DATA_OPTS = {
    fill: 'origin',
    pointRadius: 1,
    pointHitRadius: 10,
    pointBorderWidth: 1,
};

let CHARTS_OPTS = {
    scales: {
        yAxes: [
            {
                ticks: {
                    // display: false,
                    beginAtZero: false
                },
                gridLines: {
                    display: false
                }
            }
        ],
        xAxes: [
            {
                display: true,
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false
                },
            }
        ]
    }
};

function ComparisionChart(props) {
    const dataCallback = (canvas) => {
        // Gradient color - this week
        let gradientThisWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
        gradientThisWeek.addColorStop(0, '#5555FF');
        gradientThisWeek.addColorStop(1, '#9787FF');
      
        // Gradient color - previous week
        let gradientPrevWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
        gradientPrevWeek.addColorStop(0, '#FF55B8');
        gradientPrevWeek.addColorStop(1, '#FF8787');
      
        return {
            labels: props.dataset1.map(elem => elem.label),
            datasets: [
                {
                    ...CHARTS_DATA_OPTS,
                    label: props.display1,
                    data: props.dataset1.map(elem => elem.dataPoint),
                    backgroundColor: gradientThisWeek,
                    borderColor: gradientThisWeek,
                    lineTension: props.precision,
                },
                {
                    ...CHARTS_DATA_OPTS,
                    label: props.display2,
                    data: props.dataset2.map(elem => elem.dataPoint),
                    backgroundColor: gradientPrevWeek,
                    borderColor: gradientPrevWeek,
                    lineTension: props.precision,
                }
            ]
        }
      }
    
    return (
        <Line
            data={dataCallback}
            options={CHARTS_OPTS}
            getElementsAtEvent={props.getElementsAtEvent}
            getDatasetAtEvent={props.getDatasetAtEvent} />
    )
}

export default ComparisionChart;