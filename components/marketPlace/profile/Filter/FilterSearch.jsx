import React, { useState, useEffect } from "react";
import SimpleButton from "@/components/reusables/SimpleButton";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import DropDownV2 from "@/components/global/DropDownV2";
import { useRouter } from "next/router";
function FilterSearch({ filterToggle, filterState }) {
  const [statusError, setStatusError] = useState(false);

  const getDropdownValue = (value) => {
    setGetStatus(value);
  };

  const sortData = [
    { id: 0, label: "Lowest Price" },
    { id: 1, label: "Highest Price" },
  ];
  const router = useRouter();
  return (
    <div className="filterTopContainer">
      {router.query.tab !== "created" && (
        <SimpleButton
          text={"Filters"}
          backgroundColor={!filterState ? "#333333" : "#ffffff"}
          color={!filterState ? "#858585" : "#0a0a0a"}
          onClick={filterToggle}
        />
      )}

      <div className="searchInput">
        <div className="searchIcon">
          <Searchicon />
        </div>
        <input type="text" placeholder="Search Here" />
      </div>
      <div className="dropdownInput">
        <DropDownV2
          title={"Sort and filters"}
          data={sortData}
          getDropdownValue={getDropdownValue}
          placeholder={sortData[0].label}
        />
        {statusError && <p>{"kindly select the status"}</p>}
      </div>
    </div>
  );
}

export default FilterSearch;
