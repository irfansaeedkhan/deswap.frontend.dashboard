import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Pagination from "@/components/reusables/Pagination";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import {
  ConnectToWeb3,
  formatWei,
} from "../../../utils/wallet/fetchtransactiondetails";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject} from "../../../utils/common/sanitize"


export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function ClaimmedNRTable() {
  const [claimmedNetworkRewardsList, setClaimmedNetworkRewardsList] = useState(
    []
  );
  const [loadingState, setLoadingState] = useState(true);
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
        setClaimmedNetworkRewardsList(
          <tr>
            <td className="text-center" colSpan={11}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }

      for (let index in tableData.data) {
        let transactionDetails = await ConnectToWeb3(
          tableData.data[index].TxHash
        );
        if (transactionDetails != null && transactionDetails != undefined) {
          transactionDetails.convertedAmount = await formatWei(
            transactionDetails.value
          );
          tableData.data[index].transactionDetails = transactionDetails;
        }
      }
      if (tableData) {
        let loopDate = tableData.data;
        let outputData = [];
        //
        //setClaimmedNetworkRewardsList();
        for (let index in loopDate) {
          outputData.push(
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {loopDate[index] && loopDate[index].NetworkRewardsID
                  ? loopDate[index].NetworkRewardsID.UserTo.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index] && loopDate[index].NetworkRewardsID
                  ? loopDate[index].NetworkRewardsID.UserFrom.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index] && loopDate[index].TxHash ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].TxHash}`}
                  >
                    {loopDate[index] &&
                      loopDate[index].TxHash &&
                      reducedWalletAddress(loopDate[index].TxHash)}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index] && loopDate[index].transactionDetails ? (
                  <div>
                    <div>From</div>
                    <div>
                      <a
                        target="_blank"
                        href={`${
                          process.env.NEXT_PUBLIC_POLYGON_SCANLINK
                        }address/${
                          loopDate[index] &&
                          loopDate[index].transactionDetails &&
                          loopDate[index].transactionDetails.from
                        }`}
                      >
                        {loopDate[index] &&
                          loopDate[index].transactionDetails &&
                          loopDate[index].transactionDetails.from &&
                          reducedWalletAddress(
                            loopDate[index].transactionDetails.from
                          )}
                      </a>
                    </div>
                    <div>To</div>
                    <div>
                      <a
                        target="_blank"
                        href={`${
                          process.env.NEXT_PUBLIC_POLYGON_SCANLINK
                        }address/${
                          loopDate[index] &&
                          loopDate[index].transactionDetails &&
                          loopDate[index].transactionDetails.to
                        }`}
                      >
                        {loopDate[index] &&
                          loopDate[index].transactionDetails &&
                          loopDate[index].transactionDetails.to &&
                          reducedWalletAddress(
                            loopDate[index].transactionDetails.to
                          )}
                      </a>
                    </div>
                    <div>Amount</div>
                    <div>
                      {loopDate[index].transactionDetails &&
                        convertToEuro(
                          loopDate[index].transactionDetails.convertedAmount
                        )}
                    </div>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index].PublicAddress ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].PublicAddress}`}
                  >
                    {reducedWalletAddress(loopDate[index].PublicAddress)}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index].Amount
                  ? convertToEuro(loopDate[index].Amount)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index].ValidRequest
                  ? loopDate[index].ValidRequest
                  : "N/A"}
              </td>
              <td>
                {loopDate[index].RejectReason
                  ? loopDate[index].RejectReason
                  : "N/A"}
              </td>
              <td>{loopDate[index].Status ? loopDate[index].Status : "N/A"}</td>
            </tr>
          );
        }

        setClaimmedNetworkRewardsList(outputData);
        await setPagination({
          ...pagination,
          totalData: tableData.total,
          activePage: tableData.activePageNo,
        });
      }
    } catch (e) {
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
      setClaimmedNetworkRewardsList(
        <tr>
          <td className="text-center" colSpan={11}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };
  const handlePageChange = async (pageNumber) => {
    try {
      setClaimmedNetworkRewardsList(<TableLoader colSpan={11} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchClaimmedNetworkRewards({
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
  const fetchClaimmedNetworkRewards = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data)
      setClaimmedNetworkRewardsList(<TableLoader colSpan={11} />);

      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/clammied/networkclaimmed`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      let networkRewards = result?.data;
      networkRewards = await SanitizeRequestObject(networkRewards)
      //setNetworkData(result?.data);
      networkRewards.activePageNo = data?.activePageNo;
      await setTotalRewards(networkRewards?.total);
      await createTableData(networkRewards);
    } catch (e) {
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      setLoadingState(false);
      setClaimmedNetworkRewardsList(
        <tr>
          <td className="text-center" colSpan={11}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  useEffect(() => {
    void (async () => {
    try {
      await fetchClaimmedNetworkRewards({
        offset: 0,
        limit: 10,
        activePageNo: 1,
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
      })();
  }, []);

  return (
    <div className="ClaimmednetworkrewardstableContainer">
      <div className="tableContainer">
        <p>Claimmed Network Rewards Table</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">#</th>
                <th>Rewards To</th>
                <th>Rewards From</th>
                <th>TxHash</th>
                <th>TxHash Details</th>
                <th>PublicAddress</th>
                <th>Amount</th>
                <th>Request Status</th>
                <th>Reject reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{claimmedNetworkRewardsList}</tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalRewards ? totalRewards : "N/A"} </p>
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
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
/>
    </div>
  );
}

export default ClaimmedNRTable;
