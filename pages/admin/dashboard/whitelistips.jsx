import React, { useState, useEffect } from "react";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import WhitelistIPTable from "@/components/adminDashboardComponents/whitelistip/whitelistIPTable";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function WhiteListIPs() {
  return (
    <div className="AdminUserAccTabContainer">
      <div className="AdminUserAccTabInner">
        <div className="title">
          <h1>IP List</h1>
        </div>
        <WhitelistIPTable></WhitelistIPTable>
      </div>
    </div>
  );
}

export default WhiteListIPs;
WhiteListIPs.PageLayout = AdminDashboardLayout;
