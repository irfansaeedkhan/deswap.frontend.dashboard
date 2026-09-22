import React, { useState,useEffect } from "react";
import Image from "next/image";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
import axios from "@/utils/common/axios"
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"

import { MonthDropdown } from "@/components/global/DropDown";


const ClaimmedGraph = (props) => {

  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [users,setUsers]=useState();
  const [labelss,setLabels]=useState([0])
  const [data,setData]=useState({labels:"",datasets: [{
    label: "Total Value of Claimmed Network Rewards",
    fill: false,
    borderColor: '#0494E8',
    data: "",
  }
]});

  useEffect(() => {
    fetchTotalRewards();
  }, []);

  const fetchTotalRewards=async(month)=> {
    let currentMonth = new Date().getMonth();
    if (month != null) {
        currentMonth = month;
    }

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    try {
        const data1= await SanitizeRequestObject({ startDate: startDate, lastDate: lastDay })
        //requestBodyEncryptionAdmin
        let encryptionData = await requestBodyEncryptionAdmin(data1);
        let result = await axios.post(
            "/api/admin/clammied/networkclaimmedchart",
            { data:encryptionData},
            { withCredentials: true,
                headers: {
                    "security-set": true,
                  }
            }
        );
        let arr = new Array();
        result.data.data.map((data)=>{
            arr.push({ x: parseInt(data._id.split("-")[2]), y: data.totalQty });
        })
        
        let labelss = new Array();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            let j;
            if (i < 10) {
                j =  "0" + i;
            } else {
                j = i;
            }
            labelss.push(parseInt(j));
        }
        setLabels( labelss );
        setData({labels:labelss,datasets: [{
          label: "Total Value of Claimmed Network Rewards",
          fill: false,
          borderColor: '#0494E8',
          data: arr,
        }
      ]});
        setUsers(arr );
    } catch (e) {
        console.log("Fail to fetch users");
    }
  }
  return (
    <>
      <span className="">
        <span className="row">
            <span className="col-9">
                  <p className="CardContainer">Total Value of Claimmed Network Rewards</p>
                  </span>
                  <span className="col-3 text-right">
            <MonthDropdown onSelectIndex={(index)=>{fetchTotalRewards(index)}} />
        </span>
        </span>
        <br/>
        <div
      style={{
        width: '100%',
        height:"100%"
      }}
    >
      <Line
        data={data}
      />
    </div>
  
      </span>
    </>
  );
};

export default ClaimmedGraph;
