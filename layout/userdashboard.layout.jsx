import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// import DashboardNavbar from "@/components/userDashboardComponents/navbar/DashboardNavbar";
// import DashboardMobileSidebar from "@/components/userDashboardComponents/sidebar/DashboardMobileSidebar";
// import DashboardSidebar from "@/components/userDashboardComponents/sidebar/DashboardSidebar";
// import CreateTokenCard from "@/components/userDashboardComponents/tokens/CreateTokenCard";
// import Modal from "@/components/reusables/Modal";

export function UserDashboardLayout({ children }) {
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

  useEffect(() => {
    /*
    document.onkeydown = function(e) {
      if(e.keyCode == 123) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
         return false;
      }
    };
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });*/
  }, []);

  const DynamicDashboardSidebar = dynamic(
    () =>
      import("@/components/userDashboardComponents/sidebar/DashboardSidebar"),
    {
      suspense: true,
    }
  );
  const DynamicDashboardMobileSidebar = dynamic(
    () =>
      import(
        "@/components/userDashboardComponents/sidebar/DashboardMobileSidebar"
      ),
    {
      suspense: true,
    }
  );
  const DynamicDashboardNavbar = dynamic(
    () => import("@/components/userDashboardComponents/navbar/DashboardNavbar"),
    {
      suspense: true,
    }
  );
  const DynamicModal = dynamic(() => import("@/components/reusables/Modal"), {
    suspense: true,
  });
  const DynamicCreateTokenCard = dynamic(
    () => import("@/components/userDashboardComponents/tokens/CreateTokenCard"),
    {
      suspense: true,
    }
  );
  return (
    <div className="DashboardLayout User">
      <div className="DashboardLayoutInner">
        <div className="sidebar">
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicDashboardSidebar />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicDashboardMobileSidebar />
          </Suspense>
          {/* <DashboardSidebar />
          <DashboardMobileSidebar /> */}
        </div>
        <div className="mainContent">
          <div className="DashboardNavbarContainer">
            {/* <DashboardNavbar
              ShowCreateTokenFunction={ShowCreateTokenFunction}
            /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicDashboardNavbar
                ShowCreateTokenFunction={ShowCreateTokenFunction}
              />
            </Suspense>
          </div>
          <div className="tabsData">{children}</div>
        </div>
      </div>
      {/* showCreateToken modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicModal
          show={showCreateToken}
          cross={false}
          modaltitle="Create Token"
          onClose={() => setShowCreateToken(false)}
        >
          <div className="createTokenCard">
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicCreateTokenCard
                closeModal={closeModal}
                onSubmit={onSubmit}
              />
            </Suspense>
          </div>
        </DynamicModal>
      </Suspense>
    </div>
  );
}
