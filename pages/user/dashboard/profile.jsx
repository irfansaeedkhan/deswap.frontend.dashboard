import React, { useEffect, useState } from "react";
import Joi from "joi";
import { useRouter } from "next/router";
import Router, { withRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faEye, faEyeSlash, faEdit } from "@fortawesome/free-solid-svg-icons";
import NodataCard from "@/components/reusables/NodataCard";
import SimpleButton from "@/components/reusables/SimpleButton";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
const EditIcon = <FontAwesomeIcon icon={faEdit} />;
import Modal from "@/components/reusables/Modal";
import axios from "@/utils/common/axios";
// import { axiosNodeApi } from "@/utils/common/axios1";
import { encryptRequestBody } from "@/utils/common/jwtToken";
// form validations
// import Loader from "@/components/reusables/loader/Loader";
import { format } from "date-fns";
import { clearAllInterval } from "../../../utils/common/interval";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Total Packs Bougth Graph",
    },
  },
};
export const optionsForRerral = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Total Referral Graph",
    },
  },
};

const labels = [
  "Januaray",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Profile({ users }) {
  const router = useRouter();
  const [showAvatar, setShowAvatar] = useState(false);
  // const [showLoader, setShowLoader] = useState(true);
  const [avatarState, setAvatarState] = useState("");
  const [wallet, setWallet] = useState({
    walletValue: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [showPasswordFrom, setShowPasswordFrom] = useState(false);
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isEmailValid, setEmailIsValid] = useState(false);
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const [userCredentials, setUserCredentials] = useState({});
  const [userNetwork, setUserNetwork] = useState([]);
  const [userSession, setUserSession] = useState([]);

  const [totalPacksPurchased, settotalPackPurchased] = useState(0);
  const [totalReferral, settotalReferral] = useState(0);
  const [monthWiseReferral, setMonthWiseReferral] = useState(0);

  const [monthWisePackPurchased, setMonthWisePackPurcashed] = useState([]);
  const [updateErrorMessage, setupdateErrorMessage] = useState("");
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getData = (year, month, graphName) => {
    let results = [];
    let currentData = [];
    let graphData = [];
    results = graphName === "forPacks" ? totalPacksPurchased : totalReferral;

    for (let index = 0; index < results.length; index++) {
      results[index].created = format(
        new Date(results[index].created_at),
        "d MMMM yyyy"
      );
    }
    for (let index = 0; index < results.length; index++) {
      let getSplitYear = parseInt(results[index].created.split(" ")[2]);
      let getMonth = results[index].created
        .split(" ")[1]
        .split("")
        .slice(0, 3)
        .join("");
      let theMonth = Months[month - 1];
      if (year === getSplitYear && theMonth === getMonth) {
        currentData.push(results[index]);
        graphData.push({
          x: getMonth,

          y: totalPacksPurchased.length,
        });
      }
    }
    graphName === "forPacks"
      ? setMonthWisePackPurcashed(graphData)
      : setMonthWiseReferral(graphData);
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getMatch = (e, GraphName) => {
    let days = [];
    let defaultIndex = 0;
    for (let index = 0; index < Months.length; index++) {
      if (Months[index] === e) {
        defaultIndex = index + 1;
      }
    }
    let date = new Date();
    let getYear = date.getFullYear();

    let getDays = daysInMonth(defaultIndex, getYear);

    for (let index = 1; index <= getDays; index++) {
      days.push(index);
    }

    getData(getYear, defaultIndex, GraphName);
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const showAvatarModal = () => {
    setShowAvatar(true);
  };
  const handleChangeWallet = (e) => {
    setWallet({
      ...wallet,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    let cancelled = false;
    let userNets = [];
    const fetchUsers = async () => {
      try {
        const sanData = await SanitizeRequestObject(users);
        console.log("Users : ", users);
        let encryptionData = await encryptRequestBody(sanData);
        const { data } = await axios.post(
          `/api/getUserCredentials`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        if (cancelled) return;
        const sanObj = await SanitizeRequestObject(data);
        setUserCredentials(sanObj.UserCredentails);
        const networkRows = Array.isArray(sanObj.userNetwork)
          ? sanObj.userNetwork
          : [];
        setUserSession(networkRows);
        for (let index = 0; index < networkRows.length; index++) {
          let parsedData = JSON.parse(networkRows[index].clientAgent);
          userNets.push(parsedData);
        }
        setUserNetwork(userNets);
        fetchProfilePic();
      } catch (error) {
        console.log("error fetching user credentails :", error);
      }
    };
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchUserPackPurchased = async () => {
      try {
        const sanData = await SanitizeRequestObject(users);
        let encryptionData = await requestBodyEncryptionUnprotected(sanData);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/pack/fetch/boughtpack`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        const sanObj = await SanitizeRequestObject(data);
        if (data.success) {
          settotalPackPurchased(sanObj.totalUserPackPurchased);
        }
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
        console.error("unabel to retrieve user data :");
      }
    };
    fetchUserPackPurchased();
  }, []);

  useEffect(() => {
    const fetchUserReferrals = async () => {
      try {
        const sanData = await SanitizeRequestObject(users);
        let encryptionData = await requestBodyEncryptionUnprotected(sanData);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/pack/fetch/fetchReferral`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        const sanObj = await SanitizeRequestObject(data);

        if (data.success) {
          settotalReferral(sanObj.totalUserReferrals);
        }
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
        console.error("unabel to retrieve user data :");
      }
    };
    fetchUserReferrals();
  }, []);

  const fetchProfilePic = async () => {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const sanData = await SanitizeRequestString(result?.data?.data?.Location);
      setAvatarState(sanData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromDevice = async (deviceToBeRemoved) => {
    try {
      const sanData = await SanitizeRequestObject(deviceToBeRemoved);
      let encryptionData = await encryptRequestBody(sanData);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/removeThisDevice`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("error removing the user device :", error);
    }
  };

  const data = {
    labels: Months,
    datasets: [
      {
        label: "Month Wise Packs",
        data: monthWisePackPurchased,
        borderColor: "#00bf96",
        // borderColor: 'rgb(255, 99, 132)',
        // backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const dataForReferral = {
    labels: Months,
    datasets: [
      {
        label: "Total Referral",
        data: monthWiseReferral,
        // borderColor: "#00bf96",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="profileContainer">
      <div className="profileInner">
        <div className="title">
          <h1>Profile</h1>
        </div>
        <div className="changeAvatarContainer">
          <h3>Account Information</h3>
          <div className="changeAvatarIconContainer">
            <div className="imgContainer">
              <div className="img">
                <Image
                  id="avatarplaceholder"
                  src={avatarState ? avatarState : "/images/avatar.png"}
                  alt="avatar"
                  width={88}
                  height={88}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="walletAddressCode">
              <h2>
                {userCredentials &&
                  userCredentials.walletaddress &&
                  userCredentials.walletaddress[
                    userCredentials.walletaddress.length - 1
                  ]}
              </h2>
            </div>
            <div className="btnContainer">
              <button
                className=" btnHoverEffectOutline"
                onClick={() => {
                  router.push("/user/dashboard/editprofile");
                  // router.push({ pathname: '/user/dashboard/editprofile', query: { users: "abcd" }});

                  // Router.push({ pathname: '/user/dashboard/editprofile', state: {  users: "abcd" } });
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="changePasswordContainer">
          <form method="post" autoComplete="off">
            <div className="formInputs emailEdit">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={
                  userCredentials?.emailid ? userCredentials?.emailid : "N/A"
                }
                disabled={true}
              />
            </div>
            <div className="formInputs">
              <input
                id="username"
                name="username"
                autoComplete="off"
                disabled={true}
                value={
                  userCredentials?.username ? userCredentials.username : "N/A"
                }
              />
            </div>
          </form>
        </div>
        {/* updated wallet design */}
        <form method="post" autoComplete="off" className="walletAddressForm">
          <h3>Wallet Address</h3>
          <div className="formInputs">
            <div className="iconinputContainer walletAddCon">
              <input
                id="walletAdd"
                name="walletAdd"
                type={"text"}
                autoComplete="off"
                value={
                  userCredentials && userCredentials.walletaddress
                    ? userCredentials.walletaddress[
                        userCredentials.walletaddress.length - 1
                      ]
                    : "N/A"
                }
              />
              {/* <button
                className="unbindBtn"
              >
                Unbind
              </button> */}
            </div>
          </div>
        </form>
        {/* <div className="walletAddressContainer">
          <div className="walletCard flex">
            <h4>Change Wallet Address</h4>
            <div className="formInputs bindnewWallet">
              <button
                className="btnHoverEffectOutline"
                onClick={() => {
                  setShowWalletConnectMessage(true);
                }}
              >
                Change
              </button>
            </div>
          </div>
        </div> */}
        {/* old wallet design */}
        {/* <div className="walletAddressContainer">
          <h3>Wallet Address</h3>
          <div className="walletCard">
            <form method="post" autoComplete="off">
              <div className="formInputs">
                <input
                  id="walletValue"
                  name="walletValue"
                  type={"text"}
                  placeholder="Referral Code"
                  value={wallet.walletValue}
                  onChange={handleChangeWallet}
                  // {...registerWallet("referralcode")}
                  // error={formStateWallet.errors.referralcode && true}
                />
                {formStateWallet.errors.referralcode && <p>{formStateWallet.errors.referralcode.message}</p>}
                <h6>
                  <button className="unbindBtn">Unbind</button>
                </h6>
              </div>
              <div className="formInputs bindnewWallet">
                <button>Bind New Wallet</button>
              </div>
            </form>
          </div>
        </div> */}
        {/* <div className="referralStatistics">
          <h3>Referral Statistics</h3>

          <div className="imageBoxContainer">
            <div className="imgBox" style={{
              border: "2px solid #ffffff61"
            }}>
              <div className="total_referrals" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px"
              }}>
                <p>Total Pack Purchased </p>
               
                <p>Total Pack Purchased </p>
                <select
                  defaultValue={Months[new Date().getMonth()]}
                  name="month selector"
                  id="ms"
                  style={{
                    backgroundColor: "black",
                  }}
                  onChange={(e) => {
                    getMatch(e.target.value, "forPacks");
                  }}
                >
                  {Months.map((eachMonth) => {
                    return <option value={eachMonth}>{eachMonth}</option>;
                  })}
                </select>
              </div>
              <Line options={options} data={data} />
            </div>
            <div className="imgBox" style={{
              border: "2px solid #ffffff61"
            }}>
              <div className="total_referrals" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px"
              }}>
                <p>Total Referrals </p>
               
                <p>Total Referrals </p>
                <select
                  defaultValue={Months[new Date().getMonth()]}
                  name="month selector"
                  id="ms"
                  style={{
                    backgroundColor: "black",
                  }}
                  onChange={(e) => {
                    getMatch(e.target.value, "forReferral");
                  }}
                >
                  {Months.map((eachMonth) => {
                    return <option value={eachMonth}>{eachMonth}</option>;
                  })}
                </select>
              </div>
              <Line options={optionsForRerral} data={dataForReferral} />
            </div>
          </div>
        </div> */}
        <div className="clientAgent">
          <h3>User Client Agent</h3>
          <div className="clientAgentInner">
            {userNetwork.length > 0 ? (
              userNetwork.map((userNet, index) => {
                return (
                  <div
                    className="deviceInformationCard"
                    key={userNet._id}
                    id={userNet._id}
                  >
                    <div className="level">
                      <h6>User Device Information</h6>
                      <button
                        className=" btnHoverEffectOutline"
                        onClick={() => {
                          handleRemoveFromDevice(userSession[index]);
                        }}
                      >
                        Remove From This Device
                      </button>
                    </div>
                    <div className="level">
                      <p>Browser:</p>
                      <p>{userNet.browser.name}</p>
                    </div>
                    <div className="level">
                      <p>Operating System:</p>
                      <p>{userNet.os.name}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <NodataCard />
            )}
          </div>
        </div>
      </div>
      <Modal
        show={showAvatar}
        onClose={() => setShowAvatar(false)}
        modaltitle={"Change Avatar"}
      >
        <div className="avatarContainer">
          <div className="avatarList">
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar1.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon1 icon activeImg"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar2.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon2 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar3.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon3 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar4.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon4 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar5.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon5 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar6.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon6 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar7.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon7 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar8.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon8 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar9.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon9 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar10.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon10 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar11.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon11 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar12.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon12 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar13.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon13 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar14.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon14 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar15.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon15 icon"
                loading="lazy"
              />
            </div>
          </div>
          <SimpleButton
            text="Save"
            backgroundColor="#E44757"
            maxWidth="90%"
            onClick={() => {
              setShowAvatar(false);
            }}
          />
        </div>
      </Modal>
      {/* success modal */}
      <Modal show={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Password Updated Successfully</h5>
            <p></p>
          </div>
        </div>
      </Modal>
      {/* success modal for email */}
      <Modal show={showEmailSuccess} onClose={() => setShowEmailSuccess(false)}>
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Email Updated Successfully</h5>
            <p></p>
          </div>
        </div>
      </Modal>
      {/* wallect connect message modal */}
      <Modal
        show={showWalletConnectMessage}
        onClose={() => setShowWalletConnectMessage(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Metamask</h5>
            <p>Please Connect To Polygon Mainnet</p>
          </div>
        </div>
      </Modal>

      {/* <Loader loading={showLoader} loaderDuration='2000' /> */}
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

export default Profile;
Profile.PageLayout = UserDashboardLayout;
