import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import NodataCard from "@/components/reusables/NodataCard";
import Loader from "@/components/reusables/loader/Loader";
import NetworkRewardSettingCard from "@/components/adminDashboardComponents/networkrewardsetting/NetworkRewardSettingCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

// import Pagination from "react-js-pagination";
export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
function networkrewardssetting() {
  const [loading, setLoading] = useState(false);
  const [rewardSettingList, setRewardSettingList] = useState(
    <div className="loadingData">
      <h3>Loading Data...</h3>
    </div>
  );

  //TO DO : Add code for deleting level
  // function to delete pack
  const deleteNRSCardFunc = async (id) => {
    try {
      const sanData = await SanitizeRequestString(id);
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin({ id: sanData });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardssetting/delete`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      fetchRewardSettingList();
    } catch (e) {
      console.log("Failed to delete");
    }
  };
  //TO DO : Add code for updating rewards level
  // const updateNRSCardFunc = (data) => {
  //     data = {...data, "Status" : getDropDownStatus}
  //     if(getDropDownStatus){
  //      setStatusError(false)
  //      if (data) {
  // data
  //       }
  //     }else{
  //      setStatusError(true)
  //     }

  //   // try{
  //   //   let result = await axios.post("",clammingpack)
  //   //   await fetchClaimingPackListFunc();
  //   // }
  //   // catch(e)
  //   // {
  //   //   console.log("Failed to delete")
  //   // }
  // };
  const createNetworkSetting = async (data) => {
    try {
      if (data.length < 1) {
        setLoading(false);
        await setRewardSettingList(<NodataCard />);
        return;
      }
      await setRewardSettingList(
        <div className="NetworkRewardsSettingCardsContainer">
          {data?.map((cardInfo, index) => {
            return (
              <NetworkRewardSettingCard
                cardInfo={cardInfo}
                key={cardInfo._id}
                deleteNRSCardFunc={deleteNRSCardFunc}
              />
            );
          })}
        </div>
      );
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
      await setRewardSettingList(<FailedToFetchData />);
    }
  };
  const fetchRewardSettingList = async () => {
    try {
      setLoading(true);
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
      const sanData = await SanitizeRequestObject(result.data.data);
      await createNetworkSetting(sanData);
      setLoading(result && false);
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
      setRewardSettingList(<FailedToFetchData />);
      console.log(e);
    }
  };

  useEffect(async () => {
    await fetchRewardSettingList();
  }, []);

  return (
    <div className="NetworkRewardsSettingTabContainer">
      <div className="NetworkRewardsSettingTabInner">
        <div className="title">
          <h1>Network Rewards Setting</h1>
        </div>
        <div className="packMain">{rewardSettingList}</div>
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

export default networkrewardssetting;
networkrewardssetting.PageLayout = AdminDashboardLayout;
