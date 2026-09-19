import React from "react";
import StakingPackReward from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/StakingPackReward";
import UserDetailNetworkReward from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/UserDetailNetworkReward";
import CoinPackageClaimedRewards from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/CoinPackageClaimedRewards";
import NetworkLicensePurchases from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/NetworkLicensePurchases";
import NetworkRewards from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/NetworkRewards";
import UserNetworkRewardsLevelWise from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/UserNetworkRewardsLevelWise";
import RegisterationFeePaid from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/RegisterationFeePaid";
import StakingPackFee from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/StakingPackFee";
import StakingPackClaimingFee from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/StakingPackClaimingFee";
import NetworkLicensePurchaseFee from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/NetworkLicensePurchaseFee";
import NetworkLicenseClaimingFee from "@/components/adminDashboardComponents/usersinfoComponents/UsersInformationPanel/NetworkLicenseClaimingFee";
import UsersInfoDetails from "./usersinfodetails";
//import Upline from "./upline";
//import Downline from "./downline";
import { useRouter } from "next/router";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function UsersInformationPanel() {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <div className="adminUserinfopanelContainer">
      <UsersInfoDetails />
      {/*<Upline   data={userId}/>
      <Downline data={userId}/>*/}
      <StakingPackReward />
      <UserDetailNetworkReward />
      <CoinPackageClaimedRewards />
      <NetworkLicensePurchases />
      <NetworkRewards />
      <UserNetworkRewardsLevelWise />
      <RegisterationFeePaid />
      <StakingPackFee />
      <StakingPackClaimingFee />
      <NetworkLicensePurchaseFee />
      <NetworkLicenseClaimingFee />
    </div>
  );
}

export default UsersInformationPanel;
UsersInformationPanel.PageLayout = AdminDashboardLayout;
