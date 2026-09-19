import React, { useState, useEffect } from "react";
import SwapGraphComponent from "@/components/userDashboardComponents/buydeswaptoken/SwapGraphComponent";
import SwapTokenComponent from "@/components/userDashboardComponents/buydeswaptoken/SwapTokenComponent";
import { clearAllInterval } from "../../../utils/common/interval";
import Head from "next/head";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

function Buydeswaptoken() {
  const [toggleGraph, setToggleGraph] = useState(false);

  useEffect(async () => {
    await clearAllInterval();
  }, []);

  const toggleGraphView = () => {
    if (toggleGraph) {
      setToggleGraph(false);
    } else {
      setToggleGraph(true);
    }
  };
  return (
    <div className="buydtkContainer">
      <Head>
        <title>Buy Deswap</title>
      </Head>
      <div className="buydtkInner">
        <div className="title">
          <h1>Buy Deswap Token</h1>
        </div>
        <div className="buydtkMain">
          <div className="swapContainer bg-gray-250">
            <div className={`swapInner ${toggleGraph && "togglegraph"}`}>
              {!toggleGraph && <SwapGraphComponent />}
              <SwapTokenComponent toggleGraphView={toggleGraphView} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buydeswaptoken;
Buydeswaptoken.PageLayout = UserDashboardLayout;

export async function getServerSideProps(ctx) {
  try {
    const { checkUserAuth } = require("../../../utils/auth/userauth");
    return await checkUserAuth(ctx);
  } catch (e) {
    return { props: { users: { uservalid: false } } };
  }
}
