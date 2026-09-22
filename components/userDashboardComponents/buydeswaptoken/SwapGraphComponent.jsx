import React, { useState, useEffect } from "react";
import Image from "next/image";
import SwapGraph from "./SwapGraph";
import { Tabs, Tab } from "react-bootstrap";
import { convertToEuro } from "../../../utils/common/currencyconversion";
import axios from "../../../utils/common/axios";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

const state = {
  users: null,
  packs: null,
  colors: ["#00bf96", "red", "blue", "green", "#eeeeee", "eefffff"],
  labels: [0],
  labelss: [0],
  registerFee: [],
  apiResponse: {},
};

function SwapGraphComponent() {
  const [key, setKey] = useState("1");
  const [dawPrice, setDAWPrice] = useState("0,00");
  const [dawChanged, setDAWChanged] = useState("0,00");
  const [dawPercentageChanged, setDAWPercentageChanged] = useState("0,00");
  const [currentDate, setcurrentDate] = useState("0,00");
  const [displayValue, setdisplayValue] = useState(false);
  //
  const fetchMaticToDAW = async (data) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionUnprotected(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/swap/exchange`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanString = await SanitizeRequestString(result.data.data.data);
      return sanString;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      return 0;
    }
  };

  useEffect(() => {
    void (async () => {
    try {
      let MaticToDAW = await fetchMaticToDAW({
        amount: 1,
        converstion: "matic_to_deswap",
      });
      await setDAWPrice(convertToEuro(MaticToDAW));
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Error message : ", e);
    }
      })();
  }, []);

  return (
    <div className="swapgraphContainer bg-bgg">
      <div className="head">
        <div className="lefthead">
          <div className="coinswap">
            <div className="coin1">
              <Image
                width="24"
                height="24"
                src="/maticcoin.png"
                loading="lazy"
              />
            </div>
            <div className="coin2">
              <Image
                width="24"
                height="24"
                src="/logoicon.png"
                loading="lazy"
              />
            </div>
            <div className="coinTxt">Matic/Deswap</div>
          </div>
        </div>
        <div className="rightHead"></div>
      </div>
      <div className="headDetails">
        <div className="leftheadDetails">
          <div className="left">
            <h1 className="coinrate">{dawPrice}</h1>
            <h2 className="coinname">Matic/Deswap</h2>
          </div>
          <div className="right">
            <h2 className="coinprofitloss">
              {dawChanged} ({dawPercentageChanged})
            </h2>
          </div>
        </div>
        <div className="rightheadDetails">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="1" title="5m">
              <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
                <div className="graphContainer  ">
                  <SwapGraph
                    graphData={state.registerFee}
                    duration="5m"
                    setDAWChanged={setDAWChanged}
                    setDAWPercentageChanged={setDAWPercentageChanged}
                    setdisplayValue={setdisplayValue}
                  />
                </div>
              </div>
            </Tab>
            {/*
            <Tab eventKey="2" title="1W">
              <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
                <div className="graphContainer">
                  <SwapGraph
                    graphData={state.registerFee}
                    duration="7d"
                    setNTRChanged={setNTRChanged}
                    setNTRPercentageChanged={setNTRPercentageChanged}
                    setdisplayValue={setdisplayValue}
                  />
                </div>
              </div>
            </Tab>
            <Tab eventKey="3" title="1M">
              <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
                <div className="graphContainer">
                  <SwapGraph
                    graphData={state.registerFee}
                    duration="monthly"
                    setNTRChanged={setNTRChanged}
                    setNTRPercentageChanged={setNTRPercentageChanged}
                    setdisplayValue={setdisplayValue}
                  />
                </div>
              </div>
            </Tab>
            <Tab eventKey="4" title="1Y">
              <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
                <div className="graphContainer">
                  <SwapGraph
                    graphData={state.registerFee}
                    duration="yearly"
                    setNTRChanged={setNTRChanged}
                    setNTRPercentageChanged={setNTRPercentageChanged}
                    setdisplayValue={setdisplayValue}
                  />
                </div>
              </div>
            </Tab>*/}
          </Tabs>
          {/* <div className="timeBtnRow">
            <button className="active" onClick={() => setKey("1")}>
              24H
            </button>
            <button onClick={() => setKey("2")}>1W</button>
            <button onClick={() => setKey("3")}>1M</button>
            <button onClick={() => setKey("4")}>1Y</button>
          </div> */}
        </div>
      </div>

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
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default SwapGraphComponent;
