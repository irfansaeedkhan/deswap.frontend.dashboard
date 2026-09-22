import React, { useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import DashboardNavbar from "@/components/userDashboardComponents/navbar/DashboardNavbar";
import DashboardMobileSidebar from "@/components/userDashboardComponents/sidebar/DashboardMobileSidebar";
import DashboardSidebar from "@/components/userDashboardComponents/sidebar/DashboardSidebar";
import CreateTokenCard from "@/components/userDashboardComponents/tokens/CreateTokenCard";
import Modal from "@/components/reusables/Modal";
import { usePrefetchDashboardRoutes } from "@/utils/dashboard/prefetchRoutes";

config.autoAddCss = false;

export function UserDashboardLayout({ children }) {
  usePrefetchDashboardRoutes("user");
  const [showCreateToken, setShowCreateToken] = useState(false);
  const closeModal = () => {
    setShowCreateToken(false);
  };
  const onSubmit = (data) => {
    if (data) {
      setShowCreateToken(false);
    }
  };
  const ShowCreateTokenFunction = () => {
    setShowCreateToken(true);
  };

  return (
    <div className="DashboardLayout User">
      <Head>
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>
      <div className="DashboardLayoutInner">
        <div className="sidebar">
          <DashboardSidebar />
          <DashboardMobileSidebar />
        </div>
        <div className="mainContent">
          <div className="DashboardNavbarContainer">
            <DashboardNavbar
              ShowCreateTokenFunction={ShowCreateTokenFunction}
            />
          </div>
          <main className="tabsData">{children}</main>
        </div>
      </div>
      <Modal
        show={showCreateToken}
        cross={false}
        modaltitle="Create Token"
        onClose={() => setShowCreateToken(false)}
      >
        <div className="createTokenCard">
          <CreateTokenCard closeModal={closeModal} onSubmit={onSubmit} />
        </div>
      </Modal>
    </div>
  );
}
