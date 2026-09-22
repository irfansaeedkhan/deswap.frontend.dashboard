import React, { useLayoutEffect, useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import DashboardNavbar from "@/components/userDashboardComponents/navbar/DashboardNavbar";
import DashboardMobileSidebar from "@/components/userDashboardComponents/sidebar/DashboardMobileSidebar";
import DashboardSidebar from "@/components/userDashboardComponents/sidebar/DashboardSidebar";
import CreateTokenCard from "@/components/userDashboardComponents/tokens/CreateTokenCard";
import Modal from "@/components/reusables/Modal";
import Loader from "@/components/reusables/loader/Loader";
import { usePrefetchDashboardRoutes } from "@/utils/dashboard/prefetchRoutes";
import { ensureDashboardCss } from "@/utils/dashboard/ensureDashboardCss";

config.autoAddCss = false;

export function UserDashboardLayout({ children }) {
  usePrefetchDashboardRoutes("user");
  const [cssReady, setCssReady] = useState(true);
  useLayoutEffect(() => {
    let cancelled = false;
    const applied = document.querySelector(
      'link[data-deswap-dashboard-css], link[href="/css/dashboard.css"]'
    );
    if (!(applied && applied.sheet)) {
      setCssReady(false);
    }
    ensureDashboardCss().then(() => {
      if (!cancelled) setCssReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
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
    <div
      className="DashboardLayout User"
      style={cssReady ? undefined : { visibility: "hidden" }}
    >
      <Head>
        <link rel="stylesheet" href="/css/dashboard.css" />
      </Head>
      {!cssReady && <Loader title="Loading" />}
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
