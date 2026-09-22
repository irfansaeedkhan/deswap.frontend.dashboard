import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  DashboardIcon,
  UserIcon,
  BuydswapIcon,
  DistributionIcon,
  MyNetworkIcon,
  LicenseIcon,
  LevelIcon,
  CategoryIcon,
  PackIcon,
  BuildingIcon,
  FeeIcon,
  RewardIcon,
  KeyIcon,
  SwapIcon,
  SettingsIcon,
} from "./Iconssvg";
import axios from "@/utils/common/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DemoRoleSwitcher from "@/components/reusables/DemoRoleSwitcher";

function AdminDashboardSidebar() {
  const router = useRouter();
  const handleLogout = async (e) => {
    e.preventDefault();
    router.push("/logout");
  };

  const [navbarinfo, setNavbarinfo] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  // api call
  const fetchnavbarinfoFunc = async () => {
    try {
      setLoadingState(true);
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/navbarinfo`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoadingState(result && false);
      if (result) {
        setNavbarinfo(result?.data?.data);
        setLoadingState(false);
      } else {
        setLoadingState(false);
        console.log("error getting api response");
      }
      setLoadingState(false);
      return result?.data?.data;
    } catch (e) {
      // setNavbarinfo(null)
      console.log(e);
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      setLoadingState(false);
      return 0;
    }
  };

  //   use effect to fetch latest data
  useEffect(() => {
    fetchnavbarinfoFunc();
  }, []);

  return (
    <div className="sidebarContent">
      <div className="imageContainer">
        <Image
          src={"/images/logo.png"}
          width={152}
          height={32}
          alt="logo"
          loading="lazy"
        />
      </div>
      <ul className="sidebar-links">
        <div className="sidebarGroup">
          <li className={router.pathname == "/admin/dashboard" ? "active" : ""}>
            <div className="liIcon">
              {" "}
              <DashboardIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/addnftlicense"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <LicenseIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/addnftlicense">
              <a>Add NFT License</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/createlevel" ? "active" : ""
            }
          >
            <div className="liIcon">
              <LevelIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/createlevel">
              <a>Create Company Reward Level</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/createcompanycategory"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <CategoryIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/createcompanycategory">
              <a>Create Company Category</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/purchasednftlicense"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <DistributionIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/purchasednftlicense">
              <a>Purchased NFT License </a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup">
          <h3>Claimmed Pack</h3>
          <li
            className={
              router.pathname == "/admin/dashboard/addclamingpack"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <PackIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/addclamingpack">
              <a>Add Deswap Packs</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/purchasedpack"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <BuydswapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/purchasedpack">
              <a>
                Purchased Deswap pack{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedPacks || navbarinfo.RequestedPacks == 0
                    ? navbarinfo.RequestedPacks
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/claimmedpack" ? "active" : ""
            }
          >
            <div className="liIcon">
              <RewardIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/claimmedpack">
              <a>
                Deswap pack rewards{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedPurchasedPacks ||
                  navbarinfo.RequestedPurchasedPacks == 0
                    ? navbarinfo.RequestedPurchasedPacks
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup">
          <li
            className={
              router.pathname == "/admin/dashboard/useraccount" ||
              router.pathname == "/admin/dashboard/userdetail"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <UserIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/useraccount">
              <a>Users List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companylist" ? "active" : ""
            }
          >
            <div className="liIcon">
              <BuildingIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companylist">
              <a>Company List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companyfee" ? "active" : ""
            }
          >
            <div className="liIcon">
              <FeeIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companyfee">
              <a>Company Fee List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/companyrewards"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <RewardIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/companyrewards">
              <a>Company Network Rewards List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/publickeyfee" ? "active" : ""
            }
          >
            <div className="liIcon">
              <KeyIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/publickeyfee">
              <a>Publickey Fee List</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/userregistrationfee"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <FeeIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/userregistrationfee">
              <a>User Registration Fee</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/swapmatictodaw"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <SwapIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/swapmatictodaw">
              <a>
                Swap Matic To DAW{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedUserTransactions ||
                  navbarinfo.RequestedUserTransactions == 0
                    ? navbarinfo.RequestedUserTransactions
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
        </div>
        <div className="sidebarGroup">
          <h3>Network</h3>
          <li
            className={
              router.pathname == "/admin/dashboard/networkrewards"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <MyNetworkIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/networkrewards">
              <a>Users Network Rewards</a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/claimmednetworkrewards"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <RewardIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/claimmednetworkrewards">
              <a>
                Claimmed Network Rewards{" "}
                <span className="counterBox">
                  {navbarinfo.RequestedNetworkRewards ||
                  navbarinfo.RequestedNetworkRewards == 0
                    ? navbarinfo.RequestedNetworkRewards
                    : "N/A"}
                </span>
              </a>
            </Link>
          </li>
          <li
            className={
              router.pathname == "/admin/dashboard/networkrewardssetting"
                ? "active"
                : ""
            }
          >
            <div className="liIcon">
              <SettingsIcon />
            </div>
            <Link legacyBehavior href="/admin/dashboard/networkrewardssetting">
              <a>Network Rewards Setting</a>
            </Link>
          </li>
        </div>
        <div></div>

        <li className="logoutList">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <DemoRoleSwitcher />
            <div className="sidebarfooter">
              <div className="footerCardContainer">
                <div className="footerImg">
                  <Image
                    src={"/images/avatar.png"}
                    width={82}
                    height={82}
                    alt="footer profile image"
                    loading="lazy"
                  />
                </div>
                <div className="logOutContent">
                  {/* <h5>0xAbsd...5eb5</h5>
             <h6>Deswap@123@gmail.com</h6> */}
                </div>

                <button
                  onClick={handleLogout}
                  className="logoutBtn SimpleButton btnHoverEffectOutline"
                >
                  <Image
                    src={"/images/logoutIcon.png"}
                    width={20}
                    height={20}
                    alt="logo"
                    loading="lazy"
                  />
                  <p>Logout</p>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default AdminDashboardSidebar;

/*=======
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import logoout from "@/assets/images/dashboard/icons/logout.png";
// import logout from "@/assets/images/dashboard/icons/logout.png";
import { DashboardIcon,UserIcon,BuydswapIcon,DistributionIcon,MyNetworkIcon } from "./Iconssvg";
import axios from "@/utils/common/axios";

function AdminDashboardSidebar() {
  const router = useRouter();
  const handleLogout = async(e) =>{
    e.preventDefault();
    router.push("/logout");
  }
  return (
    <div className="sidebarContent">
      <div className="imageContainer">
        <Image src={logo} alt="logo" />
      </div>
      <ul className="sidebar-links">
        <li className={router.pathname == "/admin/dashboard" ? "active" : ""}>
          <div className="liIcon"> <DashboardIcon /></div>
          <Link legacyBehavior href="/admin/dashboard"><a>Dashboard</a></Link>
        </li>
        <li className={router.pathname == "/admin/dashboard/addnftlicense" ? "active" : ""}>
          <div className="liIcon"> <MyNetworkIcon /></div>
          <Link legacyBehavior href="/admin/dashboard/addnftlicense"><a>Add NFT License</a></Link>
        </li>
        <li className={router.pathname == "/admin/dashboard/addclamingpack" ? "active" : ""}>
          <div className="liIcon"> <MyNetworkIcon /></div>
          <Link legacyBehavior href="/admin/dashboard/addclamingpack"><a>Deswap Pack</a></Link>
        </li>
        <li className={router.pathname == "/admin/dashboard/useraccount" || router.pathname == "/admin/dashboard/userdetail" ? "active" : ""}>
        <div className="liIcon"><BuydswapIcon /></div>
          <Link legacyBehavior href="/admin/dashboard/useraccount"><a>User Account</a></Link>
        </li>
        <li className={router.pathname == "/admin/dashboard/usersinfo" || router.pathname == "/admin/dashboard/userdetail" ? "active" : ""}>
        <div className="liIcon"><BuydswapIcon /></div>
          <Link legacyBehavior href="/admin/dashboard/usersinfo"><a>Users Info</a></Link>
        </li>
        <li className={router.pathname == "/admin/dashboard/packs" ? "active" : ""}>
        <div className="liIcon"><DistributionIcon /></div>
          <Link legacyBehavior href="/admin/dashboard/packs"><a>Packs</a></Link>
        </li>
        <li>
        <div className="sidebarfooter">
        <button onClick={handleLogout}>
        <Image src={logoout} alt="logo"  />
        <p>Log Out</p>
        </button>
      </div>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboardSidebar;
>>>>>>> b76c9c06b07d869603743e00c0b0d2bc4d6001f6
*/
