import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
const UsersIcon = <FontAwesomeIcon icon={faUsers} />;
const InfoIcon = <FontAwesomeIcon icon={faInfo} />;
import Searchicon from "@/assets/svgAssets/SearchIcon";
import {
  FBicon,
  Lkicon,
  TWicon,
  WEBicon,
} from "@/assets/svgAssets/SocialIcons.js";
import Image from "next/image";


function CompanyLevel(props) {
  return (
    <div className="CompanyCard">
        <div className="leftImg">
          <div className="companyImgIcon">
            <img
              width={156}
              height={156}
              src={(props.data && props.data.ipfSURL) || "/images/companylogo1.png"}
              alt="company logo"
            />
          </div>
        </div>
        <div className="rightContent">
          <h3>{props.data && props.data.name ? props.data.name :"N/A"}</h3>
          <div className="dataList">
            <div className="leftDataList">
              <h4>@{props.data && props.data.username? props.data.username:"N/A "} </h4>
              <div className="dot"></div>
              <h4>
                Owner : <span>{props.data && props.data.owner ?props.data.owner:"N/A"}</span>{" "}
              </h4>
            </div>
            <div className="rightDataList">
              <div className="dotVertical"></div>
              <div className="socialIconsContainer">
                <button>
                  <FBicon />
                </button>
                <button>
                  <Lkicon />
                </button>
                <button>
                  <TWicon />
                </button>
                <button>
                  <WEBicon />
                </button>
              </div>
            </div>
          </div>
          <div className="companyInfoTable">
            <div className="tableContainer">
              <div className="tableContainerTable customScroll">
                <div className="infoItem">
                  <h5>Business</h5>
                  <h6>{props.data && props.data.business? props.data.business:"N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Company Email</h5>
                  <h6>{props.data && props.data.email? props.data.email:"N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Legal Address</h5>
                  <h6>{props.data && props.data.address? props.data.address:"N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Employees</h5>
                  <h6>{props.data && props.data.employees ? props.data.employees: "N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Register Date</h5>
                  <h6>{props.data && props.data.created_at?  myRewardsDate(props.data.created_at):"N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Renewal Date</h5>
                  <h6>{props.data && props.data.renewalDate?  myRewardsDate(props.data.renewalDate):"N/A"}</h6>
                </div>
                <div className="infoItem">
                  <h5>Expire Date</h5>
                  <h6>{props.data && props.data.expireDate?  myRewardsDate(props.data.expireDate):"N/A"}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CompanyLevel;
