import React, { useState, useEffect } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import DeswapPackCard from "@/components/adminDashboardComponents/adddeswappack/DeswapPackCard";
import Modal from "@/components/reusables/Modal";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

// import Pagination from "@/components/reusables/Pagination";



function AddDeswapPack(serversidePropsData) {
  const [ClaimingPackList, setClaimingPackList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [deletePackModal, setDeletePackModal] = useState(false);
  const [deactivatePackModal, setDeactivatePackModal] = useState(false);
  const [packID, setPackID] = useState();

  // api call
  const fetchClaimingPackListFunc = async () => {
    try {
      setLoadingState(true);
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const sanObj = await SanitizeRequestObject(result.data.data);
      if (result) {
        setLoadingState(result && false);
        if (result?.data?.data?.length > 0) {
          setClaimingPackList(sanObj);
        } else {
          setClaimingPackList(<NodataCard />);
        }
      } else {
        setClaimingPackList(<FailedToFetchData />);
      }
      setLoadingState(false);
      return sanObj;
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
      setClaimingPackList(<FailedToFetchData />);
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };

  //TO DO :
  //Create function to that will make request to delete endpoint for deleting it.

  //Funtion for fetching details about usage of staking pack
  const deleteClaimmingPack = async (clammingpack) => {
    // try{
    //   //TO DO : Add post request to fetch usage
    //   //TO DO : if count is 0 then show
    //   let result = await axios.post("",clammingpack)
    //   await fetchClaimingPackListFunc();
    // }catch(e)
    // {
    //   console.log("Failed to delete")
    // }

    // checking wether clamming pack is wetther used in backend in platform or not.
    // if count is 0 then no usage then we ask admin “Are you sure you want to delete clamming pack“ if user click on yes then make request on delete endpoint.
    // if count is more than 0 then show admin message . “Pack is still in use . you can also deactivate pack so that user cannot  buy it “
    setPackID(clammingpack);
    let packCount = 1;
    if (packCount == 0 || packCount < 1) {
      setDeletePackModal(true);
    } else {
      setDeactivatePackModal(true);
    }
  };

  // function to delete pack
  const deletepackFunc = async () => {
    try {
      const sanData = await SanitizeRequestString(packID.id);
      let encryptedData = await requestBodyEncryptionAdmin({ id: sanData });
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/delete`,
        { data: encryptedData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      setLoadingState(result && false);
      setDeletePackModal(false);
      await fetchClaimingPackListFunc();
      toast.success("Clamming Pack Successfully Delete", {
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
  const deactivatepackFunc = async () => {
    try {
      const sanData = await SanitizeRequestString(packID.id);
      let encryptedData = await requestBodyEncryptionAdmin({ id: sanData });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/deactive`,
        { data: encryptedData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      setDeactivatePackModal(false);
      await fetchClaimingPackListFunc();
      toast.success("Clamming Pack Successfully Deactive", {
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

  //use effect to fetch latest data
  useEffect(() => {
    void (async () => {
    await fetchClaimingPackListFunc();
      })();
  }, []);
  return (
    <div className="deswapstackContainer">
      <div className="deswapstackInner">
        <div className="title">
          <h1>Deswap Pack</h1>
        </div>
        <div className="deswapstackMain">
          <div className="deswapstackCardsContainer">
            {ClaimingPackList?.length > 0
              ? ClaimingPackList?.map((cardInfo) => {
                  return (
                    <DeswapPackCard
                      cardInfo={cardInfo}
                      key={cardInfo?._id}
                      deleteClaimmingPack={deleteClaimmingPack}
                    />
                  );
                })
              : ClaimingPackList}
          </div>
        </div>
      </div>
      {loadingState && <Loader />}
      {/* delete Modal */}
      <Modal
        show={deletePackModal}
        cross={false}
        modaltitle="Delete Claimming Pack"
        onClose={() => setDeletePackModal(false)}
      >
        <div className="claimmingpackDelCard modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={280}
                  height={280}
                  src="/images/Claimrewards.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
            <h5>Are You Sure You Want To Delete Claimming Pack ?</h5>
          </div>
          <div className={` claimmingpackDelCard`}>
            <div className="claimmingpackDelCardInner">
              <div className="footerCard">
                <SimpleButton
                  text={"Cancel"}
                  backgroundColor={"#291719"}
                  color={"#E44757"}
                  onClick={() => {
                    setDeletePackModal(false);
                  }}
                />
                <SimpleButton
                  text={"Delete"}
                  backgroundColor={"#E44757"}
                  color={"#FFFFFF"}
                  onClick={deletepackFunc}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* deactivate Modal */}
      <Modal
        show={deactivatePackModal}
        cross={false}
        modaltitle="User Deactivation Notification"
        onClose={() => setDeactivatePackModal(false)}
      >
        <div className="claimmingpackDelCard modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={280}
                  height={280}
                  src="/images/Claimrewards.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
            <h5>
              Pack Is Still In Use . You Can Also Deactivate Pack So That User
              Cannot Buy It
            </h5>
          </div>
          <div className={` claimmingpackDelCard`}>
            <div className="claimmingpackDelCardInner">
              <div className="footerCard">
                <SimpleButton
                  text={"Cancel"}
                  backgroundColor={"#291719"}
                  color={"#E44757"}
                  onClick={() => {
                    setDeactivatePackModal(false);
                  }}
                />
                <SimpleButton
                  text={"Deactivate"}
                  backgroundColor={"#E44757"}
                  color={"#FFFFFF"}
                  onClick={deactivatepackFunc}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
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

export default AddDeswapPack;
AddDeswapPack.PageLayout = AdminDashboardLayout;
