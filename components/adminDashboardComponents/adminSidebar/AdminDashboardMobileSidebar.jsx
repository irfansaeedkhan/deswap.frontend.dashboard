import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import WalletConnectButtonAdmin from "@/components/reusables/walletConnectButtonAdmin";
import DemoRoleSwitcher from "@/components/reusables/DemoRoleSwitcher";
import {
  DashboardIcon,
  UserIcon,
  BuydswapIcon,
  DistributionIcon,
  MyNetworkIcon,
} from "./Iconssvg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};

function AdminDashboardMobileSidebar() {
  const router = useRouter();
  const handleLogout = () => {
    router.push("/admin/login");
  };

  const [navbarinfo, setNavbarinfo] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  // api call
  const fetchnavbarinfoFunc = async () => {
    try {
      setLoadingState(true);
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/navbarinfo`,
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
        setNavbarinfo(result?.data?.data);
        setLoadingState(false);
      } else {
        setLoadingState(false);
        console.log("error getting api response");
      }
      setLoadingState(false);
      return result?.data?.data;
    } catch (e) {
      // setNavbarinfo(null)
      console.log(e);
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
      return 0;
    }
  };

  //   use effect to fetch latest data
  useEffect(() => {
    fetchnavbarinfoFunc();
  }, []);
  return (
    <div className="sidebarMobileContent">
      <ul className="sidebar-links">
        <div className="sidebarGroup">
          <li
            className={router.pathname == "/admin/dashboard" ? "active" : ""}
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <DashboardIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/addnftlicense"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/addnftlicense">
              <a>Add NFT License</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/createlevel" ? "active" : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/createlevel">
              <a>Create Company Reward Level</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/createcompanycategory"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/createcompanycategory">
              <a>Create Company Category</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/purchasednftlicense"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/purchasednftlicense">
              <a>Purchased NFT License</a>
            </Link>
          </li>
        </div>

        <div className="sidebarGroup">
          <h3>Claimmed Pack</h3>
          <li
            className={
              router.pathname == "/admin/dashboard/addclamingpack"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/addclamingpack">
              <a>Add Deswap Pack</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/purchasedpack"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/purchasedpack">
              <a>
                Purchased Deswap pack{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedPacks || navbarinfo.RequestedPacks == 0
                    ? navbarinfo.RequestedPacks
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/claimmedpack" ? "active" : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/claimmedpack">
              <a>
                Deswap pack rewards{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedPurchasedPacks ||
                  navbarinfo.RequestedPurchasedPacks == 0
                    ? navbarinfo.RequestedPurchasedPacks
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup">
          <li
            className={
              router.pathname == "/admin/dashboard/useraccount" ||
              router.pathname == "/admin/dashboard/userdetail"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/useraccount">
              <a>Users List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companylist" ? "active" : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companylist">
              <a>Company List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companyfee" ? "active" : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companyfee">
              <a>Company Fee List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companyrewards"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companyrewards">
              <a>Company Network Rewards List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/publickeyfee" ? "active" : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/publickeyfee">
              <a>Publickey Fee List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/userregistrationfee"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/userregistrationfee">
              <a>User Registration Fee</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/swapmatictodaw"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/swapmatictodaw">
              <a>
                Swap Matic To DAW{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedUserTransactions ||
                  navbarinfo.RequestedUserTransactions == 0
                    ? navbarinfo.RequestedUserTransactions
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup">
          <h3>Network</h3>
          <li
            className={
              router.pathname == "/admin/dashboard/networkrewards"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/networkrewards">
              <a>Users Network Rewards</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/claimmednetworkrewards"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/claimmednetworkrewards">
              <a>
                Claimmed Network Rewards{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedNetworkRewards ||
                  navbarinfo.RequestedNetworkRewards == 0
                    ? navbarinfo.RequestedNetworkRewards
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>

          <li
            className={
              router.pathname == "/admin/dashboard/networkrewardssetting"
                ? "active"
                : ""
            }
            onClick={() => DashboardNavbarToggle()}
          >
            <div className="liIcon">
              {" "}
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/networkrewardssetting">
              <a>Network Rewards Setting</a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup"></div>
        <li>
          {/* <div className="liIcon"><DistributionIcon /></div>
          <Link legacyBehavior href="/dashboard/distribution"><a>Distribution</a></Link> */}
          <div className="textBox">
            {/* <button className="SimpleButton btnHoverEffectOutline">
              0xAbsd...5eb5
            </button> */}
            <WalletConnectButtonAdmin></WalletConnectButtonAdmin>
          </div>
        </li>

        <li>
          <DemoRoleSwitcher current="admin" />
        </li>
        <li onClick={handleLogout}>
          <div className="liIcon">
            <Image
              src={"/images/logout.png"}
              width={24}
              height={24}
              alt="logo"
              loading="lazy"
            />
          </div>
          <Link legacyBehavior href="/">
            <a>Log Out</a>
          </Link>
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
      />
    </div>
  );
}

export default AdminDashboardMobileSidebar;
/*
=======
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import logoout from "@/assets/images/dashboard/icons/logout.png";
// import logout from "@/assets/images/dashboard/icons/logout.png";
import { DashboardIcon,UserIcon,BuydswapIcon,DistributionIcon,MyNetworkIcon } from "./Iconssvg";

const DashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};

function AdminDashboardMobileSidebar() {
  const router = useRouter();
  const handleLogout = () => {
    router.push("/admin/login");
  };
  return (
    <div className="sidebarMobileContent">
      <ul className="sidebar-links">
        <li
          className={router.pathname == "/admin/dashboard" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <DashboardIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>
        <li
          className={router.pathname == "/admin/dashboard/addnftlicense" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <MyNetworkIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard/addnftlicense">
            <a>Add NFT License</a>
          </Link>
        </li>
        <li
          className={router.pathname == "/admin/dashboard/addclamingpack" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <MyNetworkIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard/addclamingpack">
            <a>Deswap Pack</a>
          </Link>
        </li>
        <li
          className={router.pathname == "/admin/dashboard/useraccount" || router.pathname =="/admin/dashboard/userdetail" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            <BuydswapIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard/useraccount">
            <a>User Account</a>
          </Link>
        </li>
        <li
          className={router.pathname == "/admin/dashboard/usersinfo" || router.pathname =="/admin/dashboard/userdetail" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            <BuydswapIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard/usersinfo">
            <a>Users Info</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/dashboard/packs" ? "active" : ""
          }
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            <DistributionIcon />
          </div>
          <Link legacyBehavior href="/admin/dashboard/packs">
            <a>Packs</a>
          </Link>
        </li>
        <li
          onClick={handleLogout}
        >
          <div className="liIcon">
            <Image src={logoout} alt="logo" />
          </div>
          <Link legacyBehavior href="/">
            <a>Log Out</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboardMobileSidebar;
>>>>>>> b76c9c06b07d869603743e00c0b0d2bc4d6001f6
*/
