import React, { useState } from "react";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import PurchasedNFTLicenseTable from "@/components/adminDashboardComponents/purchasednftlicense/PurchasedNFTLicenseTable";
import RequestedNFTLicenseTable from "@/components/adminDashboardComponents/purchasednftlicense/RequestedNFTLicenseTable";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";
export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function PurchasedNftLicense() {
  const [displaynftrequestedTable, setDisplaynftrequestedTable] =
    useState(true);

  return (
    <div className="PurchasedNftLicenseContainer">
      <div className="PurchasedNftLicenseInner">
        <div className="title">
          <h1>Claimmed Network Rewards</h1>
        </div>
        <div className="PurchasedNftLicenseMain">
          <div className="tabsContainer">
            <ul className="mb-3 nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setDisplaynftrequestedTable(true);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displaynftrequestedTable && "active"}`}
                >
                  Requested
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplaynftrequestedTable(false);
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${
                    !displaynftrequestedTable && "active"
                  }`}
                >
                  Purchased
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {displaynftrequestedTable ? (
                <RequestedNFTLicenseTable />
              ) : (
                <PurchasedNFTLicenseTable />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchasedNftLicense;
PurchasedNftLicense.PageLayout = AdminDashboardLayout;
