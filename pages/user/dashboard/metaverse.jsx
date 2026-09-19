import React from "react";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import AgencyCard from "@/components/userDashboardComponents/metaverse/AgencyCard";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";
import Searchicon from "@/assets/svgAssets/SearchIcon";
const VolumeTypedata = [
  { id: 0, label: "Total Volume" },
  { id: 1, label: "Some Volume" },
];
function Metaverse() {
  return (
    <div className="MetaContainer">
      <div className="MetaInner">
        <div className="title">
          <h1>Real Estate Agencies</h1>
        </div>
        {/* filter inputs */}
        <div className="filterContainer">
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Seach Agency..."
              autoComplete="off"
            />
            <div className="searchIcon">
              <Searchicon />
            </div>
          </div>
          <div className="volumeDropDownContainer">
            <Dropdown data={VolumeTypedata} placeholder="Total Volume" />
          </div>
          <div className="viewIconsContainer">
            <Image
              src={"/images/grid4icon.svg"}
              width={24}
              height={24}
              alt="grid icon"
              loading="lazy"
            />
            <Image
              src={"/images/grid9icon.svg"}
              width={24}
              height={24}
              alt="grid icon"
              loading="lazy"
            />
          </div>
        </div>

        {/* agency card list */}
        <div className="agencyCardList">
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
          <AgencyCard />
        </div>
      </div>
    </div>
  );
}

export default Metaverse;
Metaverse.PageLayout = UserDashboardLayout;

export async function getServerSideProps(ctx) {
  try {
    const { checkUserAuth } = require("../../../utils/auth/userauth");
    return await checkUserAuth(ctx);
  } catch (e) {
    return { props: { users: { uservalid: false } } };
  }
}
