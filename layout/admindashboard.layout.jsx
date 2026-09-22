import React, { useState, useEffect } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Modal from "@/components/reusables/Modal";
import axios from "@/utils/common/axios";
import AdminDashboardSidebar from "@/components/adminDashboardComponents/adminSidebar/AdminDashboardSidebar";
import AdminDashboardMobileSidebar from "@/components/adminDashboardComponents/adminSidebar/AdminDashboardMobileSidebar";
import AdminDashboardNavbar from "@/components/adminDashboardComponents/adminNavbar/AdminDashboardNavbar";
import Loader from "@/components/reusables/loader/Loader";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "@/utils/common/sanitize";
import CreateNewLevelCard from "@/components/adminDashboardComponents/networkrewardsetting/CreateNewLevelCard";
import CreateLevelCard from "@/components/adminDashboardComponents/createlevel/CreateLevelCard";
import CreateCategoryCard from "@/components/adminDashboardComponents/companyCategory/CreateCategoryCard";
import CreatePackCard from "@/components/adminDashboardComponents/packs/CreatePackCard";
import CreateNFTLicenseCard from "@/components/adminDashboardComponents/addnftlicense/CreateNFTLicenseCard";
import CreateDeswapPackCard from "@/components/adminDashboardComponents/adddeswappack/CreateDeswapPackCard";
import { usePrefetchDashboardRoutes } from "@/utils/dashboard/prefetchRoutes";
// import Pagination from "@/components/reusables/Pagination";
config.autoAddCss = false;
export const NFTContext = React.createContext();
export const LevelContext = React.createContext();
export const CategoryContext = React.createContext();

