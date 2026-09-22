import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import WalletConnectButton from "@/components/reusables/walletConnectButton";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import { setDashboardSearch } from "@/utils/dashboard/searchBus";
const DashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");
  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};
function DashboardNavbar({ ShowCreateTokenFunction }) {
  const router = useRouter();
  const [nftQuery, setNftQuery] = useState("");
  return (
    <div className="DashboardNavbarInner">
      <div className="mobileDashboardBurgerBox">
        <div className="logo mobile">
          <a href="https://deswap.co/">
            {" "}
            <Image
              width={800}
              height={600}
              src="/images/logoicon.png"
              alt="Deswap Logo"
              loading="lazy"
             style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </a>
        </div>
        <div className="hamburger" onClick={() => DashboardNavbarToggle()}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
      {router.pathname == "/user/dashboard/nftlicense" && (
        <div className="searchContainer">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search..."
            value={nftQuery}
            onChange={(e) => {
              setNftQuery(e.target.value);
              setDashboardSearch(e.target.value);
            }}
          />
          <div className="searchIcon">
            <Searchicon />
          </div>
        </div>
      )}

      <div className="linkBox">
        {router.pathname == "/user/dashboard/createtoken" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowCreateTokenFunction}
            >
              <Image
                src={"/images/createicon.png"}
                width={24}
                height={24}
                alt="create icon"
                loading="lazy"
              />
              <p>Create</p>
            </button>
          </div>
        )}
        {router.pathname == "/user/dashboard/buydeswaptoken" ? (
          <div className="textBox"></div>
        ) : (
          <div className="textBox">
            <WalletConnectButton></WalletConnectButton>
          </div>
        )}

        <div className="linkBoxImg flag">
          <Image
            className="linkBoxImg"
            width={32}
            height={32}
            src={"/images/uk.png"}
            alt="ukFlag"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardNavbar;
