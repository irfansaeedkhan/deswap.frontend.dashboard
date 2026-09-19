import { useState, useEffect, Fragment } from "react";
import axios from "axios";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"
import {convertDateToFormatedLocal} from "../../../utils/common/date"

const TotalCoinpackFeeGraph = ({ graphData, duration, setNTRChanged, setNTRPercentageChanged, setdisplayValue}) => {
  
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
        borderColor: "#00bf96",
      }
    ],
  };
  const [graphText, setgraphText] = useState("Loading...");
  const [displayGraph, setdisplayGraph] = useState(false);
  const [graphTag, setgraphTag] = useState(<Line options={options} data={data}></Line>);
  const [graphTagFalse, setgraphTagFalse] = useState(<div className="stackingpackfeegraph loading"><p>{graphText}</p></div>);
  
  const creategraph = async (data)=>{
    let arr = await new Array();
    let yaxislabel = await new Array();
    let yaxisvalue = await new Array();
    try{
      let value = {0:null,1:null}
      for(let index in data){
        let quotedData = data[index].ConversionRate;
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
      return arr;
    }
  }

  useEffect(async () => {
    try{
      const sanData=await SanitizeRequestString(duration)
      let encryptionData = await requestBodyEncryptionUnprotected({
        cmccoinid:process.env.NEXT_PUBLIC_NTR_CMC_ID,
        timeinterval:sanData
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

      const SanObj=await SanitizeRequestObject(result.data.data)
      if(SanObj){
        let graphData = SanObj;
        //let quotedData = graphData.quotes;
        let graphCreated = await creategraph(graphData);
        
        //
        if(graphCreated.valueChanged){
          await setNTRChanged(graphCreated.valueChanged)
        }
        if(graphCreated.percentageChange){
          await setNTRPercentageChanged(graphCreated.percentageChange)
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

export default TotalCoinpackFeeGraph;
