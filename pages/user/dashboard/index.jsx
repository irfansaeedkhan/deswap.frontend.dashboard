import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
import Image from "next/image";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import axios from "../../../utils/common/axios";
import { reducedWalletAddress } from "../../../utils/common/walletaddress";
import { clearAllInterval } from "../../../utils/common/interval";
import { convertToEuro } from "../../../utils/common/currencyconversion";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";
// import Modal from "@/components/reusables/Modal";
// import NetworkRewards from "@/components/userDashboardComponents/dashboard/networkrewards";
// import ClaimmedPack from "@/components/userDashboardComponents/dashboard/claimmedpack";
// import ActivePack from "@/components/userDashboardComponents/dashboard/activepack";

// Modal
// NetworkRewards
// ClaimmedPack
// ActivePack
const DynamicModal = dynamic(() => import("@/components/reusables/Modal"), {
  suspense: true,
});
const DynamicNetworkRewards = dynamic(
  () => import("@/components/userDashboardComponents/dashboard/networkrewards"),
  {
    suspense: true,
  }
);
const DynamicClaimmedPack = dynamic(
  () => import("@/components/userDashboardComponents/dashboard/claimmedpack"),
  {
    suspense: true,
  }
);
const DynamicActivePack = dynamic(
  () => import("@/components/userDashboardComponents/dashboard/activepack"),
  {
    suspense: true,
  }
);

// form validations
const schema = Joi.object({
  username: Joi.string().required().min(4).label("username").messages({
    "string.empty": `Username Required`,
    "any.required": `Required Field`,
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: {} })
    .required()
    .messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
    }),
  password: Joi.string().required().min(4).label("password").messages({
    "string.empty": `Password Required`,
    "any.required": `Required Field`,
  }),
});


