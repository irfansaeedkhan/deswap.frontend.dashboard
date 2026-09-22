import React from "react";
import { Line } from "react-chartjs-2";
import { MonthDropdown } from "@/components/global/DropDown";

const SwapMDChart = (props) => {
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
      <span className="SwapMDChartContainer">
        <span className="monthsContainer">
          {/* <span className="">Total Rewards</span> */}
          <MonthDropdown
            onSelectIndex={(index) => {
              props.fetchDAWPurchasedbyuser(index);
            }}
          />
        </span>
        <br />
        <div style={{ width: "100%" }}>
          <Line data={data} options={options} />
        </div>
      </span>
    </>
  );
};

export default SwapMDChart;
