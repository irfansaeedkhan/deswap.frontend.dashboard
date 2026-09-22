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

function PublickeyFeeHistory() {
  const [publickeyFeeTable1List, setPublickeyFeeTable1List] = useState([]);
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
        setPublickeyFeeTable1List(
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
        //

        let loopDate = tableData.data;
        //tableData.data.map((data, index) => {
        for (let index in loopDate) {
          outputData.push(
            <tr key={loopDate[index]._id}>
              <td>{Number(index) + 1}</td>
              <td>
                {(loopDate[index].uuid && loopDate[index].uuid.emailid)
                  ? loopDate[index].uuid.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.uuid?.walletaddress ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index].uuid.walletaddress[
                        loopDate[index].uuid.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {reducedWalletAddress(
                      loopDate[index].uuid.walletaddress[
                        loopDate[index].uuid.walletaddress.length - 1
                      ]
                    )}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {loopDate[index].created_at ? myRewardsDate(loopDate[index].created_at) : "N/A"}
              </td>
              <td>
                {loopDate[index]?.TxHash ?
                                <a
                                target="_blank"
                                href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].TxHash}`}
                              >
                                {loopDate[index] &&
                                  loopDate[index].TxHash &&
                                  reducedWalletAddress(loopDate[index].TxHash)}
                              </a>
                              : "N/A"
              }

              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index]?.Amount) ?
                    loopDate[index].Amount
                 : "N/A"
                }
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index]?.AmountInMatic) ?
                  loopDate[index].AmountInMatic.toFixed(6)
                : "N/A"}
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index].CorrectAmountInMatic) ?
                  loopDate[index].CorrectAmountInMatic.toFixed(6)
                : "N/A"}
              </td>
              <td>
                {loopDate[index]?.transactionDetails ?
                 <div>
                 <div>From</div>
                 <div>
                   <a
                     target="_blank"
                     href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].transactionDetails.from}`}
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
                     href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].transactionDetails.to}`}
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
                   {loopDate[index] &&
                     loopDate[index].transactionDetails &&
                     loopDate[index].transactionDetails.convertedAmount &&
                     loopDate[index].transactionDetails.convertedAmount}
                 </div>
               </div> 
               : "N/A"
              }
               
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
                      {loopDate[index].TransactionInvalidReason}
                    </div>
                  )}
                </div>
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index]?.ConversionRate) ?
                    loopDate[index].ConversionRate
                 : "N/A"
                }
              </td>
              <td>
              <div>
                  {loopDate[index] && loopDate[index].Status !=="Rejected" ? (
                    loopDate[index].Status
                  ) : (
                    <div>
                    {loopDate[index].Status}<br/>
                      <span style={{ color: "#e44757", fontWeight: "700" }}>
                        Reason:
                      </span>{" "}
                      <br />
                      {loopDate[index].requestRejectIssueDescription}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        }
        //})

        await setPublickeyFeeTable1List(outputData);
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
      await setPublickeyFeeTable1List(
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
      setPublickeyFeeTable1List(<TableLoader colSpan={12} />);
      if (!data1.offset) {
        data1.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/publickey/fetch/history`,
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
      setPublickeyFeeTable1List(
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
                <th>Transaction txhash</th>
                <th>Amount In Dollar</th>
                <th>Amount In Matic</th>
                <th>Correct Amount in Matic</th>
                <th>Transaction Details</th>
                <th>Transaction Valid</th>
                <th>Conversion Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{publickeyFeeTable1List}</tbody>
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

export default PublickeyFeeHistory;