function Dashboard({ users }) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [userCredentials, setUserCredentials] = useState({});
  const [totalDeswap, settotalDeswap] = useState("0,0");
  const [totalUSD, settotalUSD] = useState("0,0");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [profileData, setProfileData] = useState({
    emailid: "",
    username: "",
    walletaddress: "",
  });
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const fetchDeswapConverionRate = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/deswaptodollar`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let conversion = result?.data?.conversion;
      conversion = await SanitizeRequestString(conversion);
      return conversion;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      return 0;
    }
  };

  const fetchTotalRewards = async () => {
    try {
      let totalRewards = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/purchasedpack/fetch/data`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let rewardsData = totalRewards?.data?.data;
      rewardsData = await SanitizeRequestObject(rewardsData);
      let totalRewardsToUpdate = 0;
      if (rewardsData.avaible.length > 0) {
        totalRewardsToUpdate = rewardsData.avaible[0].totalrewards;
        totalRewardsToUpdate = rewardsData.avaible[0].totalbonousrewards;
      }
      if (rewardsData.locked.length > 0) {
        totalRewardsToUpdate = rewardsData.locked[0].totalrewards;
      }
      await settotalDeswap(convertToEuro(totalRewardsToUpdate.toFixed(2)));
      let dawconversion = await fetchDeswapConverionRate();
      let valueInUSD = dawconversion * totalRewardsToUpdate;
      await settotalUSD(convertToEuro(valueInUSD.toFixed(2)));
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to fetch rewards ", e);
      settotalDeswap("0,00");
      settotalUSD("0,00");
    }
  };

  const fetchUsers = async () => {
    try {
      const sanData = await SanitizeRequestObject(users);
      //Issue is here
      let encryptionData = await encryptRequestBody(sanData);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/getUserCredentials`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      const cred = await SanitizeRequestObject(data.UserCredentails);
      setUserCredentials(cred);
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("error fetching user credentails :", error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchTotalRewards();
  }, []);

  const onSubmit = (data) => {
    setShowProfile(false);
    // if (data) {
    //   setShowProfile(true);
    // }
  };
  const fetchProfileData = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let profileData = result?.data?.data;
      profileData = await SanitizeRequestObject(profileData);
      setProfileData({
        emailid: profileData.emailid,
        username: profileData.username,
        walletaddress:
          profileData.walletaddress[profileData.walletaddress.length - 1],
      });
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log(e);
    }
  };
  useEffect(() => {
    const readUrl = document.getElementById("readUrl");
    if (readUrl) {
      readUrl.addEventListener("change", function () {
        if (this.files[0]) {
          var picture = new FileReader();
          picture.readAsDataURL(this.files[0]);
          picture.addEventListener("load", function (event) {
            const uploaded = document.getElementById("uploadedImage");
            if (uploaded) {
              uploaded.setAttribute("srcset", event.target.result);
            }
          });
        }
      });
    }
    fetchProfileData();
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(profileData.walletaddress);
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardInner">
        <div className="title">
          <h1>Dashboard</h1>
        </div>
        <div className="dashboardMain">
          <div className="leftSide">
            {/* profile card */}
            <div className="profileCardContainer">
              <div className="ImageCardContainer">
                <div className="imageCard">
                  <div className="imageContainer">
                    <Image
                      src={"/images/avatar.png"}
                      width={88}
                      height={88}
                      alt="profile img"
                      loading="lazy"
                    />
                  </div>
                  <div className="imgData">
                    <div className="imageDescription">
                      <h6>
                        {userCredentials?.username
                          ? userCredentials.username
                          : "N/A"}
                      </h6>
                      <p>
                        {userCredentials?.emailid
                          ? userCredentials.emailid
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {profileData?.walletaddress && (
                <div className="DescriptionCardContainer">
                  <h6>Wallet Address</h6>
                  <div className="copyaddContainer">
                    <p>
                      {userCredentials &&
                        reducedWalletAddress(profileData.walletaddress)}
                    </p>
                    <button className="copyBtn" onClick={copy}>
                      <div className="copyImgIcon">
                        <CopyIcon />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* YourDSwapContainer */}
            <div className="YourDSwapContainer">
              <div className="title">
                <h2>Your Deswap</h2>
              </div>
              <div className="subTitle">
                <div className="imgContainer">
                  <Image
                    src={"/images/logoicon.png"}
                    width={32}
                    height={32}
                    alt="logoicon"
                    loading="lazy"
                  />
                </div>
                <h3>{totalDeswap} DAW</h3>
                <p>~$ {totalUSD}</p>
              </div>
              {/* locked */}
              <Suspense fallback={<div>Loading...</div>}>
                <DynamicActivePack></DynamicActivePack>
              </Suspense>
              {/*<div className="DSwapLocked">
                <h3>Your Deswap Locked</h3>
                <div className="DSwapLockedTable customScroll">
                  <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                      <tr>
                        <th>Amount(DAW)</th>
                        <th>Unclock Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>6,250</td>
                        <td>In 12 Months</td>
                        <td>
                          <button className="locked btnHoverEffectOutline">Locked</button>
                        </td>
                      </tr>
                      <tr>
                        <td>30,250</td>
                        <td>In 12 Months</td>
                        <td>
                          <button className="locked btnHoverEffectOutline">Locked</button>
                        </td>
                      </tr>
                      <tr>
                        <td>80,250</td>
                        <td>10 Months Ago</td>
                        <td>
                          <button className="locked btnHoverEffectOutline">Locked</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>*/}
              {/* TransactionHistory */}
              <Suspense fallback={<div>Loading...</div>}>
                <DynamicClaimmedPack></DynamicClaimmedPack>
              </Suspense>
              {/*<div className="TransactionHistory">
                <h3>Transaction History</h3>
                <div className="TransactionHistoryTable customScroll">
                  <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                      <tr>
                        <th>Amount(DAW)</th>
                        <th>Price(USDC)</th>
                        <th>Contract</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>6,250</td>
                        <td className="price">
                          <p>1,000</p>
                          <p>Bonus 25%</p>
                        </td>
                        <td>0xa94e...639c</td>
                        <td className="timestamp">
                          <p>2021.11.23</p>
                          <p>15:48:26</p>
                        </td>
                      </tr>
                      <tr>
                        <td>6,250</td>
                        <td className="price">
                          <p>1,000</p>
                          <p>Bonus 25%</p>
                        </td>
                        <td>0xa94e...639c</td>
                        <td className="timestamp">
                          <p>2021.11.23</p>
                          <p>15:48:26</p>
                        </td>
                      </tr>
                      <tr>
                        <td>6,250</td>
                        <td className="price">
                          <p>1,000</p>
                          <p>Bonus 25%</p>
                        </td>
                        <td>0xa94e...639c</td>
                        <td className="timestamp">
                          <p>2021.11.23</p>
                          <p>15:48:26</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>*/}
            </div>
          </div>
          <div className="rightSide">
            <div className="buynowContainer">
              <div className="buynowContainerInner">
                <div className="coinsContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/coins2.png"
                    alt="coins icons"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />
                </div>
                <div className="content">
                  <h1>Buy Deswap With Bonus Up To 100%</h1>
                  <SimpleButton
                    backgroundColor="#E44757"
                    text="Buy Now"
                    onClick={() => router.push("/user/dashboard/buydswap")}
                  />
                </div>
              </div>
            </div>

            {/* DistributionContainer */}
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicNetworkRewards></DynamicNetworkRewards>
            </Suspense>
            {/*<div className="DistributionContainer">
              <h3>Distribution</h3>
              <div className="DistributionContainerTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th>Holders</th>
                      <th>Amount(DAW)</th>
                      <th>Unclock Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="Unlocked">Unlocked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="Unlocked">Unlocked</button>
                      </td>
                    </tr>
                    <tr>
                      <td>0x7c73...fd49</td>
                      <td>6,250</td>
                      <td>In 12 Months</td>
                      <td>
                        <button className="Unlocked">Unlocked</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="viewAll">
                <button>View All</button>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
      {/* showProfile modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicModal
          show={showProfile}
          cross={true}
          onClose={() => setShowProfile(false)}
        >
          <div className="editProfileForm">
            <h2>Edit Profile</h2>
            <div className="profileImgContainer">
              <div className="avatarimg">
                <Image
                  src={"/images/avatar.png"}
                  width={120}
                  height={120}
                  alt="Uploaded Image"
                  id="uploadedImage"
                  loading="lazy"
                />
                {/* <img src={profileavatar.src} alt="Uploaded Image" id="uploadedImage"   accept="image/png, image/jpeg" /> */}
              </div>

              <div className="uploadBtn">
                <input type="file" id="readUrl" />
                <div className="cameraimg">
                  <Image
                    src={"/images/Camera.png"}
                    width={24}
                    height={24}
                    alt="camera icon"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="inputsList">
              <form method="post" autoComplete="new-off">
                <div className="formInputs">
                  <input
                    role="presentation"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                    {...register("username")}
                    error={formState.errors.username && "true"}
                    autoComplete="off"
                  />
                  {formState.errors.username && (
                    <p>{formState.errors.username.message}</p>
                  )}
                </div>
                <div className="formInputs">
                  <input
                    role="presentation"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    error={formState.errors.email && "true"}
                    autoComplete="off"
                  />
                  {formState.errors.email && (
                    <p>{formState.errors.email.message}</p>
                  )}
                </div>
                <div className="passwordContainer">
                  <div className="formInputs">
                    <input
                      id="password"
                      name="password"
                      type={passwordShown ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="off"
                      {...register("password")}
                      error={formState.errors.password && "true"}
                    />
                    {formState.errors.password && (
                      <p>{formState.errors.password.message}</p>
                    )}
                    <i onClick={togglePasswordVisiblity}>
                      {passwordShown ? eyeSlash : eye}
                    </i>
                  </div>

                  <button className="changepw">Change Password</button>
                </div>

                <div className="buttonContainer">
                  <SimpleButton
                    text="Cancel"
                    color="#E44757"
                    backgroundColor="#291719"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfile(false);
                    }}
                    padding="1.6rem 0px"
                  />
                  <SimpleButton
                    backgroundColor="#E44757"
                    text="Save"
                    padding="1.6rem 0px"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </form>
            </div>
          </div>
        </DynamicModal>
      </Suspense>

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

export default Dashboard;
Dashboard.PageLayout = UserDashboardLayout;
