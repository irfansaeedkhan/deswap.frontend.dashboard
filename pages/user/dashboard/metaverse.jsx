import React, { useMemo, useState } from "react";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import AgencyCard from "@/components/userDashboardComponents/metaverse/AgencyCard";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import NodataCard from "@/components/reusables/NodataCard";

const VolumeTypedata = [
  { id: 0, label: "Total Volume" },
  { id: 1, label: "Some Volume" },
];

const agencies = [
  {
    id: "ag-1",
    name: "Octagon Estates",
    image: "/images/auctionnft.png",
    volume: 1840000,
  },
  {
    id: "ag-2",
    name: "Deswap Realty",
    image: "/images/auctionnft.png",
    volume: 1525000,
  },
  {
    id: "ag-3",
    name: "Polygon Villas",
    image: "/images/auctionnft.png",
    volume: 1284000,
  },
  {
    id: "ag-4",
    name: "NFT License Homes",
    image: "/images/auctionnft.png",
    volume: 996000,
  },
  {
    id: "ag-5",
    name: "Octagon Residences",
    image: "/images/auctionnft.png",
    volume: 875000,
  },
  {
    id: "ag-6",
    name: "Liquid City Brokers",
    image: "/images/auctionnft.png",
    volume: 742000,
  },
  {
    id: "ag-7",
    name: "Meta Real License Co",
    image: "/images/auctionnft.png",
    volume: 618000,
  },
  {
    id: "ag-8",
    name: "Octagon Towers",
    image: "/images/auctionnft.png",
    volume: 504000,
  },
  {
    id: "ag-9",
    name: "DeFi Property Group",
    image: "/images/auctionnft.png",
    volume: 389000,
  },
  {
    id: "ag-10",
    name: "Stablecoin Suites",
    image: "/images/auctionnft.png",
    volume: 271000,
  },
  {
    id: "ag-11",
    name: "Octagon Land Bank",
    image: "/images/auctionnft.png",
    volume: 158000,
  },
  {
    id: "ag-12",
    name: "Metaverse Flats DAO",
    image: "/images/auctionnft.png",
    volume: 94000,
  },
];

function Metaverse() {
  const [query, setQuery] = useState("");
  const [volumeSort, setVolumeSort] = useState("Total Volume");
  const [gridCols, setGridCols] = useState(3);

  const visibleAgencies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = agencies.filter((agency) =>
      needle ? agency.name.toLowerCase().includes(needle) : true
    );
    const sorted = [...filtered].sort((a, b) =>
      volumeSort === "Some Volume" ? a.volume - b.volume : b.volume - a.volume
    );
    return sorted;
  }, [query, volumeSort]);

  return (
    <div className="MetaContainer">
      <div className="MetaInner">
        <div className="title">
          <h1>Real Estate Agencies</h1>
        </div>
        <div className="filterContainer">
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Seach Agency..."
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="searchIcon">
              <Searchicon />
            </div>
          </div>
          <div className="volumeDropDownContainer">
            <Dropdown
              data={VolumeTypedata}
              placeholder="Total Volume"
              getDropdownValue={setVolumeSort}
            />
          </div>
          <div className="viewIconsContainer">
            <button
              type="button"
              className={`gridViewBtn ${gridCols === 2 ? "active" : ""}`}
              onClick={() => setGridCols(2)}
              aria-label="Two column grid"
            >
              <Image
                src={"/images/grid4icon.svg"}
                width={24}
                height={24}
                alt="grid icon"
                loading="lazy"
              />
            </button>
            <button
              type="button"
              className={`gridViewBtn ${gridCols === 3 ? "active" : ""}`}
              onClick={() => setGridCols(3)}
              aria-label="Three column grid"
            >
              <Image
                src={"/images/grid9icon.svg"}
                width={24}
                height={24}
                alt="grid icon"
                loading="lazy"
              />
            </button>
          </div>
        </div>

        <div className={`agencyCardList grid${gridCols}`}>
          {visibleAgencies.length === 0 ? (
            <NodataCard />
          ) : (
            visibleAgencies.map((agency) => (
              <AgencyCard
                key={agency.id}
                name={agency.name}
                image={agency.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Metaverse;
Metaverse.PageLayout = UserDashboardLayout;

