import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { checkUserAuth } from "@/utils/auth/userauth";
import {
  DashboardIcon,
  UserIcon,
  BuydswapIcon,
  DistributionIcon,
  MetaverseIcon,
  MyNetworkIcon,
  CreateTokenIcon,
  NetworkIcon,
  StackingPackIcon,
  CompanyIcon,
} from "./Iconssvg";
import axios from "axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { clearAllInterval } from "@/utils/common/interval";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};
function DashboardSidebar({ users }) {
  const [userCredentials, setUserCredentials] = useState({});
  const router = useRouter();
  const handleLogout = async (e) => {
    e.preventDefault();
    router.push("/logout");
  };

  useEffect(async () => {
    await clearAllInterval();
    let userNets = [];
    // const fetchUsers = async () => {
    //   try {
    //     let encryptionData = await requestBodyEncryptionUnprotected(users)
    //     const { data } = await axios.post(
    //       `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/getUserCredentials`,
    //       {data:encryptionData},
    //       { withCredentials: true,
    //         headers:{
    //           'security-set':true
    //         }
    //        }
    //     );
    //     setUserCredentials(data.UserCredentails);
    //   } catch (error) {
    //     toast.error(error.message, {
    //       position: "top-center",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       });
    //     console.log("error fetching user sidebarData credentails :", error);
    //   }
    // };
    // await fetchUsers();
  }, []);

  return (
    <div className="sidebarContent">
      <div className="imageContainer">
        <Image
          src={"/images/logo.png"}
          width={152}
          height={34}
          alt="logo"
          loading="lazy"
        />
      </div>
      <ul className="sidebar-links">
        <li className={router.pathname == "/user/dashboard" ? "active" : ""}>
          <div className="liIcon">
            {" "}
            <DashboardIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/profile" ||
            router.pathname == "/user/dashboard/editprofile"
              ? "active"
              : ""
          }
        >
          <div className="liIcon">
            {" "}
            <UserIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/profile">
            <a>Profile</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/buydswap" ? "active" : ""
          }
        >
          <div className="liIcon">
            <BuydswapIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/buydswap">
            <a>Buy Deswap</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/company" ? "active" : ""
          }
        >
          <div className="liIcon">
            <CompanyIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/company">
            <a>Company</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/metaverse" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <MetaverseIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/metaverse">
            <a>Metaverse</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/nftlicense" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <MyNetworkIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/nftlicense">
            <a>NFT License</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/buydeswaptoken" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <MetaverseIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/buydeswaptoken">
            <a>Buy Deswap</a>
          </Link>
        </li>
        {/* <li className={router.pathname == "/user/dashboard/stackingpack" ? "active" : ""}>
          <div className="liIcon"><StackingPackIcon /></div>
          <Link legacyBehavior href="/user/dashboard/buydswap">
            <a>Buy Pack</a>
          </Link>
        </li> */}
        <li
          className={
            router.pathname == "/user/dashboard/network" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <NetworkIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/network">
            <a>Network</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/networkdetails" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <MyNetworkIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/networkdetails">
            <a>My Network</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/user/dashboard/createtoken" ? "active" : ""
          }
        >
          <div className="liIcon">
            {" "}
            <CreateTokenIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/createtoken">
            <a>Create Token</a>
          </Link>
        </li>
        <li className="logoutList">
          <div className="sidebarfooter">
            <div className="footerCardContainer">
              <div className="footerImg">
                <Image
                  src={"/images/avatar.png"}
                  width={82}
                  height={82}
                  alt="footer profile image"
                  loading="lazy"
                />
              </div>
              <div className="logOutContent">
                {/* <h5>0xAbsd...5eb5</h5>
             <h6>Deswap@123@gmail.com</h6> */}
              </div>

              <button
                onClick={handleLogout}
                className="logoutBtn SimpleButton btnHoverEffectOutline"
              >
                <Image
                  src={"/images/logoutIcon.png"}
                  width={20}
                  height={20}
                  alt="logo"
                  loading="lazy"
                />
                <p>Logout</p>
              </button>
            </div>
          </div>
        </li>
      </ul>
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

export default DashboardSidebar;
