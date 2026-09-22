import React, { useState, useEffect } from "react";
import TotalCoinpackFeeGraph from "@/components/adminDashboardComponents/stackingpackfee/TotalCoinpackFeeGraph";
import Loader from "@/components/reusables/loader/Loader";
import UserRegistrationFeeTable from "@/components/adminDashboardComponents/userregistrationfees/UserRegistrationFeeTable";
import UserRegistrationFeeHistory from "@/components/adminDashboardComponents/userregistrationfees/UserRegistrationFeeHistory";
import UserRegistrationChart from "@/components/adminDashboardComponents/userregistrationfees/UserRegistrationChart";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

function Userregistrationfee() {
  //Graph Data
  const [loadingState, setLoadingState] = useState(true);
  const [ntrChanged, setNTRChanged] = useState("0,00");
  const [ntrPercentageChanged, setNTRPercentageChanged] = useState("0,00");
  const [displayValue, setdisplayValue] = useState(false);
  const [displaySwapTable, setDisplaySwapTable] = useState(true);

  useEffect(() => {
    setLoadingState(false);
  }, []);
  return (
    <div className="userRegistrationFeeContainer">
      <div className="userRegistrationFeeInner">
        <div className="title">
          <h1>User network Fee</h1>
        </div>
        <div className="userRegistrationFeeMain SwapMDMain">
          <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
            <div className="ClaimedNetworkRewardChartContainer">
              <UserRegistrationChart />
            </div>
          </div>

          <div className="tab-content">
            <UserRegistrationFeeTable></UserRegistrationFeeTable>
            <UserRegistrationFeeHistory />
          </div>
        </div>
      </div>
      {/* {loadingState && <Loader />} */}
    </div>
  );
}

export default Userregistrationfee;
Userregistrationfee.PageLayout = AdminDashboardLayout;
