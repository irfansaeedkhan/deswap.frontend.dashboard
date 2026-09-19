import React, { useState, useEffect } from "react";
import ArrowDown from "@/assets/svgAssets/ArrowDown";

function FilterSideBox() {
  const [statusState, setStatusState] = useState(true);
  const [activeCollection, setActiveCollection] = useState("buy");
  const [priceState, setPriceState] = useState(true);

  const statusToggle = () => {
    setStatusState((prev) => !prev);
    setTimeout(() => {
      let over = document.querySelector(".status .contents");
      if (over.classList.contains("active")) {
        over.style.overflow = "initial";
      } else {
        over.style.overflow = "hidden";
      }
    }, 130);
  };

  const priceToggle = () => {
    setPriceState((prev) => !prev);
  };
  return (
    <div className="filterBox">
      <div className="filterBoxInner">
        <div className={`status ${statusState && "active"}`}>
          <div className="titleArrow" onClick={statusToggle}>
            <h6>Status</h6>
            <ArrowDown />
          </div>
          <div className={`contents ${statusState && "active"}`}>
            <div className="contentsInner">
              <button
                className={`SimpleButton btnHoverEffectOutline ${
                  activeCollection == "buy" && "active"
                }`}
                onClick={() => {
                  setActiveCollection("buy");
                }}
              >
                Buy Now
              </button>
              <button
                className={`SimpleButton btnHoverEffectOutline ${
                  activeCollection == "auction" && "active"
                }`}
                onClick={() => {
                  setActiveCollection("auction");
                }}
              >
                Timed Auction
              </button>
            </div>
          </div>
        </div>
        <div className={`price ${priceState && "active"}`}>
          <div className="titleArrow" onClick={priceToggle}>
            <h6>Price</h6>
            <ArrowDown />
          </div>
          <div className="contents">
            <div className="contentsInner">
              <div className="inputBoxContainer">
                <p>Lowest</p>
                <div className="inputBox">
                  <input type="text" placeholder="0" />
                  <h6>Matic</h6>
                </div>
              </div>
              <div className="inputBoxContainer">
                <p>Highest</p>
                <div className="inputBox">
                  <input type="text" placeholder="0" />
                  <h6>Matic</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="filterFooter">
          <button className="SimpleButton btnHoverEffectOutline">Apply</button>
          <button className="SimpleButton btnHoverEffectOutline">
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSideBox;
