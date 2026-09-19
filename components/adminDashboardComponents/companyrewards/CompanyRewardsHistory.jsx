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
import Pagination from "react-js-pagination";
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

function CompanyFeeHistory() {
  const [companyFeeTable1List, setCompanyFeeTable1List] = useState([]);
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
        setCompanyFeeTable1List(
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
                {(loopDate[index] && loopDate[index].CompanyID && loopDate[index].CompanyID.name)
                  ? loopDate[index].CompanyID.name
                  : "N/A"}
              </td>
              <td>
                {(loopDate[index].FromUser && loopDate[index].FromUser.emailid)
                  ? loopDate[index].FromUser.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.FromUser?.walletaddress ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index].FromUser.walletaddress[
                        loopDate[index].FromUser.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {reducedWalletAddress(
                      loopDate[index].FromUser.walletaddress[
                        loopDate[index].FromUser.walletaddress.length - 1
                      ]
                    )}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {(loopDate[index].ToUser && loopDate[index].ToUser.emailid)
                  ? loopDate[index].ToUser.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.ToUser?.walletaddress ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index].ToUser.walletaddress[
                        loopDate[index].ToUser.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {reducedWalletAddress(
                      loopDate[index].ToUser.walletaddress[
                        loopDate[index].ToUser.walletaddress.length - 1
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
                {(loopDate[index] &&
                  loopDate[index]?.Level) ?
                    loopDate[index].Level
                 : "N/A"
                }
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index]?.Currency) ?
                  loopDate[index].Currency
                : "N/A"}
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index].TotalAmount) ?
                  loopDate[index].TotalAmount.toFixed(6)
                : "N/A"}
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index].PercentageToUser) ?
                  loopDate[index].PercentageToUser.toFixed(6) +"%"
                : "N/A"}
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index].AmountToUser) ?
                  loopDate[index].AmountToUser.toFixed(6)
                : "N/A"}
              </td>
              <td>
                {(loopDate[index] &&
                  loopDate[index]?.status) ?
                    loopDate[index].status
                 : "N/A"
                }
              </td>
            </tr>
          );
        }
        //})

        await setCompanyFeeTable1List(outputData);
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
      await setCompanyFeeTable1List(
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
      setCompanyFeeTable1List(<TableLoader colSpan={12} />);
      if (!data1.offset) {
        data1.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/companyrewards/fetch/history`,
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
      setCompanyFeeTable1List(
        <tr>
          <td className="text-center" colSpan={12}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  useEffect(async () => {
    await fetchClaimmedSwapMD({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

  return (
    <div className="SwapMDtableContainer">
      <div className="tableContainer">
        <p>Company Rewards History</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">Sl No</th>
                <th>Company Name</th>
                <th>From Email</th>
                <th>From Public Key</th>
                <th>To Email</th>
                <th>To Public Key</th>
                <th>Datetime</th>
                <th>Level</th>
                <th>Currency</th>
                <th>Total Amount</th>
                <th>Percentage to user</th>
                <th>Amount to user</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{companyFeeTable1List}</tbody>
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

export default CompanyFeeHistory;
