import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import { convertToEuro } from "@/utils/common/currencyconversion";
import Pagination from "@/components/reusables/Pagination";
import {
  ConnectToWeb3,
  formatWei,
} from "../../.././utils/wallet/fetchtransactiondetails";
import TableLoader from "../../reusables/loader/TableLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject} from "../../../utils/common/sanitize"

//
export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function SwapRequested() {
  const [swapMDTable1List, setSwapMDTable1List] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [totaltable1Data, setTotaltable1Data] = useState("");
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });

  const formatWei = async (wei) => {
    return Number(wei) / 1e18;
  };

  /*
  const ConnectToWeb3 = async (checkPriceTransactionHash)=>{
    try{

      if(checkPriceTransactionHash==null||checkPriceTransactionHash==undefined||checkPriceTransactionHash.trim()==""){
        return null;
      }
      let web3Ch = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK));
      let transactionInfo = await web3Ch.eth.getTransaction(checkPriceTransactionHash)
      
      return transactionInfo;
    }catch(e){
      console.log("Error ",e)
      return null;
    }
  }*/

  const createTableData = async (tableData) => {
    try {
      //
      if (tableData.data.length < 1) {
        setSwapMDTable1List(
          <tr>
            <td className="text-center" colSpan={12}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }
      //
      let outputData = [];

      for (let index in tableData.data) {
        let transactionDetails = await ConnectToWeb3(
          tableData.data[index].IncommingTxHash
        );
        if (transactionDetails && transactionDetails.value) {
          transactionDetails.convertedAmount = await formatWei(
            transactionDetails.value
          );
          tableData.data[index].transactionDetails = transactionDetails;
        }

        let transactionDetailsOutgoing = await ConnectToWeb3(
          tableData.data[index].OutgoingTxHash
        );
        if (transactionDetailsOutgoing && transactionDetailsOutgoing.value) {
          transactionDetailsOutgoing.convertedAmount = await formatWei(
            transactionDetailsOutgoing.value
          );
          tableData.data[index].transactionDetailsOutgoing =
            transactionDetailsOutgoing;
        }
      }
      if (tableData) {
        //

        let loopDate = tableData.data;
        //tableData.data.map((data, index) => {
        for (let index in loopDate) {
          outputData.push(
            <tr key={loopDate[index]._id}>
              <td>{Number(index) + 1}</td>
              <td>
                {loopDate[index].UserTo && loopDate[index].UserTo.emailid
                  ? loopDate[index].UserTo.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.UserTo?.walletaddress ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index].UserTo.walletaddress[
                        loopDate[index].UserTo.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {reducedWalletAddress(
                      loopDate[index].UserTo.walletaddress[
                        loopDate[index].UserTo.walletaddress.length - 1
                      ]
                    )}
                  </a>
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
                {loopDate[index]?.IncommingTxHash ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].IncommingTxHash}`}
                  >
                    {loopDate[index].IncommingTxHash &&
                      reducedWalletAddress(loopDate[index].IncommingTxHash)}
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
                      {loopDate[index].transactionDetails.convertedAmount}
                    </div>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index]?.OutgoingTxHash ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].OutgoingTxHash}`}
                  >
                    {loopDate[index].OutgoingTxHash &&
                      reducedWalletAddress(loopDate[index].OutgoingTxHash)}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index]?.transactionDetailsOutgoing ? (
                  <div>
                    <div>From</div>
                    <div>
                      <a
                        target="_blank"
                        href={`${
                          process.env.NEXT_PUBLIC_POLYGON_SCANLINK
                        }address/${
                          loopDate[index].transactionDetailsOutgoing &&
                          loopDate[index].transactionDetailsOutgoing.from
                        }`}
                      >
                        {loopDate[index].transactionDetailsOutgoing &&
                          reducedWalletAddress(
                            loopDate[index].transactionDetailsOutgoing.from
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
                          loopDate[index].transactionDetailsOutgoing &&
                          loopDate[index].transactionDetailsOutgoing.to
                        }`}
                      >
                        {loopDate[index].transactionDetailsOutgoing &&
                          reducedWalletAddress(
                            loopDate[index].transactionDetailsOutgoing.to
                          )}
                      </a>
                    </div>
                    <div>Amount</div>
                    <div>
                      {loopDate[index].transactionDetailsOutgoing &&
                        loopDate[index].transactionDetailsOutgoing
                          .convertedAmount}
                    </div>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index]?.amountInMatic
                  ? convertToEuro(loopDate[index].amountInMatic)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.amountInDeswap
                  ? convertToEuro(loopDate[index].amountInDeswap)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index].correctAmountInDeswap
                  ? convertToEuro(loopDate[index].correctAmountInDeswap)
                  : "N/A"}
              </td>
              <td>
                <div>
                  {loopDate[index].TransactionValid ? (
                    "Correct"
                  ) : (
                    <div>
                      Invalid transaction <br />{" "}
                      <span style={{ color: "#e44757", fontWeight: "700" }}>
                        Reason:
                      </span>{" "}
                      <br />
                      {loopDate[index]?.transactionIssueDescription
                        ? loopDate[index].transactionIssueDescription
                        : "N/A"}
                    </div>
                  )}
                </div>
              </td>
              <td>
                {loopDate[index]?.Status ? loopDate[index].Status : "N/A"}
              </td>
              <td>
                {loopDate[index]?.requestRejectIssueDescription
                  ? loopDate[index].requestRejectIssueDescription
                  : "N/A"}
              </td>
            </tr>
          );
        }
        //})

        await setSwapMDTable1List(outputData);
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
      console.log(e);
      await setSwapMDTable1List(
        <tr>
          <td className="text-center" colSpan={12}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };
  const handlePageChange = async (pageNumber) => {
    try {
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchClaimmedSwapMD({
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
  const fetchClaimmedSwapMD = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data)
      setSwapMDTable1List(<TableLoader colSpan={12} />);
      if (!data1.offset) {
        data1.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/swap/fetch/history`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      let SwapMD = result?.data;
      SwapMD=await SanitizeRequestObject(SwapMD)
      SwapMD.activePageNo = data?.activePageNo;
      await setTotaltable1Data(SwapMD?.total);
      await createTableData(SwapMD);
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
      setSwapMDTable1List(
        <tr>
          <td className="text-center" colSpan={12}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  useEffect(() => {
    void (async () => {
    await fetchClaimmedSwapMD({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
      })();
  }, []);

  return (
    <div className="SwapMDtableContainer">
      <div className="tableContainer">
        <p>Swap History</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">Sl No</th>
                <th>Email ID</th>
                <th>Public Key</th>
                <th>Datetime</th>
                <th>Incomming txhash</th>
                <th>Web3 Incomming details</th>
                <th>Outgoing txhash</th>
                <th>Web3 Outgoing details</th>
                <th>Amount In Matic</th>
                <th>Requested Amount In DAW</th>
                <th>Checked Amount In DAW</th>
                <th>Transaction Check status</th>
                <th>Request Status</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>{swapMDTable1List}</tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="total">{/*<p>Total {totaltable1Data} Item</p>*/}</div>
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
            {/*<p>Total {totaltable1Data ? totaltable1Data : "N/A"} Item</p>*/}
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

export default SwapRequested;
