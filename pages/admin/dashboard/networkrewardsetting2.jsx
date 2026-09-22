import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import Loader from "@/components/reusables/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

// import Pagination from "@/components/reusables/Pagination";


function NetworkRewardsSetting() {
  //const [rewardSettingList, setRewardSettingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rewardSettingList, setRewardSettingList] = useState(
    <div>Loading data...</div>
  );

  //TO DO : Add code for deleting level

  //TO DO : Add code for updating rewards level
  const createNetworkSetting = async (data) => {
    try {
      setLoading(true);
      if (data.length < 1) {
        setLoading(false);
        await setRewardSettingList(<NodataCard />);
        return;
      }
      let displayData = [];
      for (let index in data) {
        if (data[index].Level && data[index].Percentage && data[index].Status) {
          //
          displayData.push(
            <div className="CardContainer">
              <div className="CardInner">
                <div className="content">
                  <p>Level {data[index]?.Level ? data[index]?.Level : "N/A"}</p>
                  <h5>
                    {data[index]?.Percentage ? data[index]?.Percentage : "N/A"}{" "}
                    %
                  </h5>
                  <h5>{data[index]?.Status ? data[index]?.Status : "N/A"}</h5>
                </div>
              </div>
            </div>
          );
        }
      }
      if (displayData.length < 1) {
        setLoading(false);
        await setRewardSettingList(<NodataCard />);
        return;
      }
      setLoading(false);
      await setRewardSettingList(displayData);
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
      setLoading(false);
      await setRewardSettingList(<div>Failed to fetch data</div>);
    }
  };
  const fetchRewardSettingList = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardssetting/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      //setRewardSettingList(result.data.data);
      createNetworkSetting(result?.data?.data);
    } catch (e) {
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(e);
    }
  };

  useEffect(() => {
    void (async () => {
    await fetchRewardSettingList();
      })();
  }, []);
  return (
    <div className="NetworkRewardsSettingTabContainer">
      <div className="NetworkRewardsSettingTabInner">
        <div className="title">
          <h1>Network Rewards Setting</h1>
        </div>
        <div className="topCards">
          {/* profile card */}
          {rewardSettingList}
        </div>
        {/* 
        <div className="NetworkRewardsSettingTabMain">
       
         
        </div> */}
      </div>
      {loading && <Loader />}
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

export default NetworkRewardsSetting;
NetworkRewardsSetting.PageLayout = AdminDashboardLayout;
