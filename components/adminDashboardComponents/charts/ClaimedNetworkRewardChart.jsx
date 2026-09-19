import React from "react";
import { Line } from "react-chartjs-2";

const ClaimedNetworkRewardChart = (props) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels: props.GraphLabels,
    datasets: [
      {
        label: "Claimed Network Rewards Chart",
        fill: false,
        borderColor: "#e44757",
        data: props.GraphUsers,
      },
    ],
  };
  const options = {
    responsive: true,
  };

  return (
    <>
      <span className="ClaimedNetworkRewardChartContainer">
        <span className="monthsContainer">
          {/* <span className="">Total Rewards</span> */}
          <select
            className="months"
            defaultValue={months[new Date().getMonth()]}
            onChange={(e) => {
              props.fetchRewardsDetails(e.target.selectedIndex);
            }}
          >
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
            <option>Jul</option>
            <option>Aug</option>
            <option>Sep</option>
            <option>Oct</option>
            <option>Nov</option>
            <option>Dec</option>
          </select>
        </span>
        <br />
        <div style={{ width: "100%" }}>
          <Line data={data} options={options} />
        </div>
      </span>
    </>
  );
};

export default ClaimedNetworkRewardChart;
