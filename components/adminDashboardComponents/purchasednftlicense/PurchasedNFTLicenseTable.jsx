import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Pagination from "@/components/reusables/Pagination";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import {
  ConnectToWeb3,
  formatWei,
} from "@/utils/wallet/fetchtransactiondetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function PurchasedNFTLicenseTable() {
  const [purchasedNFTLicenseList, setPurchasedNFTLicenseList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [totalPurchased, setTotalPurchased] = useState("");
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
        setPurchasedNFTLicenseList(
          <tr>
            <td className="text-center" colSpan={7}>
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
            transactionDetails && transactionDetails.value
          );
          tableData.data[index].transactionDetails = transactionDetails;
        }
      }

      if (tableData) {
        let loopDate = tableData.data;
        let outputData = [];

        //setClaimmedNetworkRewardsList();
        for (let index in loopDate) {
          outputData.push(
            <tr>
              <td>
                {loopDate[index]?.NftLicense?.Name
                  ? loopDate[index]?.NftLicense?.Name
                  : "N/A"}
              </td>
              {loopDate[index]?.NftLicense?.Price ? (
                <td>{loopDate[index]?.NftLicense?.Price} USD</td>
              ) : (
                <td>N/A</td>
              )}
              <td>
                {loopDate[index]?.UserID?.emailid
                  ? loopDate[index]?.UserID?.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index].UserID.walletaddress[
                  loopDate[index].UserID.walletaddress
                ] ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                      loopDate[index] &&
                      loopDate[index].UserID &&
                      loopDate[index].UserID.walletaddress[
                        loopDate[index].UserID.walletaddress.length - 1
                      ]
                    }`}
                  >
                    {loopDate[index] &&
                      loopDate[index].UserID &&
                      reducedWalletAddress(
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
                {loopDate[index].TotalAmount ? loopDate[index].TotalAmount : 0}{" "}
                Matic
              </td>
              <td>
                {loopDate[index].CorrectTotalMatic
                  ? loopDate[index].CorrectTotalMatic
                  : 0}{" "}
                Matic{" "}
              </td>
              <td>
                {loopDate[index]?.TxHash ? (
                  <a
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${
                      loopDate[index] && loopDate[index].TxHash
                    }`}
                  >
                    {loopDate[index] &&
                      reducedWalletAddress(loopDate[index].TxHash)}
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
                          reducedWalletAddress(
                            loopDate[index].transactionDetails.to
                          )}
                      </a>
                    </div>
                    <div>Amount</div>
                    <div>
                      {loopDate[index] &&
                        loopDate[index].transactionDetails &&
                        convertToEuro(
                          loopDate[index].transactionDetails.convertedAmount
                        )}
                    </div>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td> </td>
              <td> </td>
              <td>
                <button
                  class={`${
                    loopDate[index]?.Status == "Active" ? "Unlocked" : "locked"
                  }`}
                >
                  {loopDate[index]?.Status}{" "}
                </button>
              </td>
            </tr>
          );
        }

        setPurchasedNFTLicenseList(outputData);
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
      setPurchasedNFTLicenseList(
        <tr>
          <td className="text-center" colSpan={7}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };
  const handlePageChange = async (pageNumber) => {
    try {
      setPurchasedNFTLicenseList(<TableLoader colSpan={11} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchPurchasedNFTLicense({
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
  const fetchPurchasedNFTLicense = async (data) => {
    try {
      setPurchasedNFTLicenseList(<TableLoader colSpan={11} />);

      
      const data1= await SanitizeRequestObject(data)
      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/userpurchased/notrequested`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      let nftPurchased = result?.data;
      nftPurchased=await SanitizeRequestObject(nftPurchased)
      nftPurchased.activePageNo = data?.activePageNo;
      await setTotalPurchased(nftPurchased?.total);
      await createTableData(nftPurchased);
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
      setPurchasedNFTLicenseList(
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
    await fetchPurchasedNFTLicense({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
      })();
  }, []);

  return (
    <div className="PurchasedNftLicensetableContainer">
      <div className="tableContainer">
        <p>Purchased NFT License Table</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th>License Name</th>
                <th>License Purchased Price</th>
                <th>Email id</th>
                <th>Wallet address</th>
                <th>Price (Matic)</th>
                <th>Corrected Amount (Matic)</th>
                <th>TX Hash</th>
                <th>TX Hash Details</th>
                <th>Transaction Valid</th>
                <th>Rejection Reason</th>
                <th>License Status</th>
              </tr>
            </thead>
            <tbody>{purchasedNFTLicenseList}</tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalPurchased ? totalPurchased : "N/A"}</p>
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
            <p>Total Items : {totalPurchased ? totalPurchased : "N/A"}</p>
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
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default PurchasedNFTLicenseTable;
