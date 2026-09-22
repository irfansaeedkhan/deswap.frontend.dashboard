import React, { useState, useEffect } from "react";
import Image from "next/image";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import {
  HomeIcon,
  LRIcon,
  UsersIcon,
} from "@/components/marketPlace/MarketIcons";
import axios from "@/utils/common/axios";
import LicenseRequest from "@/components/marketPlace/license/LicenseRequest";
import LicenseHistory from "@/components/marketPlace/license/LicenseHistory";
import { myRewardsDate } from "@/utils/common/date";
import AdminMarketNavbar from "@/components/marketPlace/AdminMarketNavbar";
import UserList from "@/components/marketPlace/user/UserList";

function Adminpanel() {
  const [displayTab, setDisplayTab] = useState("dashboard");
  const [displaySwapTable, setDisplaySwapTable] = useState(true);

  return (
    <div className="APContainer">
      <AdminMarketNavbar />
      <div className="APInner">
        <div className="togglebar">
          <div
            className={`item ${displayTab == "dashboard" && "active"}`}
            onClick={() => {
              setDisplayTab("dashboard");
            }}
          >
            <div className="icon">
              <HomeIcon />
            </div>
            Dashboard
          </div>
          <div
            className={`item ${displayTab == "LR" && "active"}`}
            onClick={() => {
              setDisplayTab("LR");
            }}
          >
            <div className="icon">
              <LRIcon />
            </div>
            License Requests
          </div>
          <div
            className={`item ${displayTab == "Users" && "active"}`}
            onClick={() => {
              setDisplayTab("Users");
            }}
          >
            <div className="icon">
              <UsersIcon />
            </div>
            Manage Users
          </div>
        </div>
        <div className="mainContent">
          {displayTab == "dashboard" && (
            <div className="PaneldashboardContent">
              <div className="graphBox">
                <Image
                  width={1149}
                  height={437}
                  src={"/images/APGraph.png"}
                  alt={"graph"}
                  loading="lazy"
                />
              </div>
              <div className="detailBoxContainer">
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>1,768</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>DAW Calculating Supply</h6>
                    </div>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>89,374.00</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>Total Assests Traded</h6>
                    </div>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>568</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>Total License Approved</h6>
                    </div>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>1,768</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>DAW Holders</h6>
                    </div>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>89,374.00</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>Total Assests Staked</h6>
                    </div>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="verticalLine"></div>
                  <div className="content">
                    <div className="top">
                      <h4>8</h4>
                      <div className="badge">
                        <ArrowDown />
                        <h5>2%</h5>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>Total Owner</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {displayTab == "LR" && (
            <div className="LRContainer">
              <div className="LRContainerInner">
                <div className="tabsContainer">
                  <ul className="mb-3 nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => {
                        setDisplaySwapTable(true);
                      }}
                    >
                      <button
                        type="button"
                        className={`nav-link ${displaySwapTable && "active"}`}
                      >
                        Requested
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        setDisplaySwapTable(false);
                      }}
                    >
                      <button
                        type="button"
                        className={`nav-link ${!displaySwapTable && "active"}`}
                      >
                        History
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {displaySwapTable ? <LicenseRequest /> : <LicenseHistory />}
                  </div>
                </div>
              </div>
            </div>
          )}
          {displayTab == "Users" && (
            <>
              <UserList />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Adminpanel;
