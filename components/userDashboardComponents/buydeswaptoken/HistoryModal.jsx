import React, { useState, useEffect } from "react";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import {
  convertToUSD,
  convertToEuro,
  convertToEuroWithoutPrecision,
} from "../../../utils/common/currencyconversion";
import { myRewardsDate } from "../../../utils/common/date";
import Pagination from "@/components/reusables/Pagination";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function HistoryModal() {
  const [historyTransaction, sethistoryTransaction] = useState(null);
  const [totaltable1Data, setTotaltable1Data] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  //

  const showStatus = async (status) => {
    return status;
  };
  const createHistory = async (data) => {
    try {
      let transactionHistory = [];

      for (let index in data.data) {
        transactionHistory.push(
          <tr>
            <td className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
              {data?.data[index]?.UserToPublicKey ? (
                <a
                  className="transactionhashlink"
                  href={
                    process.env.NEXT_PUBLIC_POLYGON_SCANLINK +
                    "/address/" +
                    data.data[index].UserToPublicKey
                  }
                  target="_blank"
                >
                  {data.data[index].UserToPublicKey
                    ? data.data[index].UserToPublicKey.slice(
                        0,
                        data.data[index].UserToPublicKey.length - 76
                      ).concat(
                        "...." +
                          data.data[index].UserToPublicKey.slice(
                            38,
                            data.data[index].UserToPublicKey.length
                          )
                      )
                    : "--"}
                </a>
              ) : (
                "N/A"
              )}
            </td>
            <td className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
              {data?.data[index]?.amountInMatic
                ? convertToEuroWithoutPrecision(
                    data.data[index].amountInMatic.toFixed(4)
                  )
                : "N/A"}
            </td>
            <td className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
              {data?.data[index]?.amountInDeswap
                ? convertToEuroWithoutPrecision(
                    data.data[index].amountInDeswap.toFixed(4)
                  )
                : "N/A"}
            </td>
            <td className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
              {data?.data[index]?.created_at
                ? myRewardsDate(data.data[index].created_at)
                : "N/A"}
            </td>
            <td className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
              {data?.data[index]?.IncommingTxHash ? (
                <a
                  className="transactionhashlink"
                  href={
                    process.env.NEXT_PUBLIC_POLYGON_SCANLINK +
                    "/tx/" +
                    data.data[index].IncommingTxHash
                  }
                  target="_blank"
                >
                  {data.data[index].IncommingTxHash
                    ? data.data[index].IncommingTxHash.slice(
                        0,
                        data.data[index].IncommingTxHash.length - 124
                      ).concat(
                        "...." +
                          data.data[index].IncommingTxHash.slice(
                            62,
                            data.data[index].IncommingTxHash.length
                          )
                      )
                    : "--"}
                </a>
              ) : (
                "N/A"
              )}
            </td>
            <td>{await showStatus(data?.data[index]?.Status)}</td>
          </tr>
        );
      }
      await sethistoryTransaction(transactionHistory);
      await setPagination({
        ...pagination,
        totalData: data.total,
        activePage: data.activePageNo,
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
      
      console.log("Failed to history ", e);
    }
  };
  const handlePageChange = async (pageNumber) => {
    try {
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchSwapHistory({
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

  const fetchSwapHistory = async (data) => {
    try {
      //setLoadingState(true);

      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await encryptRequestBody({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/transaction/fetch/userid`,
        {data: encryptionData},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let historytransaction = await result?.data;
      historytransaction.activePageNo = data?.activePageNo;

      await setTotaltable1Data(historytransaction?.totalData);
      await createHistory(historytransaction);
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
      setLoadingState(false);
      sethistoryTransaction(
        <tr>
          <td className="text-center" colSpan={10}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };

  useEffect(() => {
    void (async () => {
    try {
      //let result =
      //
      await fetchSwapHistory({
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
      
      console.log("Failed to fetch transaction ", e);
    }
      })();
  }, []);

  return (
    <div className="ModalContainer justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg">
      <div className="relative lg:p-4 xl:p-4 sm:p-12 md:p-4 p-12">
        {/*content*/}
        <div
          className="modalmaxWidth border-0 rounded-3xl shadow-lg relative flex flex-col bg-gray-250 outline-none focus:outline-none lg:p-8 xl:p-8 md:p-8 sm:p-12 px-5 py-16 lg:w-88 xl:w-88 sm:w-96 md:w-88 w-78"
          style={{ overflow: "scroll" }}
        >
          {/*header*/}
          <div className="flex items-start items-center justify-between rounded-t mb-10"></div>
          {/*body*/}

          <div className="bordersetall rounded-2xl overflow-x-scroll customScrollOntables tableContainer">
            <table className="min-w-full swapCustomTable">
              <thead>
                <tr className="w-full h-16 border-gray-300 dark:border-gray-200 border-b py-8">
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Public Key
                  </th>
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Amount (Matic)
                  </th>
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Amount (DESWAP)
                  </th>
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Transaction time
                  </th>
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Transaction Hash
                  </th>
                  <th className="dark:text-gray-400 pr-6 text-left tracking-normal leading-4 xl:text-base lg:text-base text-sm font-semibold text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>{historyTransaction}</tbody>
            </table>
            <div>
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
            {/*<button className="connectBtn addNewBtns">
            Connect Wallet
          </button>*/}
          </div>
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
}

export default HistoryModal;
