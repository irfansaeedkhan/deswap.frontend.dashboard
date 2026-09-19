import React, { useState, useEffect, useContext } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import LevelCard from "@/components/adminDashboardComponents/createlevel/LevelCard";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { LevelContext } from "@/layout/admindashboard.layout";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
function CreateLevel() {
  const [levelList, setLevelList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const refreshNFTList = useContext(LevelContext);
  // api call
  const fetchLevelListFunc = async () => {
    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardlevel/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoadingState(result && false);
      if (result) {
        if (result?.data?.data?.length > 0) {
          setLevelList(result?.data?.data);
          setLoadingState(false);
        } else {
          setLevelList(<NodataCard />);
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
        setLevelList(<NodataCard />);
      }

      setLoadingState(false);
      const data = result?.data?.data;
      data = await SanitizeRequestObject(data);
      return data;
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
      setLevelList(<FailedToFetchData />);
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };

  //   use effect to fetch latest data
  useEffect(async () => {
    await fetchLevelListFunc();
  }, [refreshNFTList]);

  // handle update
  const handleUpdate = async (Updatedata) => {
    const sanData = await SanitizeRequestObject(Updatedata);
    let data = await requestBodyEncryptionAdmin(sanData);

    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardlevel/update`,
        { data: data },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      await fetchLevelListFunc();
      setLoadingState(result && false);

      return result;
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
      setLoadingState(false);
      return 0;
    }
  };

  return (
    <div className="nftLicenseContainer">
      <div className="nftLicenseInner">
        <div className="title">
          <h1>Create Company Reward Level</h1>
        </div>
        <div className="nftLicenseMain">
          <div className="nftLicenseCardsContainer">
            {levelList?.length > 0
              ? levelList.map((cardInfo) => {
                  return (
                    <LevelCard
                      cardInfo={cardInfo}
                      key={cardInfo?._id}
                      handleUpdate={handleUpdate}
                    />
                  );
                })
              : levelList}
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

export default CreateLevel;
CreateLevel.PageLayout = AdminDashboardLayout;
