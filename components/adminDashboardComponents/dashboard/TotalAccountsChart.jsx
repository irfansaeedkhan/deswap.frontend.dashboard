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


const TotalAccountsChart = (props) => {

  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [users,setUsers]=useState();
  const [labelss,setLabels]=useState([0])
  const [data,setData]=useState({labels:"",datasets: [{
    label: "Total Accounts",
    fill: false,
    borderColor: '#0494E8',
    data: "",
  }
]});

  useEffect(() => {
    fetchTotalAccounts();
  }, []);

  const fetchTotalAccounts=async(month)=> {
    let currentMonth = new Date().getMonth();
    if (month != null) {
        currentMonth = month;
    }

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    try {
        const data=await SanitizeRequestObject({ startDate: startDate, lastDate: lastDay })
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(data);
        let result = await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/totalAccount`,
            { data:encryptionData },
            { withCredentials: true ,
                headers: {
                    "security-set": true,
                  }}
        );
        let arr = new Array();
        result.data.data.map((data)=>{
            arr.push({ x: parseInt(data._id.split("-")[2]), y: data.count });
        })
        // if (result.data.data.length > 0) {
        //     let count = 0;
        //     let totalAmount = parseInt(result.data.data[0].totalAmount);
        //     let value = result.data.data[0].createdAt.split("-")[2].split("T")[0];
        //     if (result.data.data.length == 1) {
        //         arr.push({ x: parseInt(value), y: 1 });
        //     }
        //     console.log("result.data.data.length",result.data.data.length)
        //     for (let i = 0; i < result.data.data.length-1; i++) {
        //         console.log("i",i)
        //         let nextValue = result.data.data[i].createdAt
        //             .split("-")[2]
        //             .split("T")[0];
        //         if (value == nextValue) {
        //             count++;
        //             totalAmount = count;
        //             console.log("hello")
        //         } else {
        //             console.log("hi")
        //             arr.push({ x: parseInt(value), y: totalAmount });
        //             totalAmount = 0;
        //             count = 1;
        //             i = i - 1;
        //             value = nextValue;
        //         }
        //         if (result.data.data.length - 1 == i) {
        //             arr.push({ x: parseInt(value), y: totalAmount });
        //         }
        //     }
        // }
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
          label: "Total Account",
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
                  <p className="CardContainer">Total Account</p>
                  </span>
                  <span className="col-3 text-right">
            <MonthDropdown onSelectIndex={(index)=>{fetchTotalAccounts(index)}} />
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

export default TotalAccountsChart;
