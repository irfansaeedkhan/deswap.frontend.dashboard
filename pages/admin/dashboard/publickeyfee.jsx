import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import SwapMDChart from "@/components/adminDashboardComponents/charts/SwapMDChart";
import PublickeyFeeRequested from "@/components/adminDashboardComponents/publicKeyfee/PublicKeyRequested";
import PublickeyFeeHistory from "@/components/adminDashboardComponents/publicKeyfee/PublicKeyHistory";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";


function PublickeyFee() {
  const [GraphLabels, setGraphLabels] = useState([]);
  const [GraphUsers, setGraphUsers] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [displaySwapTable, setDisplaySwapTable] = useState(true);

  // const fetchDAWPurchasedbyuser = async (month) => {
  //   let currentMonth = new Date().getMonth();
  //   if (month) {
  //     currentMonth = month;
  //   }
  //   const currentYear = new Date().getFullYear();
  //   const startDate = new Date(currentYear, currentMonth, 1);
  //   const lastDay = new Date(currentYear, currentMonth + 1, 0);

  //   //const startDate= sDate.getFullYear()+"-"+sDate.getMonth()+"-"+sDate.getDate();
  //   //const lastDay = lDate.getFullYear()+"-"+lDate.getMonth()+"-"+lDate.getDate();
  //   try {
  //     setLoadingState(true)
  //     let encryptionData = await requestBodyEncryptionAdmin({ startDate: startDate, lastDate: lastDay })
  //     let result = await axios.post(
  //       `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin`,
  //       {data:encryptionData},
  //       { withCredentials: true,
  //         headers:{
  //           'security-set':true
  //         }
  //        }
  //     );
  //     setLoadingState(result && false)
  //     let arr = new Array();
  //     if (result.data.data.length > 0) {
  //       let count = 1;
  //       let amount = parseInt(result.data.data[0].Amount);
  //       let value = result.data.data[0].created_at.split("-")[2].split("T")[0];
  //       if (result.data.data.length == 1) {
  //         arr.push({ x: parseInt(value), y: result.data.data[0].Amount });
  //       }
  //       for (let i = 1; i < result.data.data.length; i++) {
  //         let nextValue = result.data.data[i].created_at
  //           .split("-")[2]
  //           .split("T")[0];
  //         if (value == nextValue) {
  //           count++;
  //           amount = amount + parseFloat(result.data.data[i].Amount);
  //         } else {
  //           arr.push({ x: parseInt(value), y: amount });
  //           amount = 0;
  //           count = 1;
  //           i = i - 1;
  //           value = nextValue;
  //         }
  //         if (result.data.data.length - 1 == i) {
  //           arr.push({ x: parseInt(value), y: amount });
  //         }
  //       }
  //     }
  //     let labelss = new Array();
  //     for (let i = 1; i <= lastDay.getDate(); i++) {
  //       let j;
  //       if (i < 10) {
  //         j = "0" + i;
  //       } else {
  //         j = i;
  //       }
  //       labelss.push(parseInt(j));
  //     }
  //     setGraphUsers(arr);
  //     setGraphLabels(labelss);
  //   } catch (e) {
  //     setLoadingState(false)
  //     console.log("Fail to fetch coin pack fee ");
  //   }
  // };

  // useEffect(async () => {
  //   fetchDAWPurchasedbyuser();
  // }, []);

  // console.log("GraphUsers",GraphUsers)
  return (
    <div className="SwapMDContainer">
      <div className="SwapMDInner">
        <div className="title">
          <h1>Company Rewards</h1>
        </div>
        <div className="SwapMDMain">
          <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
            <div className="graphContainer ">
              {/* <SwapMDChart
                GraphUsers={GraphUsers}
                GraphLabels={GraphLabels}
                fetchDAWPurchasedbyuser={fetchDAWPurchasedbyuser}
              /> */}
            </div>
          </div>
          <div className="tabsContainer">
            <ul className="mb-3 nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setDisplaySwapTable(true);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displaySwapTable && "active"}`}
                >
                  Requested
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplaySwapTable(false);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${!displaySwapTable && "active"}`}
                >
                  History
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {displaySwapTable ? (
                <PublickeyFeeRequested />
              ) : (
                <PublickeyFeeHistory />
              )}
            </div>
          </div>
        </div>
      </div>
      {loadingState && <Loader />}
    </div>
  );
}

export default PublickeyFee;
PublickeyFee.PageLayout = AdminDashboardLayout;
