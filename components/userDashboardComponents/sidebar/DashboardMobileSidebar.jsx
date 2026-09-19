import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import WalletConnectButton from "@/components/reusables/walletConnectButton";
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
const DashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};

function DashboardMobileSidebar() {
  const router = useRouter();
  const handleLogout = async () => {
    router.push("/logout");
  };
  return (
    <div className="sidebarMobileContent">
      <ul className="sidebar-links">
        <li
          className={router.pathname == "/user/dashboard" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <MetaverseIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/buydeswaptoken">
            <a>Buy Deswap</a>
          </Link>
        </li>
        {/* <li
          className={router.pathname == "/user/dashboard/buydswap" ? "active" : ""}
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <StackingPackIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/buydswap">
            <a>Buy Pack</a>
          </Link>
        </li> */}
        <li
          className={
            router.pathname == "/user/dashboard/network" ? "active" : ""
          }
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
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
          onClick={() => DashboardNavbarToggle()}
        >
          <div className="liIcon">
            {" "}
            <CreateTokenIcon />
          </div>
          <Link legacyBehavior href="/user/dashboard/createtoken">
            <a>Create Token</a>
          </Link>
        </li>
        <li>
          {/* <div className="liIcon"><DistributionIcon /></div>
          <Link legacyBehavior href="/dashboard/distribution"><a>Distribution</a></Link> */}
          <div className="textBox">
            {/* <button className="SimpleButton btnHoverEffectOutline">
              0xAbsd...5eb5
            </button> */}
            <WalletConnectButton></WalletConnectButton>
          </div>
        </li>
        <li
          className={router.pathname == "/" ? "active" : ""}
          onClick={handleLogout}
        >
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
    </div>
  );
}

export default DashboardMobileSidebar;
