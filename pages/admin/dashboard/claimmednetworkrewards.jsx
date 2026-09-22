import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import ClaimedNetworkRewardChart from "@/components/adminDashboardComponents/charts/ClaimedNetworkRewardChart";
import ClaimmedNRTable from "@/components/adminDashboardComponents/claimmednetworkrewards/ClaimmedNRTable";
import RequestedNRTable from "@/components/adminDashboardComponents/claimmednetworkrewards/RequestedNRTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "../../../utils/common/sanitize";
import ClaimmedGraph from "@/components/adminDashboardComponents/claimmednetworkrewards/ClaimmedGraph";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";



function ClaimmedNetworkRewards() {
  const [GraphLabels, setGraphLabels] = useState([]);
  const [GraphUsers, setGraphUsers] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [displayNRTable, setDisplayNRTable] = useState(true);

  const fetchRewardsDetails = async (month) => {
    let currentMonth = new Date().getMonth();
    if (month) {
      currentMonth = month;
    }
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    //const startDate= sDate.getFullYear()+"-"+sDate.getMonth()+"-"+sDate.getDate();
    //const lastDay = lDate.getFullYear()+"-"+lDate.getMonth()+"-"+lDate.getDate();
    try {
      setLoadingState(true);
      let encryptionData = await requestBodyEncryptionAdmin({
        startDate: startDate,
        lastDate: lastDay,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/clammied/networkclaimmed`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      await SanitizeRequestObject(result.data.data);
      let arr = new Array();
      setLoadingState(result && false);
      if (result.data.data.length > 0) {
        let count = 1;
        let amount = parseInt(result.data.data[0].Amount);
        let value = result.data.data[0].created_at.split("-")[2].split("T")[0];
        if (result.data.data.length == 1) {
          arr.push({ x: parseInt(value), y: result.data.data[0].Amount });
        }
        for (let i = 1; i < result.data.data.length; i++) {
          let nextValue = result.data.data[i].created_at
            .split("-")[2]
            .split("T")[0];
          if (value == nextValue) {
            count++;
            amount = amount + parseFloat(result.data.data[i].Amount);
          } else {
            arr.push({ x: parseInt(value), y: amount });
            amount = 0;
            count = 1;
            i = i - 1;
            value = nextValue;
          }
          if (result.data.data.length - 1 == i) {
            arr.push({ x: parseInt(value), y: amount });
          }
        }
      }
      let labelss = new Array();
      for (let i = 1; i <= lastDay.getDate(); i++) {
        let j;
        if (i < 10) {
          j = "0" + i;
        } else {
          j = i;
        }
        labelss.push(parseInt(j));
      }
      setGraphUsers(arr);
      setGraphLabels(labelss);
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
      setLoadingState(false);
      console.log("Fail to fetch coin pack fee ");
    }
  };

  useEffect(() => {
    void (async () => {
    fetchRewardsDetails();
      })();
  }, []);

  return (
    <div className="ClaimmedNetworkRewardsContainer">
      <div className="ClaimmedNetworkRewardsInner">
        <div className="title">
          <h1>Claimmed Network Rewards</h1>
        </div>
        <div className="ClaimmedNetworkRewardsMain">
          <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
            <div className="graphContainer ">
              {/* <ClaimedNetworkRewardChart
                GraphUsers={GraphUsers}
                GraphLabels={GraphLabels}
                fetchRewardsDetails={fetchRewardsDetails}
              /> */}
              <ClaimmedGraph />
            </div>
          </div>
          <div className="tabsContainer">
            <ul className="mb-3 nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayNRTable(true);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayNRTable && "active"}`}
                >
                  History Claimmed Network Rewards Table
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayNRTable(false);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${!displayNRTable && "active"}`}
                >
                  Requested Claimmed Network Rewards Table
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {displayNRTable ? <ClaimmedNRTable /> : <RequestedNRTable />}
            </div>
          </div>
        </div>
      </div>
      {loadingState && <Loader />}
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

export default ClaimmedNetworkRewards;
ClaimmedNetworkRewards.PageLayout = AdminDashboardLayout;
