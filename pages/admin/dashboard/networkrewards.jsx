import React, { useState, useEffect } from "react";
import TotalCoinpackFeeGraph from "@/components/adminDashboardComponents/stackingpackfee/TotalCoinpackFeeGraph";
import SmRightArrow from "@/assets/svgAssets/SmRightArrow";
import SmLeftArrow from "@/assets/svgAssets/SmLeftArrow";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Pagination from "react-js-pagination";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "../../../utils/common/sanitize";
import TotalNetworkRewardsGraph from "@/components/adminDashboardComponents/networkRewards/TotalNetworkRewardsGraph";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
function NetworkRewards() {
  const [ntrChanged, setNTRChanged] = useState("0,00");
  const [ntrPercentageChanged, setNTRPercentageChanged] = useState("0,00");
  const [displayValue, setdisplayValue] = useState(false);
  const [networkRewardList, setNetworkRewardList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [totalRewards, setTotalRewards] = useState("");

  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  //
  const createTableData = async (tableData) => {
    try {
      if (tableData.data.length < 1) {
        setNetworkRewardList(
          <tr>
            <td className="text-center" colSpan={8}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }
      if (tableData) {
        //
        setNetworkRewardList(
          tableData.data.map((data, index) => {
            return (
              <tr key={data._id}>
                <td>{index + 1}</td>
                <td>{data?.Currency ? data.Currency : "N/A"}</td>
                <td>{data?.Amount ? data.Amount : "N/A"}</td>
                <td>{data?.Level ? data.Level : "N/A"}</td>
                <td>
                  {data?.RewardsPercentage ? data.RewardsPercentage : "N/A"}
                </td>
                <td>
                  {data?.PurchasedPack
                    ? reducedWalletAddress(data.PurchasedPack)
                    : "N/A"}
                </td>
                <td>
                  {data?.created_at ? myRewardsDate(data.created_at) : "N/A"}
                </td>
                <td>
                  <button
                    className={`${
                      data.Status == "Active" || data.Status == "Claimmed"
                        ? "Unlocked"
                        : "locked"
                    }`}
                  >
                    {data.Status}
                  </button>
                </td>
              </tr>
            );
          })
        );

        await setPagination({
          ...pagination,
          totalData: tableData.total,
          activePage: tableData.activePageNo,
        });
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
      setNetworkRewardList(
        <tr>
          <td className="text-center" colSpan={8}>
            <NodataCard />
          </td>
        </tr>
      );
      console.log(e);
    }
  };

  //
  const handlePageChange = async (pageNumber) => {
    try {
      setNetworkRewardList(<TableLoader colSpan={8} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchnetworkRewardListFunc({
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

  //function to fetch api response
  const fetchnetworkRewardListFunc = async (data) => {
    try {
      await SanitizeRequestObject(data);
      setNetworkRewardList(<TableLoader colSpan={8} />);
      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/clammied/networkrewards`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let networkRewards = result.data;
      networkRewards = await SanitizeRequestObject(networkRewards);
      networkRewards.activePageNo = data.activePageNo;
      await setTotalRewards(result.data.total);
      await createTableData(networkRewards);
      setLoadingState(result && false);
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
      setLoadingState(false);
      setNetworkRewardList(
        <tr>
          <td className="text-center" colSpan={8}>
            <FailedToFetchData></FailedToFetchData>
          </td>
        </tr>
      );
      console.log(e);
      return 0;
    }
  };

  useEffect(async () => {
    await fetchnetworkRewardListFunc({ offset: 0, limit: 10, activePageNo: 1 });
  }, []);
  //   debugger
  return (
    <div className="NetworkRewardsContainer">
      <div className="NetworkRewardsInner">
        <div className="title">
          <h1>Network Rewards</h1>
        </div>
        <div className="NetworkRewardsMain">
          <div className="GraphtableContainer rounded-2xl sm:overflow-x-scroll md:overflow-hidden customScrollOntables">
            <div className="graphContainer ">
              {/* <TotalCoinpackFeeGraph
                graphData={45}
                duration="5m"
                setNTRChanged={setNTRChanged}
                setNTRPercentageChanged={setNTRPercentageChanged}
                setdisplayValue={setdisplayValue}
              /> */}
              <TotalNetworkRewardsGraph />
            </div>
          </div>
          <div className="stackingpackfeetableContainer">
            <div className="tableContainer">
              <p>Network Rewards Table</p>
              <div className="tableContainerTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th className="hashTable">#</th>
                      <th>Currency</th>
                      <th>Amount</th>
                      <th>Level</th>
                      <th>Rewards Percentage</th>
                      <th>Purchased Pack</th>
                      <th>created_at</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{networkRewardList}</tbody>
                </table>
              </div>
              <div className="pagination">
                <div className="total">
                  <p>Total Items : {totalRewards ? totalRewards : "N/A"}</p>
                  {"  "}
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
                {/* <div className="content_detail__pagination cdp" actpage="1">
                  <a href="#" className="cdp_i">
                    <SmLeftArrow />
                  </a>
                  <a href="#" className="cdp_i">
                    1
                  </a>
                  <a href="#" className="cdp_i">
                    2
                  </a>
                  <a href="#" className="cdp_i">
                    <SmRightArrow />
                  </a>
                </div> */}
              </div>
              <div className="pagination mobile">
                <div className="total">
                  <p>Total Items : {totalRewards ? totalRewards : "N/A"}</p>
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
                {/* <div className="content_detail__pagination cdp" actpage="1">
                  <a href="#" className="cdp_i">
                    <SmLeftArrow />
                  </a>
                  <a href="#" className="cdp_i">
                    1
                  </a>
                  <a href="#" className="cdp_i">
                    2
                  </a>
                  <a href="#" className="cdp_i">
                    <SmRightArrow />
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {loadingState && <Loader />} */}
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

export default NetworkRewards;
NetworkRewards.PageLayout = AdminDashboardLayout;
