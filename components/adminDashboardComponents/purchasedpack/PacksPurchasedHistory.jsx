import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import {
  ConnectToWeb3,
  formatWei,
} from "../../.././utils/wallet/fetchtransactiondetails";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


const PacksPurchasedHistory = () => {
  const [loadingState, setLoadingState] = useState(true);
  const [claimmedPackList, setClaimmedPackList] = useState([]);
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
      setLoadingState(true);
      if (tableData.data.length < 1) {
        setClaimmedPackList(
          <tr>
            <td className="text-center" colSpan={10}>
              <NodataCard />
            </td>
          </tr>
        );
        setLoadingState(false);
        return;
      }

      let outputData = [];

      for (let index in tableData.data) {
        let transactionDetails = await ConnectToWeb3(
          tableData.data[index].TxHash
        );
        if (transactionDetails && transactionDetails.value) {
          transactionDetails.convertedAmount = await formatWei(
            transactionDetails.value
          );
          tableData.data[index].transactionDetails = transactionDetails;
        }
      }

      if (tableData) {
        let loopDate = tableData.data;
        for (let index in loopDate) {
          outputData.push(
            <tr key={loopDate[index]._id}>
              <td>{index + 1}</td>
              <td>
                {loopDate[index]?.PackID?.PackName
                  ? loopDate[index]?.PackID?.PackName
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.Quantity ? loopDate[index].Quantity : "N/A"}
              </td>
              <td>
                {loopDate[index]?.UserID?.emailid
                  ? loopDate[index].UserID.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.UserID?.walletaddress[
                  loopDate[index]?.UserID?.walletaddress
                ] ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index].UserID.walletaddress[
                        loopDate[index].UserID.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {reducedWalletAddress(
                      loopDate[index].UserID.walletaddress[
                        loopDate[index].UserID.walletaddress.length - 1
                      ]
                    )}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index].TotalAmountInMatic
                  ? convertToEuro(loopDate[index].TotalAmountInMatic)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.TxHash ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].TxHash}`}
                  >
                    {reducedWalletAddress(loopDate[index].TxHash)}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index]?.transactionDetails ? (
                  <div>
                    <div>From</div>
                    <div>
                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].transactionDetails.from}`}
                      >
                        {reducedWalletAddress(
                          loopDate[index].transactionDetails.from
                        )}
                      </a>
                    </div>
                    <div>To</div>
                    <div>
                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].transactionDetails.to}`}
                      >
                        {reducedWalletAddress(
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
                {loopDate[index]?.created_at
                  ? myRewardsDate(loopDate[index].created_at)
                  : "N/A"}
              </td>
              <td>
                <button
                  className={`${
                    loopDate[index].Status == "Active" ||
                    loopDate[index].Status == "Claimmed"
                      ? "Unlocked"
                      : "locked"
                  }`}
                >
                  {loopDate[index].Status}
                </button>
              </td>
            </tr>
          );
        }
        await setClaimmedPackList(outputData);
        /*
                setClaimmedPackList(tableData.data.map((data, index) => {
                    return (
                        <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.PackID && data.PackID.PackName }</td>
                            <td>{data.Quantity}</td>
                            <td>{data && data.UserID && data.UserID.emailid}</td>
                            <td>
                                <a target="_blank" href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${data.UserID.walletaddress[data.UserID.walletaddress.length-1]}`}>
                                    {reducedWalletAddress(data.UserID.walletaddress[data.UserID.walletaddress.length-1])}
                                </a>
                            </td>
                            <td>{data && data.TotalAmountInMatic}</td>
                            <td>
                                <a target="_blank" href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${data.TxHash}`}>
                                    {reducedWalletAddress(data.TxHash)}
                                </a>
                            </td>
                            <td>{data?.created_at ? myRewardsDate(data.created_at) : "N/A"}</td>
                            <td>
                                <button className={`${data.Status == 'Active' || data.Status == 'Claimmed' ? 'Unlocked' : 'locked'}`}>
                                    {data.Status}
                                </button>
                            </td>
                        </tr>
                    );
                }));
                */
        setLoadingState(false);
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
      setLoadingState(false);
      setClaimmedPackList(
        <tr>
          <td className="text-center" colSpan={10}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  //
  const handlePageChange = async (pageNumber) => {
    try {
      setClaimmedPackList(<TableLoader colSpan={10} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchClaimmedPackListFunc({
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
  //   function to fetch api response
  const fetchClaimmedPackListFunc = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data)
      setClaimmedPackList(<TableLoader colSpan={10} />);
      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/purchasedpack/fetch/history`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let networkRewards = result.data.data;
      networkRewards=await SanitizeRequestObject(networkRewards)
      networkRewards.activePageNo = data.activePageNo;
      await setTotalRewards(result.data.data.total);
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
      setClaimmedPackList(
        <tr>
          <td className="text-center" colSpan={10}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
      return 0;
    }
  };
  useEffect(async () => {
    try {
      await fetchClaimmedPackListFunc({
        offset: 0,
        limit: 10,
        activePageNo: 1,
      });
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
      console.log("Error message ", e);
    }
  }, []);

  return (
    <div className="stackingpackfeetableContainer">
      <div className="tableContainer">
        <p>Purchased Pack History</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">#</th>
                <th>Pack Name</th>
                <th>Quantity</th>
                <th>User Email id</th>
                <th>User public key</th>
                <th>Amount</th>
                <th>TxHash</th>
                <th>Block chain details</th>
                <th>Purchased On</th>
                <th>Staus</th>
              </tr>
            </thead>
            <tbody>{claimmedPackList}</tbody>
          </table>
        </div>
        <div className="pagination">
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
};

export default PacksPurchasedHistory;
