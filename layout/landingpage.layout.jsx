import React from "react";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

export function LandingpageLayout({ children }) {
  return (
    <div className="landingpage">
      <Navbar />
      <div
        id={"layoutContainer"}
        onContextMenu={() => {
          return false;
        }}
      >
        {children}
        <Footer />
      </div>
    </div>
  );
}
