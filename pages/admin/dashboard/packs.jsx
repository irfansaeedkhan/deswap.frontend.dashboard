import React, { useState, useEffect } from "react";
import PackCard from "@/components/adminDashboardComponents/packs/PackCard";
import axios from "@/utils/common/axios";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

// import Pagination from "@/components/reusables/Pagination";
function Packs() {
  const [packCardData, setPackCardData] = useState();

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const data = await SanitizeRequestObject(result.data.data);
      setPackCardData(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="packContainer">
      <div className="packInner">
        <div className="title">
          <h1>Packs</h1>
        </div>
        <div className="packMain">
          <div className="packCardsContainer">
            {packCardData
              ? packCardData.map((cardInfo, index) => {
                  return <PackCard cardInfo={cardInfo} key={index} />;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Packs;
Packs.PageLayout = AdminDashboardLayout;
