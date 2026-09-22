import { useState, useEffect, Fragment } from "react";
import axios from "@/utils/common/axios";
import {requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";

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
import moment from "moment";
import {convertDateToFormatedLocal} from "../../../utils/common/date"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SwapGraph = ({ graphData, duration, setDAWChanged, setDAWPercentageChanged, setdisplayValue}) => {
  
  //setting graph options
  let labels = ["DESWAP","DESWAP"];
  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: new moment().format(),
      },
    },
  };

  let data = {
    labels,
    datasets: [
      {
        label: 'DESWAP',
        data: [0,0],
        borderColor: "#e44757",
      }
    ],
  };
  //#00bf96
  //#e44757
  const [graphText, setgraphText] = useState("Loading...");
  const [displayGraph, setdisplayGraph] = useState(false);
  const [graphTag, setgraphTag] = useState(<Line options={options} data={data}></Line>);
  const [graphTagFalse, setgraphTagFalse] = useState(<div className="swapgraph loading"><p>{graphText}</p></div>);
  
  const creategraph = async (data)=>{
    let arr = await new Array();
    let yaxislabel = await new Array();
    let yaxisvalue = await new Array();
    try{
      let value = {0:null,1:null}
      for(let index in data){
        let quotedData = data[index].Price;
        //let quotedData = data[index].ConversionRate;
        arr.push({ x: await convertDateToFormatedLocal(data[index].created_at), y: quotedData});
        yaxislabel.push(await convertDateToFormatedLocal(data[index].created_at));
        yaxisvalue.push(quotedData);
      }
      value['0'] = arr[arr.length-1].y;
      value['1'] = arr[arr.length-2].y;
      
      let changeDigit = value['0']-value['1'];
      let percentageChange = (changeDigit/value['1'])*100;
      return {graphData: arr, valueChanged:changeDigit.toFixed(6),percentageChange:" "+percentageChange.toFixed(2).toString()+" ",yaxislabel:yaxislabel,yaxisvalue:yaxisvalue};
    }catch(e){
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log(e)
      return arr;
    }
  }

  useEffect(() => {
    void (async () => {
    try{
      let encryptionData = await requestBodyEncryptionUnprotected({
        cmccoinid:process.env.NEXT_PUBLIC_DEW_CMC_ID,
        timeinterval:duration
      })
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/exchange/graphdata`,
        {data:encryptionData},
        { withCredentials: true,
          headers:{
            'security-set':true
          }
         }
      );
      
      if(result?.data?.data){
        let graphData = result.data.data;
        //let quotedData = graphData.quotes;
        let graphCreated = await creategraph(graphData);
        
        //
        if(graphCreated.valueChanged){
          await setDAWChanged(graphCreated.valueChanged)
        }
        if(graphCreated.percentageChange){
          await setDAWPercentageChanged(graphCreated.percentageChange)
        }

        if(graphCreated.graphData){
          labels = graphCreated.yaxislabel;
          data.datasets['0'].data = graphCreated.yaxisvalue;
          data.labels = labels;
          await setgraphTag(<Line options={options} data={data}></Line>)
          await setdisplayGraph(true)
        }
      }
    }catch(e){
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Error message : ",e)
    }
      })();
  },[]);

  //useEffect(async () => {});
  //
  return (
    <span className="w-full bg-bgg rounded-2xl p-2 flex flex-col gap-2">
      <span className="flex justify-end  text-sm ">    
      </span>
      {displayGraph? graphTag:graphTagFalse}
      <ToastContainer
position="top-center"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
/>
    </span>
  );
};

export default SwapGraph;
