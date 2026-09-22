import React, { useState } from "react";
import Dropdown from "@/components/global/DropDown";
import CoinPackPurchasedByUser from "@/components/adminDashboardComponents/usersinfoComponents/CoinPackPurchasedByUser";
import NetworkLicensePurchasedByUser from "@/components/adminDashboardComponents/usersinfoComponents/NetworkLicensePurchasedByUser";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";


const dropDownStatusdata = [
  { id: 0, label: "Coin Pack Purchased By User" },
  { id: 1, label: "Network License Purchased By User" },
];
/*
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
// import Pagination from "@/components/reusables/Pagination";
export const getServerSideProps = async (ctx) => {
  return  await checkAdminAuth(ctx);
}*/

function UsersInfoDetails() {
  const [getDropDownStatus, setGetDropDownStatus] = useState(
    "Coin Pack Purchased By User"
  );

  const getDropdownValue = (value) => {
    setGetDropDownStatus(value);
  };
  return (
    <div className="adminUsersInfoDetailsContainer">
      <div className="userinfopageHeader">
        <div className="userinfoTitleContainer">
          <h4>shivamlaxminetworks@gmail.com</h4>
          <h3>
            <span>User Account /</span> shivamlaxminetworks@gmail.com
          </h3>
        </div>
        <div className="dropdownContainer">
          <div className="formInputDropDown">
            <Dropdown
              data={dropDownStatusdata}
              getDropdownValue={getDropdownValue}
              placeholder="Coin Pack Purchased By User"
            />
          </div>
        </div>
      </div>
      {/* Coin Pack Purchased By User */}
      {getDropDownStatus == "Coin Pack Purchased By User" && (
        <CoinPackPurchasedByUser />
      )}
      {/* Network License Purchased By User */}
      {getDropDownStatus == "Network License Purchased By User" && (
        <NetworkLicensePurchasedByUser />
      )}
    </div>
  );
}

export default UsersInfoDetails;
UsersInfoDetails.PageLayout = AdminDashboardLayout;
