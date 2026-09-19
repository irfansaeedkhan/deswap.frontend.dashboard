import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import dynamic from "next/dynamic";
//import WalletConnectButton from "@/components/reusables/walletConnectButton";
const WalletConnectButton = dynamic(
  () => import("@/components/reusables/walletConnectButton"),
  {
    ssr: false,
  }
);
import {
  SearchIcon,
  Pprofile,
  Pfavourite,
  PCollection,
  PAdmin,
  PSetting,
  Plogout,
  PTicktok,
  PInsta,
  PTwitter,
  PFB,
} from "@/components/marketPlace/MarketIcons";

const AdminDashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};

function MarketNavbar() {
  const router = useRouter();
  const [toggleProfileState, setToggleProfileState] = useState(false);
  const [toggleCreateState, settoggleCreateState] = useState(false);
  const toggleProfile = async () => {
    setToggleProfileState((prev) => !prev);
  };
  const toggleCreate = async () => {
    settoggleCreateState((prev) => !prev);
  };
  return (
    <div className="MarketNavbar">
      <div className="MarketNavbarInner adminDashboard">
        <div className="logoDesktop">
          <Image
            width={152}
            height={34}
            src={"/images/logo.png"}
            alt={"logo"}
          />
        </div>
        <div className="mobileDashboardBurgerBox">
          <div className="logo mobile">
            <a href="https://deswap.co/">
              <Image
                width={800}
                height={600}
                src="/images/logoicon.png"
                alt="Deswap Logo"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </a>
          </div>
          <div
            className="hamburger"
            onClick={() => AdminDashboardNavbarToggle()}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </div>
        <div className="searchContainer">
          <input type="text" placeholder="Search" />
          <div className="searchIcon">
            <SearchIcon />
          </div>
        </div>
        <div className="linkBox">
          <div className="createBtnContainer">
            <div className="reportdots">
              <button className="btnHoverEffectOutline" onClick={toggleCreate}>
                Create
              </button>
              <div className={`toggleList ${toggleCreateState && "show"}`}>
                <Link legacyBehavior href="/market/createnft">
                  <a className={`reportBtn`}>Create Item</a>
                </Link>
                <Link legacyBehavior href="/market/createcollection">
                  <a className={`reportBtn`}>Create collection</a>
                </Link>
              </div>
            </div>
          </div>

          {/* {router.pathname == "/" && (
            <div className="saveBtnContainer">
              <button
                className="btnHoverEffectOutline"
                onClick={ShowCreatNewPackFunction}
              >
                <Image
                  width={24}
                  height={24}
                  src="/images/createicon.png"
                  alt="add icon"
                />
                <p>Create</p>
              </button>
            </div>
          )} */}

          <div className="textBox">
            <WalletConnectButton></WalletConnectButton>
            {/*<SimpleButton
            text="Log Out"
            color="#E44757"
            maxWidth="28.3rem"
            backgroundColor="rgba(228, 71, 87, 0.12)"
            padding="1rem 3rem"
          />*/}
          </div>
          <div
            className={`linkBoxImg adminAvatar toggleProfile ${
              toggleProfileState && "active"
            }`}
          >
            <button>
              <Image
                src={"/images/userIcon.png"}
                width={32}
                height={32}
                alt="Avatar profile pic"
                onClick={toggleProfile}
              />
            </button>
            <div className={`toggleList ${toggleProfileState && "show"}`}>
              <button className={`profileBtn`}>
                <Pprofile /> Profile
              </button>
              <button className={`profileBtn`}>
                <Pfavourite /> Favorites
              </button>
              <button className={`profileBtn`}>
                <PCollection /> My Collection
              </button>
              <button className={`profileBtn`}>
                <PAdmin /> Swith To Admin
              </button>
              <button className={`profileBtn`}>
                <PSetting /> Settings
              </button>
              <button className={`profileBtn`}>
                <Plogout /> Log Out
              </button>

              <div className="bottomSocialContainer">
                <div className="socialicon">
                  <PFB />
                </div>
                <div className="socialicon">
                  <PTwitter />
                </div>
                <div className="socialicon">
                  <PInsta />
                </div>
                <div className="socialicon">
                  <PTicktok />
                </div>
              </div>
            </div>
          </div>
          <div className="linkBoxImg adminAvatar">
            <button>
              <Image
                src={"/images/WalletIcon.png"}
                width={32}
                height={32}
                alt="avatar pic"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketNavbar;
