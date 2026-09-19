import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../../../../utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Upline from "@/components/adminDashboardComponents/lines/upline";
import Downline from "@/components/adminDashboardComponents/lines/downline";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import Loader from "@/components/reusables/loader/Loader";
import DisplayUserInfoTable from "@/components/adminDashboardComponents/userinfo/DisplayUserInfoTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../../utils/common/sanitize";
import RegistrationFee from "@/components/adminDashboardComponents/UserDetails/RegistrationFee";
import NFTLicesnseFee from "@/components/adminDashboardComponents/UserDetails/NFTLicesnseFee";
import PublickeyFee from "@/components/adminDashboardComponents/UserDetails/PublickeyFee";
import CompanyFee from "@/components/adminDashboardComponents/UserDetails/CompanyFee";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  const uuid = ctx.params.userID;
  return {
    props: {
      uuid: uuid,
      users: await checkAdminAuth(ctx),
    },
  };
};

function UsersInfo({ uuid }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uplineList, setUplineList] = useState([]);
  const [downlineList, setDownlineList] = useState([]);
  const [downlineLevel1, setDownlineLevel1] = useState();
  const [downlineLevel2, setDownlineLevel2] = useState();
  const list = ["first", "second", "third", "fourth"];
  const fetchUplineFunc = async (uuid) => {
    try {
      setLoading(true);
      const sanData = await SanitizeRequestObject({ userid: uuid });
      let encryptionData = await requestBodyEncryptionAdmin(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/network/upline`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanObj = await SanitizeRequestObject(result.data.data);
      let uplineData = new Array();
      for (let i = 0; i < result.data.data.length; i++) {
        if (result.data.data[i] != null) {
          uplineData.push(result.data.data[i]);
        }
      }
      setUplineList(uplineData);
      setLoading(result && false);
      return sanObj;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      setLoading(false);
      console.log(e);
      return 0;
    }
  };
  const fetchDownlineFunc = async (data) => {
    try {
      setLoading(true);
      const sanData = await SanitizeRequestString(data);
      let encryptionData = await requestBodyEncryptionAdmin({
        userid: sanData,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/network/downline`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanObj = await SanitizeRequestObject(result.data.data);
      setDownlineLevel1(sanObj[0].length);
      setDownlineLevel2(sanObj[1].length);
      let downlineData = new Array();
      for (let i = 0; i < result.data.data.length; i++) {
        if (result.data.data[i] != null) {
          result.data.data[i].map((data) => {
            downlineData.push({ ...data, level: list[i] });
          });
        }
      }
      setDownlineList(downlineData);
      setLoading(result && false);
      return sanObj;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(e);
      setLoading(false);
      return 0;
    }
  };

  useEffect(async () => {
    await fetchUplineFunc(uuid);
    await fetchDownlineFunc(uuid);
  }, [uuid]);

  return (
    <div className="AdminUsersInfoTabContainer">
      <div className="AdminUsersInfoTabInner">
        {/* upline */}
        <div className="AdminUsersInfoTabMain upline">
          <div className="topCardstitle">
            <h1>Upline Data</h1>
          </div>
          <div className="AdminUserListContainer">
            <div className="AdminUserListInner">
              <div className="AdminUserAccTabMain">
                <div className="leftSide">
                  {/* profile card */}
                  <div className="CardContainer">
                    <div className="CardInner">
                      <div className="content">
                        <p>Total Users At Upline Level One</p>
                        <h5>1</h5>
                      </div>
                    </div>
                  </div>
                  <div className="CardContainer">
                    <div className="CardInner">
                      <div className="content">
                        <p>Total Users At Upline Level Two</p>
                        <h5>1</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rightSide">
                  <Upline uplineList={uplineList} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* downline */}
        <div className="AdminUsersInfoTabMain downline">
          <div className="topCardstitle">
            <h1>Downline Data</h1>
          </div>
          <div className="AdminUserListContainer">
            <div className="AdminUserListInner">
              <div className="AdminUserAccTabMain">
                <div className="leftSide">
                  {/* profile card */}
                  <div className="CardContainer">
                    <div className="CardInner">
                      <div className="content">
                        <p>Total Users At Downline Level One</p>
                        <h5>{downlineLevel1 ? downlineLevel1 : "N/A"}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="CardContainer">
                    <div className="CardInner">
                      <div className="content">
                        <p>Total Users At Downline Level Two</p>
                        <h5>{downlineLevel2 ? downlineLevel2 : "N/A"}</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rightSide">
                  <Downline downlineList={downlineList} />
                </div>
              </div>
              <div className="SwapMDContainer">
                <div className="SwapMDInner">
                  <div className="SwapMDMain">
                    <div className="tabsContainer">
                      <div className="tab-content">
                        <RegistrationFee uuid={uuid} />
                        <NFTLicesnseFee uuid={uuid} />
                        <PublickeyFee uuid={uuid} />
                        <CompanyFee uuid={uuid} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <Loader />}
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

export default UsersInfo;
UsersInfo.PageLayout = AdminDashboardLayout;
