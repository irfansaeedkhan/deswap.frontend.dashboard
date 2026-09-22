import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  DashboardIcon,
  UserIcon,
  BuydswapIcon,
  MetaverseIcon,
  MyNetworkIcon,
  CreateTokenIcon,
  NetworkIcon,
  CompanyIcon,
} from "./Iconssvg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DemoRoleSwitcher from "@/components/reusables/DemoRoleSwitcher";

function DashboardSidebar() {
  const router = useRouter();
  const handleLogout = async (e) => {
    e.preventDefault();
    router.push("/logout");
  };

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
          <Link prefetch={true} legacyBehavior href="/user/dashboard">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/profile">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/buydswap">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/company">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/metaverse">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/nftlicense">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/buydeswaptoken">
            <a>Buy Deswap</a>
          </Link>
        </li>
        {/* <li className={router.pathname == "/user/dashboard/stackingpack" ? "active" : ""}>
          <div className="liIcon"><StackingPackIcon /></div>
          <Link prefetch={true} legacyBehavior href="/user/dashboard/buydswap">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/network">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/networkdetails">
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
          <Link prefetch={true} legacyBehavior href="/user/dashboard/createtoken">
            <a>Create Token</a>
          </Link>
        </li>
        <li className="logoutList">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <DemoRoleSwitcher current="user" />
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
