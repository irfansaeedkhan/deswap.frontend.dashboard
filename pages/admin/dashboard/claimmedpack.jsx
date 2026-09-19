import React, { useState, useEffect } from "react";
import TotalCoinpackFeeGraph from "@/components/adminDashboardComponents/stackingpackfee/TotalCoinpackFeeGraph";
import Loader from "@/components/reusables/loader/Loader";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import PacksClaimHistory from "@/components/adminDashboardComponents/packsrewardsclaim/PacksClaimHistory";
import PacksClaimRequest from "@/components/adminDashboardComponents/packsrewardsclaim/PacksClaimRequest";
import PacksClaimGraph from "@/components/adminDashboardComponents/packsrewardsclaim/PacksClaimGraph";
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
              <PacksClaimGraph />
            </div>
          </div>
          <PacksClaimRequest></PacksClaimRequest>
          <br></br>
          <PacksClaimHistory></PacksClaimHistory>
        </div>
      </div>
      {loadingState && <Loader />}
    </div>
  );
}

export default ClaimmedPack;
ClaimmedPack.PageLayout = AdminDashboardLayout;
