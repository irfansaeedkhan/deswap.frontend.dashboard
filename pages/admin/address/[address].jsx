import React from "react";
import { useRouter } from "next/router";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

// DEMO ONLY (round 3): explorer links in preview builds resolve inside
// the app when NEXT_PUBLIC_POLYGON_SCANLINK is unset, which produced
// 404s on /admin/address/<wallet>. This page answers those URLs with an
// honest demo view instead of a 404. It performs no chain lookup and
// presents nothing as real on-chain activity.
function DemoAddress() {
  const router = useRouter();
  const address = router.query.address;
  return (
    <div>
      <h1>Demo address</h1>
      <p>
        Address: {address ? String(address) : "N/A"}
      </p>
      <p>
        This is a demo address view. No on-chain lookup is performed in
        this demo, and nothing here is real blockchain activity.
      </p>
      <button type="button" onClick={() => router.back()}>
        Back
      </button>
    </div>
  );
}

export default DemoAddress;
DemoAddress.PageLayout = AdminDashboardLayout;
