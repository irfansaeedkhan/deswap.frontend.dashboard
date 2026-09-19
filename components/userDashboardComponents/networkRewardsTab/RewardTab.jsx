import React from "react";

import ClaimmedNetworkRewards from "./claimmedNetworkRewardsHistory";
import NetworkRewards from "./networkRewards";
import StakingPackHistory from "./stakingPackClaimmedHistory";
import TotalNetworkRewards from "./totalnetworkRewards";

function RewardTab() {
  return (
    <div className="rewardContainer">
      <div className="rewardInner">
        <TotalNetworkRewards></TotalNetworkRewards>
        <div className="networkDataTables">
          {/* Network Rewards table */}
          <NetworkRewards></NetworkRewards>
          {/* Network Rewards History */}
          <ClaimmedNetworkRewards></ClaimmedNetworkRewards>
          {/* Pack Claimed Rewards History */}
          {/* <StakingPackHistory></StakingPackHistory> */}
        </div>
      </div>
    </div>
  );
}

export default RewardTab;
