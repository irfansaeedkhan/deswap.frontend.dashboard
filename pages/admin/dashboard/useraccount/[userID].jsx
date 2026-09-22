import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import SwapMDChart from "@/components/adminDashboardComponents/charts/SwapMDChart";
import RegistrationFee from "@/components/adminDashboardComponents/UserDetails/RegistrationFee";
import NFTLicesnseFee from "@/components/adminDashboardComponents/UserDetails/NFTLicesnseFee";
import PublickeyFee from "@/components/adminDashboardComponents/UserDetails/PublickeyFee";
import CompanyFee from "@/components/adminDashboardComponents/UserDetails/CompanyFee";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";


function UserDetails({ uuid }) {
  const [loadingState, setLoadingState] = useState(false);

  return (
    <div className="SwapMDContainer">
      <div className="SwapMDInner">
        <div className="title">
          <h1>User Information</h1>
        </div>
        <div className="SwapMDMain">
          <div className="tabsContainer">
            <div className="tab-content">
              <RegistrationFee uuid={uuid} />
              <NFTLicesnseFee uuid={uuid} />
              <PublickeyFee uuid={uuid} />
              <CompanyFee uuid={uuid} />
            </div>
          </div>
        </div>
      </div>
      {loadingState && <Loader />}
    </div>
  );
}

export default UserDetails;
UserDetails.PageLayout = AdminDashboardLayout;
