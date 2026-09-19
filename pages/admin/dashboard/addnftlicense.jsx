import React, { useState, useEffect, useContext } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import NFTLicenseCard from "@/components/adminDashboardComponents/addnftlicense/NFTLicenseCard";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { NFTContext } from "@/layout/admindashboard.layout";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
function AddNFTLicense() {
  const [NFTList, setNFTList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const refreshNFTList = useContext(NFTContext);
  // api call
  const fetchNFTListFunc = async () => {
    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/nftlicense/fetch`,
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
          setNFTList(result?.data?.data);
          setLoadingState(false);
        } else {
          setNFTList(<NodataCard />);
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
        setNFTList(<NodataCard />);
      }

      setLoadingState(false);
      const data = result?.data?.data;
      data = await SanitizeRequestObject(data);
      return result?.data?.data;
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
      setNFTList(<FailedToFetchData />);
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };

  //   use effect to fetch latest data
  useEffect(async () => {
    await fetchNFTListFunc();
  }, [refreshNFTList]);

  const handleDelete = async (licenseId) => {
    const sanID = await SanitizeRequestString(licenseId);
    let id = await requestBodyEncryptionAdmin({ id: sanID });
    //  let id = await requestBodyEncryptionUnprotected(licenseId);

    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/nftlicense/delete`,
        { data: id },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      await fetchNFTListFunc();
      setLoadingState(result && false);
      toast.success("NFT License Successfully Deleted", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  // handle update
  const handleUpdate = async (Updatedata) => {
    const sanData = await SanitizeRequestObject(Updatedata);
    let data = await requestBodyEncryptionAdmin(sanData);

    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/nftlicense/update`,
        { data: data },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      await fetchNFTListFunc();
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
          <h1>nftLicenses</h1>
        </div>
        <div className="nftLicenseMain">
          <div className="nftLicenseCardsContainer">
            {NFTList?.length > 0
              ? NFTList.map((cardInfo) => {
                  return (
                    <NFTLicenseCard
                      cardInfo={cardInfo}
                      key={cardInfo?._id}
                      handleDelete={handleDelete}
                      handleUpdate={handleUpdate}
                    />
                  );
                })
              : NFTList}
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

export default AddNFTLicense;
AddNFTLicense.PageLayout = AdminDashboardLayout;
