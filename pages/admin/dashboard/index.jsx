import React, { useState, useEffect } from "react";
import Image from "next/image";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import SmRightArrow from "@/assets/svgAssets/SmRightArrow";
import SmLeftArrow from "@/assets/svgAssets/SmLeftArrow";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import axios from "../../../utils/common/axios";
import TotalAccountChart from "@/components/adminDashboardComponents/dashboard/TotalAccountsChart";
import TotalPackChart from "@/components/adminDashboardComponents/dashboard/TotalPackChart";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import moment from "moment";
import Pagination from "react-js-pagination";
import { maticToDollar } from "../../../utils/common/tokenconversion";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
// form validations
const schema = Joi.object({
  password: Joi.string().required().min(4).label("password").messages({
    "string.empty": `Password Required`,
    "any.required": `Required Field`,
  }),
  confirmpassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": `Password does not match`,
      "string.empty": `Confirm Password Required`,
      "any.required": `Required Field`,
    }),
});
function Dashboard() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [totalPackData, setTotalPackData] = useState();
  const [totalUsers, setTotalUsers] = useState(0);
  const [packData, setPackData] = useState();
  const [totalPacks, setTotalPacksData] = useState(0);
  const [totalPackUSD, setTotalPackUSD] = useState();
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setconfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });

  useEffect(async () => {
    await fetchData();
    await fetchPacksData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/purchasedpack/fetch/total`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const total = await SanitizeRequestString(result.data.total);
      const totalUsers = await SanitizeRequestString(result.data.totalUsers);
      setTotalPackData(total);
      setTotalUsers(totalUsers);
      await convertMaticToUSD(result.data.total);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPacksData = async (datas) => {
    try {
      let offset = 0;
      if (datas == undefined) {
        offset = 0;
      } else {
        if (!datas.offset) {
          offset = 0;
        } else {
          offset = datas.offset;
        }
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/purchasedpack/fetch/all`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const data = await SanitizeRequestObject(result.data);
      setPackData(data.data);
      await setPagination({
        ...pagination,
        totalData: data.total,
        activePage: datas?.activePageNo,
      });
      setTotalPacksData(data.total);
    } catch (e) {
      console.log(e);
    }
  };

  const convertMaticToUSD = async (data) => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/matictodollar`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const data = await SanitizeRequestString(result.data.conversion);
      await setTotalPackUSD(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = async (pageNumber) => {
    try {
      // setClaimmedNetworkRewardsList(<TableLoader colSpan={11} />);
      // if (isNaN(pageNumber)) {
      //   return;
      // }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchPacksData({
        offset: offset,
        activePageNo: pageNumber,
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
      console.log("Handle page change : ", e);
    }
  };

  const onSubmit = (data) => {
    // if (data) {
    //   setShowSuccess(true);
    // }
  };
  return (
    <div className="AdminDashboardTabContainer">
      <div className="AdminDashboardTabInner">
        <div className="title">
          <h1>Dashboard</h1>
        </div>
        <div className="AdminDashboardTabMain">
          <div className="leftSide">
            {/* profile card */}
            <div className="cardsContain">
              <div className="CardContainer">
                <div className="CardInner">
                  <div className="content">
                    <p>Total Packs Sold</p>
                    <h1>{totalPackData && totalPackData.toFixed(6)} </h1>
                  </div>
                </div>
              </div>
              <div className="CardContainer">
                <div className="CardInner">
                  <div className="content">
                    <p>Total Value Of All Packs Sold</p>
                    <h1>{totalPackUSD ? totalPackUSD.toFixed(6) : "N/A"} $</h1>
                  </div>
                </div>
              </div>
              <div className="CardContainer ">
                <div className="CardInner">
                  <div className="content">
                    <p>Total Registered Users</p>
                    <h1>{totalUsers}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="CardContainer mt-5">
              <TotalAccountChart />
            </div>
          </div>
          <div className="rightSide">
            <div className="allPackSoldGraphContainer">
              <div className="TotalUserContainer">
                <TotalPackChart />
              </div>
            </div>

            <div className="TotalUserContainer">
              <p>Total User Buy Pack</p>
              <div className="TotalUserContainerTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th>Holders</th>
                      <th>Amount(DAW)</th>
                      <th>Unclock Date</th>
                      <th>Current Status</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packData
                      ? packData.map((data) => {
                          return (
                            <tr key={data._id}>
                              <td>
                                {data?.UserID?.walletaddress[
                                  data?.UserID?.walletaddress.length - 1
                                ] ? (
                                  <a
                                    target="_blank"
                                    href={`${
                                      process.env.NEXT_PUBLIC_POLYGON_SCANLINK
                                    }address/${
                                      data.UserID.walletaddress[
                                        data.UserID.walletaddress.length - 1
                                      ]
                                    }`}
                                  >
                                    {reducedWalletAddress(
                                      data.UserID.walletaddress[
                                        data.UserID.walletaddress.length - 1
                                      ]
                                    )}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>{data.DAW ? data.DAW.toFixed(6) : "N/A"}</td>
                              <td>In {moment(data.created_at).fromNow()}</td>
                              <td>{data.Status}</td>
                              <td>
                                {moment(moment.now()).diff(
                                  new Date(data.created_at),
                                  "months",
                                  true
                                ) > 12 ? (
                                  <button className="Unlocked btnHoverEffectOutline">
                                    Unlocked
                                  </button>
                                ) : (
                                  <button className="locked btnHoverEffectOutline">
                                    Locked
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <div className="total">
                  <p>Total Items : {totalPacks} </p>
                </div>
                <Pagination
                  disabledClass={pagination.disabledClass}
                  hideDisabled={true}
                  activePage={pagination.activePage}
                  itemsCountPerPage={pagination.dataperpage}
                  totalItemsCount={pagination.totalData}
                  pageRangeDisplayed={pagination.pageRange}
                  innerClass={"pagination"}
                  activeClass={"link"}
                  onChange={handlePageChange}
                />
              </div>

              <div className="pagination mobile">
                <div className="total">
                  <p>Total Items : {totalPacks}</p>
                  {"  "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
Dashboard.PageLayout = AdminDashboardLayout;
