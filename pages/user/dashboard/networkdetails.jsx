import React, { useState, useEffect } from "react";
import { checkUserAuth } from "../../../utils/auth/userauth";
import axios from "../../../utils/common/axios";
import TableLoader from "@/components/reusables/loader/TableLoader";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { clearAllInterval } from "../../../utils/common/interval";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import Loader from "@/components/reusables/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};
const NetworkDetails = ({ users }) => {
  const [uplineData, setUplineData] = useState(
    <tbody>
      <TableLoader colSpan={3} />
    </tbody>
  );
  const [downlineData, setDownlineData] = useState(
    <tbody>
      <TableLoader colSpan={3} />
    </tbody>
  );
  const [loading, setLoading] = useState(false);
  let levelNames = [
    "Level One",
    "Level Two",
    "Level Three",
    "Level Four",
    "Level Five",
    "Level Six",
    "Level Seven",
    "Level Eight",
  ];

  const fetchUplineData = async () => {
    try {
      setUplineData(
        <tbody>
          <TableLoader colSpan={3} />
        </tbody>
      );
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/upline`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoading(result && false);
      let userUpline = result?.data?.data;
      userUpline = await SanitizeRequestObject(userUpline);
      if (userUpline) {
        let uplineDom = [];
        let serilaNumber = 0;
        for (let index in userUpline) {
          if (userUpline[index]) {
            uplineDom.push(
              <tr key={userUpline[index].MetaMaskAccountPublicKey}>
                <td>{++serilaNumber}</td>
                <td>
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${userUpline[index].MetaMaskAccountPublicKey}`}
                  >
                    {userUpline[index].MetaMaskAccountPublicKey}
                  </a>
                </td>
                <td>
                  <p className="locked btnHoverEffectOutline">
                    {levelNames[index]}
                  </p>
                </td>
              </tr>
            );
          }
        }
        if (uplineDom.length > 0) {
          setUplineData(uplineDom);
        } else {
          setUplineData(
            <tbody>
              <tr>
                <td className="text-center" colSpan={3}>
                  <NodataCard />
                </td>
              </tr>
            </tbody>
          );
        }
      } else {
        setUplineData(
          <tbody>
            <tr>
              <td className="text-center" colSpan={3}>
                <NodataCard />
              </td>
            </tr>
          </tbody>
        );
      }
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
      setLoading(false);
      console.log(e);
      setUplineData(
        <tbody>
          <tr>
            <td className="text-center" colSpan={3}>
              <FailedToFetchData />
            </td>
          </tr>
        </tbody>
      );
    }
  };

  const fetchDownlineData = async () => {
    try {
      setUplineData(
        <tbody>
          <TableLoader colSpan={3} />
        </tbody>
      );
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/downline`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoading(result && false);
      let userDownline = result?.data?.data;
      userDownline = await SanitizeRequestObject(userDownline);
      if (userDownline) {
        //
        let downlineDom = [];
        let serialNumber = 0;
        for (let level in userDownline) {
          if (userDownline[level].length > 0) {
            //
            for (let userlevel in userDownline[level]) {
              //
              downlineDom.push(
                <tr>
                  <td>{++serialNumber}</td>
                  <td>
                    <a
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${userDownline[level][userlevel].walletaddress}`}
                    >
                      {userDownline[level][userlevel].walletaddress}
                    </a>
                  </td>
                  <td>
                    <p className="locked">{levelNames[level]}</p>
                  </td>
                </tr>
              );
            }
          }
        }
        if (downlineDom.length > 0) {
          setDownlineData(downlineDom);
        } else {
          setDownlineData(
            <tr>
              <td className="text-center noData" colSpan={3}>
                <NodataCard />
              </td>
            </tr>
          );
        }
      } else {
        setDownlineData(
          <tbody>
            <tr>
              <td className="text-center" colSpan={3}>
                <NodataCard />
              </td>
            </tr>
          </tbody>
        );
      }
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
      setLoading(false);
      console.log("Failed to fetch network details ", e);
      setDownlineData(
        <tbody>
          <tr>
            <td className="text-center" colSpan={3}>
              <FailedToFetchData />
            </td>
          </tr>
        </tbody>
      );
    }
  };

  useEffect(async () => {
    try {
      await clearAllInterval();
      let promiseAll = [];
      promiseAll.push(fetchUplineData());
      promiseAll.push(fetchDownlineData());
      await Promise.all(promiseAll);
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
      console.log("Failed to fetch data");
    }
  }, []);
  /*let lengthOfDowlineUsers = 0;
  let lengthOfUplineUser = 0;

  const [userAtEachLevel, setUserAtEachLevel] = useState([]);

  // useEffect(() => {
  //   let levelss = [];
  //   let userLevels = {
  //     levelOne: 0,
  //     levelTwo: 0,
  //     levelThree: 0,
  //     levelFour: 0,
  //   };
  //   for (let index = 0; index < data.length; index++) {
  //     if (data[index] !== null) {
  //       levelss.push(data[index].length);
  //     }
  //   }

  //   setUserAtEachLevel(levelss);
  // }, [users,datas]);
  //console.log("At each level", userAtEachLevel);
  if (data) {
    //console.log("upline data", data[0].uuid.MetaMaskAccountPublicKey);
  }
  if (datas) {
    datas = JSON.parse(datas);
    for (let index = 0; index < datas.length; index++) {
      if (datas[index] !== null && data[index].length > 0) {
        lengthOfUplineUser = 1;
        break;
      }
    }
  }
  let i = 0;
  let noOfEntries = 0;

  let levelNames = [
    "Level One",
    "Level Two",
    "Level Three",
    "Level Four",
    "Level Five",
    "Level Six",
    "Level Seven",
    "Level Eight",
  ];

  let value = false;
  for (let i = 0; i < data.length; i++) {
    if (datas[i] != null) {
      value = true;
      break;
    }
  }
  let k = 0;

  const letter = ["First", "Second", "Third", "Fourth"];

  */
  return (
    <div className="NetworkDetailsContainer">
      <div className="NetworkDetailsInner">
        <div className="NetworkDetailsMain">
          <div className="networklinesDataContainer">
            <div className="title">
              <h1>Network Upline</h1>
            </div>
            <div className="userlevelTableContainer uplineDataBox">
              <div className="userlevelTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th className="hashColumn">#</th>
                      <th>Public Key</th>
                      <th>User Level</th>
                    </tr>
                  </thead>
                  {uplineData}
                </table>
                {/*value ? (
                  <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                      <tr>
                        <th className="hashColumn">#</th>
                        <th>Public Key</th>
                        <th>User Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datas
                        ? datas.map((datas) => {
                            if (datas !== null) {
                              return (
                                <tr key={datas.MetaMaskAccountPublicKey}>
                                  <td>{++k}</td>
                                  <td>{datas.MetaMaskAccountPublicKey}</td>
                                  <td>
                                    <p className="locked">
                                      {levelNames[k - 1]}
                                    </p>
                                  </td>
                                </tr>
                              );
                            }
                          })
                        : null}
                    </tbody>
                  </table>
                ) : (
                  <p>No Sponsor detected</p>
                )*/}
              </div>
            </div>
          </div>
          <div className="title">
            <h1>Network Downline</h1>
          </div>
          <div className="downlineDataBoxContainer">
            {/*userAtEachLevel.map((eachLevel, indexss) => {
              return (
                <div className="smbox" key={indexss}>
                  <span>
                    <span className=" textTitle">{letter[indexss]} Level</span>
                    <span className="textNumber">
                      {userAtEachLevel[indexss]}
                    </span>
                  </span>
                </div>
              );
            })*/}
          </div>
          {/* userlevel Table */}
          <div className="userlevelTableContainer">
            <div className="userlevelTable customScroll">
              <table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                  <tr>
                    <th className="hashColumn">#</th>
                    <th>Public Key</th>
                    <th>User Level</th>
                  </tr>
                </thead>
                {downlineData}
              </table>
              {/*<table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                  <tr>
                    <th className="hashColumn">#</th>
                    <th>Public Key</th>
                    <th>User Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>34535345435234</td>
                    <td>
                      <p className="locked">1</p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>34535345435234</td>
                    <td>
                      <p className="locked">1</p>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>34535345435234</td>
                    <td>
                      <p className="locked">4</p>
                    </td>
                  </tr>
                </tbody>
              </table>*/}
            </div>
          </div>
          {/* <div className=" w-full p-6  rounded-2xl bg-bgg ">
            <div className="w-full overflow-x-scroll xl:overflow-x-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="w-full h-16 border-gray-300 dark:border-gray-200 border-b py-8">
                    <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                      #
                    </th>
                    <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                      Public Key
                    </th>
                    <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                      User Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ? data.map((leveldata) => {
                        i++;
                        let result = leveldata
                          ? leveldata.map((data) => {
                              return (
                                <tr
                                  key={data._id}
                                  className="h-16 border-gray-300 dark:border-gray-200 border-b"
                                >
                                  <td className="text-sm pr-6 whitespace-no-wrap text-white dark:text-gray-100 tracking-normal leading-4">
                                    {++noOfEntries}
                                  </td>
                                  <td className="text-sm pr-6 whitespace-no-wrap text-white dark:text-gray-100 tracking-normal leading-4">
                                    {data.uuid
                                      ? data.uuid.MetaMaskAccountPublicKey[
                                          data.uuid.MetaMaskAccountPublicKey
                                            .length - 1
                                        ]
                                      : null}
                                  </td>
                                  <td className="text-sm pr-6 whitespace-no-wrap text-white dark:text-gray-100 tracking-normal leading-4">
                                    {levelNames[i - 1]}
                                  </td>
                                </tr>
                              );
                            })
                          : null;
                        return result;
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      </div>
      {/* {loading && <Loader />} */}
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
};

export default NetworkDetails;
NetworkDetails.PageLayout = UserDashboardLayout;
