import React, { useState, useEffect } from "react";
import TotalCoinpackFeeGraph from "@/components/adminDashboardComponents/stackingpackfee/TotalCoinpackFeeGraph";
import Loader from "@/components/reusables/loader/Loader";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import PacksPurchasedHistory from "@/components/adminDashboardComponents/purchasedpack/PacksPurchasedHistory";
import PacksPurchasedRequest from "@/components/adminDashboardComponents/purchasedpack/PacksPurchasedRequest";
import PacksPurchasedGraph from "@/components/adminDashboardComponents/purchasedpack/PacksPurchasedGraph";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function ClaimmedPack() {
  //Graph Data
  const [ntrChanged, setNTRChanged] = useState("0,00");
  const [ntrPercentageChanged, setNTRPercentageChanged] = useState("0,00");
  const [displayValue, setdisplayValue] = useState(false);

  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    setLoadingState(false);
  }, []);
  return (
    <div className="NetworkRewardsContainer">
      <div className="NetworkRewardsInner">
        <div className="title">
          <h1>Claimmed Network Rewards</h1>
        </div>
        <div className="NetworkRewardsMain">
          <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
            <div className="graphContainer ">
              {/* <TotalCoinpackFeeGraph
                graphData={45}
                duration="5m"
                setNTRChanged={setNTRChanged}
                setNTRPercentageChanged={setNTRPercentageChanged}
                setdisplayValue={setdisplayValue}
              /> */}
              <PacksPurchasedGraph />
            </div>
          </div>
          <PacksPurchasedRequest></PacksPurchasedRequest>
          <br></br>
          <PacksPurchasedHistory></PacksPurchasedHistory>
        </div>
      </div>
      {loadingState && <Loader />}
    </div>
  );
}

export default ClaimmedPack;
ClaimmedPack.PageLayout = AdminDashboardLayout;
