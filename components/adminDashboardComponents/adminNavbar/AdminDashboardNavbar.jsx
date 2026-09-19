import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import WalletConnectButtonAdmin from "@/components/reusables/walletConnectButtonAdmin";

const AdminDashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};
function AdminDashboardNavbar({
  ShowAddNFTLicenseFunction,
  ShowAddLevelFunction,
  ShowAddNewLevelFunction,
  ShowAddCategoryFunction,
  ShowAddDeswapPackFunction,
}) {
  const router = useRouter();

  return (
    <div className="DashboardNavbarInner adminDashboard">
      <div className="title">
        <h1>
          {router.pathname == "/admin/dashboard" && "Dashboard"}
          {router.pathname == "/admin/dashboard/addnftlicense" &&
            "Add NFT License"}
          {router.pathname == "/admin/dashboard/addclamingpack" &&
            "Deswap Pack"}
          {router.pathname == "/admin/dashboard/useraccount" && "User Account"}
          {router.pathname == "/admin/dashboard/companylist" && "Company List"}
          {router.pathname == "/admin/dashboard/companyfee" &&
            "Company Fee List"}
          {router.pathname == "/admin/dashboard/publickeyfee" &&
            "Publickey Fee List"}
          {router.pathname == "/admin/dashboard/companyrewards" &&
            "Company Network Rewards List"}
          {router.pathname == "/admin/dashboard/networkrewards" &&
            "Network Rewards"}
          {router.pathname == "/admin/dashboard/claimmednetworkrewards" &&
            "Claimmed Network Rewards"}
          {router.pathname == "/admin/dashboard/purchasednftlicense" &&
            "Purchased NFT License"}
          {router.pathname == "/admin/dashboard/swapmatictodaw" &&
            "Swap Matic To DAW"}
          {router.pathname == "/admin/dashboard/claimmedpack" &&
            "Claimmed Pack"}
          {router.pathname == "/admin/dashboard/userregistrationfee" &&
            "User Registration Fee"}
          {router.pathname == "/admin/dashboard/networkrewardssetting" &&
            "Network Rewards Setting"}
          {router.pathname == "/admin/dashboard/upline" && "Upline"}
          {router.pathname == "/admin/dashboard/downline" && "Downline"}
          {router.pathname == "/admin/dashboard/usersinformationpanel" &&
            "Users Information Panel"}
          {router.pathname == "/admin/dashboard/usersinfodetails" &&
            "User Info Details"}
          {router.pathname == "/admin/dashboard/userdetail" &&
            "alessandroveronezi"}
        </h1>
        {router.pathname == "/admin/dashboard/userdetail" && (
          <h2>
            <span>User Account/</span> alessandroveronezi
          </h2>
        )}
      </div>
      <div className="mobileDashboardBurgerBox">
        <div className="logo mobile">
          <a href="https://deswap.co/">
            <Image
              width={800}
              height={600}
              src="/images/logoicon.png"
              alt="Deswap Logo"
              loading="lazy"
             style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </a>
        </div>
        <div className="hamburger" onClick={() => AdminDashboardNavbarToggle()}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
      <div className="linkBox">
        {router.pathname == "/admin/dashboard/userdetail" && (
          <div className="saveBtnContainer">
            <button className="btnHoverEffectOutline">
              <Image
                width={24}
                height={24}
                src="/images/save.png"
                alt="add icon"
                loading="lazy"
              />
              <p>Save</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/addnftlicense" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowAddNFTLicenseFunction}
            >
              <Image
                width={24}
                height={24}
                src="/images/createicon.png"
                alt="add icon"
                loading="lazy"
              />
              <p>Add New License</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/createlevel" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowAddLevelFunction}
            >
              <Image
                width={24}
                height={24}
                src="/images/createicon.png"
                alt="add icon"
                loading="lazy"
              />
              <p>Add New Level</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/createcompanycategory" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowAddCategoryFunction}
            >
              <Image
                width={24}
                height={24}
                src="/images/createicon.png"
                alt="add icon"
                loading="lazy"
              />
              <p>Add New Category</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/addclamingpack" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowAddDeswapPackFunction}
            >
              <Image
                width={24}
                height={24}
                src="/images/createicon.png"
                alt="add icon"
                loading="lazy"
              />
              <p> Deswap Pack</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/networkrewardssetting" && (
          <div className="saveBtnContainer">
            <button
              className="btnHoverEffectOutline"
              onClick={ShowAddNewLevelFunction}
            >
              <Image
                width={24}
                height={24}
                src="/images/createicon.png"
                alt="add icon"
                loading="lazy"
              />
              <p>Add New Level</p>
            </button>
          </div>
        )}
        <div className="textBox adminName">
          <h5>admin.1</h5>
        </div>

        <div className="linkBoxImg adminAvatar">
          <Image
            src={"/images/adminAvatar.png"}
            width={40}
            height={40}
            alt="admin Avatar"
            loading="lazy"
          />
        </div>
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
      </div>
    </div>
  );
}
/*
export default AdminDashboardNavbar;
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import SMLogo from "@/assets/images/icons/logoicon.png";
const AdminDashboardNavbarToggle = () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const body = document.querySelector("body");
  sidebar.classList.toggle("open");
  body.classList.toggle("open");

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
};
function AdminDashboardNavbar({ShowCreatNewPackFunction , ShowAddNFTLicenseFunction, ShowAddDeswapPackFunction}) {
  const router = useRouter();

  return (
    <div className="DashboardNavbarInner adminDashboard">
      <div className="title">
        <h1>
          {router.pathname == "/admin/dashboard" && "Dashboard"}
          {router.pathname == "/admin/dashboard/addnftlicense" && "Add NFT License"}
          {router.pathname == "/admin/dashboard/addclamingpack" && "Deswap Pack"}
          {router.pathname == "/admin/dashboard/useraccount" && "User Account"}
          {router.pathname == "/admin/dashboard/usersinfo" && "Users Info"}
          {router.pathname == "/admin/dashboard/packs" && "Packs"}
          {router.pathname == "/admin/dashboard/userdetail" &&
            "alessandroveronezi"}
        </h1>
        {router.pathname == "/admin/dashboard/userdetail" && (
          <h2>
            <span>User Account/</span> alessandroveronezi
          </h2>
        )}
      </div>
      <div className="mobileDashboardBurgerBox">
        <div className="logo mobile">
          <a href="https://deswap.co/">
          <Image  width={800} height={600}    src="/images/logoicon.png" alt="Deswap Logo"  style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </a>
        </div>
        <div className="hamburger" onClick={() => AdminDashboardNavbarToggle()}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
      <div className="linkBox">
        {router.pathname == "/admin/dashboard/userdetail" && (
          <div className="saveBtnContainer">
            <button className="btnHoverEffectOutline">
              <Image  width={24} height={24} src="/images/save.png" alt="add icon" />
              <p>Save</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/packs" && (
          <div className="saveBtnContainer">
            <button
            className="btnHoverEffectOutline"
              onClick={ShowCreatNewPackFunction}
            >
              <Image  width={24} height={24} src="/images/createicon.png" alt="add icon" />
              <p>Create</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/addnftlicense" && (
          <div className="saveBtnContainer">
            <button
            className="btnHoverEffectOutline"
              onClick={ShowAddNFTLicenseFunction}
            >
               <Image  width={24} height={24} src="/images/createicon.png" alt="add icon" />
              <p>Add New License</p>
            </button>
          </div>
        )}
        {router.pathname == "/admin/dashboard/addclamingpack" && (
          <div className="saveBtnContainer">
            <button
            className="btnHoverEffectOutline"
              onClick={ShowAddDeswapPackFunction}
            >
               <Image  width={24} height={24} src="/images/createicon.png" alt="add icon" />
              <p> Deswap Pack</p>
            </button>
          </div>
        )}
        <div className="textBox adminName">
          <h5>admin.1</h5>
        </div>
        <div className="linkBoxImg adminAvatar">
          <Image src={"/images/adminAvatar.png"}  width={40} height={40} alt="admin Avatar" />

        </div>
        <div className="linkBoxButton">
          <SimpleButton
            text="Log Out"
            color="#E44757"
            maxWidth="28.3rem"
            backgroundColor="rgba(228, 71, 87, 0.12)"
            padding="1rem 3rem"
          />
        </div>
      </div>
    </div>
  );
}*/

export default AdminDashboardNavbar;
