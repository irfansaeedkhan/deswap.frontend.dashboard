import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import WalletConnectButtonAdmin from "@/components/reusables/walletConnectButtonAdmin";
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

function AdminMarketNavbar() {
  const router = useRouter();
  const [toggleProfileState, setToggleProfileState] = useState(false);
  const toggleProfile = async () => {
    setToggleProfileState((prev) => !prev);
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
          {/* <div
            className="hamburger"
            onClick={() => AdminDashboardNavbarToggle()}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div> */}
        </div>
        <div className="linkBox">
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
            <WalletConnectButtonAdmin></WalletConnectButtonAdmin>
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

export default AdminMarketNavbar;
