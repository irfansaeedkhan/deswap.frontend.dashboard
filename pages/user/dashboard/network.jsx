import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Modal from "@/components/reusables/Modal";
import OverviewTab from "@/components/userDashboardComponents/overviewTab/OverviewTab";
import RewardTab from "@/components/userDashboardComponents/networkRewardsTab/RewardTab";
import { clearAllInterval } from "../../../utils/common/interval";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

function Network({ users }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [key, setKey] = useState("Overview");
  const setTabUpgrade = () => {
    setKey("License");
  };
  const setTabRewards = () => {
    setKey("Rewards");
  };

  useEffect(() => {}, []);
  return (
    <div className="networkContainer">
      <Head>
        <title>Network</title>
      </Head>
      <div className="networkInner">
        <div className="title">
          <h1>Network</h1>
        </div>
        <div className="networkMain">
          <div className="tabsContainer">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="Overview" title="Overview">
                <OverviewTab
                  setTabUpgrade={setTabUpgrade}
                  setTabRewards={setTabRewards}
                  users={users}
                />
              </Tab>
              <Tab eventKey="Rewards" title="Rewards">
                <RewardTab />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      {/* success modal */}
      <Modal
        show={showSuccess}
        cross={true}
        onClose={() => setShowSuccess(false)}
      >
        <h1>dfdf</h1>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}
export default Network;
Network.PageLayout = UserDashboardLayout;