export function AdminDashboardLayout({ children }) {
  usePrefetchDashboardRoutes("admin");
  const [loadingState, setLoadingState] = useState(false);
  // create new pack
  const [showCreatNewPack, setShowCreatNewPack] = useState(false);
  const closeModalNewPack = () => {
    setShowCreatNewPack(false);
  };
  const ShowCreatNewPackFunction = () => {
    setShowCreatNewPack(true);
  };
  // add deswap stacking pack
  const [showDeswapPackCard, setShowDeswapPackCard] = useState(false);
  const closeModalAddDeswapPack = () => {
    setShowDeswapPackCard(false);
  };
  const ShowAddDeswapPackFunction = () => {
    setShowDeswapPackCard(true);
  };

  // add new nft license function
  const [showAddNFTLicense, setShowAddNFTLicense] = useState(false);
  const [refreshNFTList, setRefreshNFTList] = useState(false);
  const closeModalAddNFTLicense = () => {
    setShowAddNFTLicense(false);
  };
  const ShowAddNFTLicenseFunction = () => {
    setShowAddNFTLicense(true);
  };

  // api call
  const creatingNFTLicenseFunc = async (data) => {
    closeModalAddNFTLicense();
    try {
      await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionAdmin(data);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/nftlicense/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      await SanitizeRequestString(result.data.data);
      if (result && result.status == 200) {
        toggleNFTRefresh();
        toast.success("NFT License Successfully Added", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoadingState(result && false);
        closeModalAddNFTLicense();
      } else {
        console.log("error getting api response");
      }
      setLoadingState(result.data.data && false);
      return result.data.data;
    } catch (e) {
      console.log("error in catch", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingState(false);
      return 0;
    }
  };

  // add new nft license function
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [showNewAddLevel, setNewShowAddLevel] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [refreshLevelList, setRefreshLevelList] = useState(false);
  const closeModalAddLevel = () => {
    setShowAddLevel(false);
  };

  const closeModalAddNewLevel = () => {
    setNewShowAddLevel(false);
  };

  const ShowAddLevelFunction = () => {
    setShowAddLevel(true);
  };
  const ShowAddNewLevelFunction = () => {
    setNewShowAddLevel(true);
  };

  const closeModalAddCategory = () => {
    setShowAddCategory(false);
  };

  const ShowAddCategoryFunction = () => {
    setShowAddCategory(true);
  };

  // api call to update level
  const creatingAddLevelFunc = async (data) => {
    closeModalAddLevel();
    try {
      const data1 = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionAdmin(data1);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardlevel/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanData = await SanitizeRequestString(result.data.data);
      if (result && result.status == 200) {
        toggleLevelRefresh();
        toast.success("Level Successfully Added", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoadingState(result && false);
        closeModalAddLevel();
      } else {
        console.log("error getting api response");
      }
      setLoadingState(sanData && false);
      return sanData;
    } catch (e) {
      console.log("error in catch", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingState(false);
      return 0;
    }
  };

  // api call to add new level
  const creatingAddNewLevelFunc = async (data) => {
    closeModalAddNewLevel();
    try {
      const data1 = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionAdmin(data1);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardssetting/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanData = await SanitizeRequestString(result.data.data);
      if (result && result.status == 200) {
        toggleLevelRefresh();
        toast.success("Level Successfully Added", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoadingState(result && false);
        closeModalAddLevel();
      } else {
        console.log("error getting api response");
      }
      setLoadingState(sanData && false);
      return sanData;
    } catch (e) {
      console.log("error in catch", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingState(false);
      return 0;
    }
  };

  // api call to update category
  const creatingAddCategoryFunc = async (data) => {
    closeModalAddCategory();
    try {
      const data1 = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionAdmin(data1);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/catagory/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanData = await SanitizeRequestString(result.data.data);
      if (result && result.status == 200) {
        toggleLevelRefresh();
        toast.success("Category Successfully Added", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoadingState(result && false);
        closeModalAddCategory();
      } else {
        console.log("error getting api response");
      }
      setLoadingState(sanData && false);
      return sanData;
    } catch (e) {
      console.log("error in catch", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingState(false);
      return 0;
    }
  };

  useEffect(() => {
    /*
    document.onkeydown = function(e) {
      if(e.keyCode == 123) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
         return false;
      }
    };
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });*/
  }, []);

  // refreshNFTList
  function toggleNFTRefresh() {
    setRefreshNFTList((prevRefreshNFTList) => !prevRefreshNFTList);
  }
  function toggleLevelRefresh() {
    setRefreshLevelList((prevRefreshLevelList) => !prevRefreshLevelList);
  }
  return (
    <div className="DashboardLayout Admin">
      <Head>
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>
      <div className="DashboardLayoutInner">
        <div className="sidebar">
          <AdminDashboardSidebar />
          <AdminDashboardMobileSidebar />
        </div>
        <div className="mainContent">
          <div className="DashboardNavbarContainer">
            <AdminDashboardNavbar
              ShowCreatNewPackFunction={ShowCreatNewPackFunction}
              ShowAddNFTLicenseFunction={ShowAddNFTLicenseFunction}
              ShowAddLevelFunction={ShowAddLevelFunction}
              ShowAddNewLevelFunction={ShowAddNewLevelFunction}
              ShowAddCategoryFunction={ShowAddCategoryFunction}
              ShowAddDeswapPackFunction={ShowAddDeswapPackFunction}
            />
          </div>
          <NFTContext.Provider value={refreshNFTList}>
            <main className="tabsData">{children}</main>
          </NFTContext.Provider>
        </div>
      </div>
      {/* showCreatNewPack modal */}
      <Modal
        show={showCreatNewPack}
        cross={false}
        modaltitle="Create New Pack"
        onClose={() => setShowCreatNewPack(false)}
      >
        <div className="createPackCard">
          <CreatePackCard closeModal={closeModalNewPack} />
        </div>
      </Modal>
      {/* add nft license modal */}
      <Modal
        show={showAddNFTLicense}
        cross={false}
        modaltitle="Add NFT License"
        onClose={() => setShowAddNFTLicense(false)}
      >
        <div className="createnftLicenseCard">
          <CreateNFTLicenseCard
            creatingNFTLicenseFunc={creatingNFTLicenseFunc}
            closeModal={closeModalAddNFTLicense}
          />
        </div>
      </Modal>
      {/*add level modal */}
      <Modal
        show={showAddLevel}
        cross={false}
        modaltitle="Create Company Reward Level"
        onClose={() => setShowAddLevel(false)}
      >
        <div className="createnftLicenseCard">
          <CreateLevelCard
            creatingAddLevelFunc={creatingAddLevelFunc}
            closeModal={closeModalAddLevel}
          />
        </div>
      </Modal>
      <Modal
        show={showNewAddLevel}
        cross={false}
        modaltitle="Add New Level"
        onClose={() => setNewShowAddLevel(false)}
      >
        <div className="createnftLicenseCard">
          <CreateNewLevelCard
            creatingAddLevelFunc={creatingAddNewLevelFunc}
            closeModal={closeModalAddNewLevel}
          />
        </div>
      </Modal>
      {/*add category modal */}
      <Modal
        show={showAddCategory}
        cross={false}
        modaltitle="Create Company Category"
        onClose={() => setShowAddCategory(false)}
      >
        <div className="createnftLicenseCard">
          <CreateCategoryCard
            creatingAddCategoryFunc={creatingAddCategoryFunc}
            closeModal={closeModalAddCategory}
          />
        </div>
      </Modal>

      {/* add buy deswpa pack */}
      <Modal
        show={showDeswapPackCard}
        cross={false}
        modaltitle="Add Deswap Pack"
        onClose={() => setShowDeswapPackCard(false)}
      >
        <div className="createdeswapstackCard">
          <CreateDeswapPackCard closeModal={closeModalAddDeswapPack} />
        </div>
      </Modal>
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
