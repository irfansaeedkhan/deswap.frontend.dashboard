import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import {
  ConnectToWeb3,
  formatWei,
} from "../../../utils/wallet/fetchtransactiondetails";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import BootstrapModal from "../../reusables/BootstrapModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


const editIcon = <FontAwesomeIcon icon={faPen} />;

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};

function RequestedNFTLicenseTable() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Edit");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [updateButton, setUpdateButton] = useState("Update");

  const [requestedNFTLicenseList, setRequestedNFTLicenseList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [totalRequested, setTotalRequested] = useState("");
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });

  //
  const closeConnectButtonClick = async () => {
    try {
      await setShow(false);
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
  };

  //
  const updateSuccesFullStatus = async (updateData) => {
    try {
      const sanData=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(sanData);

      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/userpurchased/update/status`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      return true;
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
      throw new Error(e.message);
    }
  };
  //
  const updateFunction = async (dataToUpdate) => {
    try {
      //
      let validTransactionStatusObj = document.getElementById(
        "updatetransactionvalid"
      );
      if (!validTransactionStatusObj) {
        return;
      }
      let transactionStatus = validTransactionStatusObj.value;
      if (transactionStatus == "Noselect") {
        //
        transactionStatus == "";
      }

      let requestStatusObject = document.getElementById("updatestatus");
      if (!requestStatusObject) {
        return;
      }

      let requestStatus = requestStatusObject.value;
      if (requestStatus == "Noselect") {
        //
        requestStatus = "";
      }

      let disabledReasonobj = document.getElementById("disablereason");
      if (!disabledReasonobj) {
        return;
      }
      let disabledReason = disabledReasonobj.value;

      setUpdateButton("Updating...");
      await updateSuccesFullStatus({
        claimid: dataToUpdate._id,
        rejectReason: disabledReason,
        transactionStatus: transactionStatus,
        requestStatus: requestStatus,
      });

      //Fetch Element again
      await setShow(false);
      await fetchRequestedNFTLicense({
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
      console.log("Updated function ", e);
      await setShow(true);
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-6 offset-3">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  //
  const handleEditStatus = async (editButtonStatus) => {
    try {
      await setShow(true);
      await setModalBody(
        <div className="row swapMDEditModal">
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Request ID</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                defaultValue={editButtonStatus._id}
                disabled
              ></input>
            </div>
          </div>

          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Email ID</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                defaultValue={editButtonStatus.UserID.emailid}
                disabled
              ></input>
            </div>
          </div>
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Transaction valid</div>
            <div className="col-12 col-sm-6 inputs">
              <select
                name="status"
                id="updatetransactionvalid"
                className="dropdowns"
              >
                <option value="Noselect" selected="selected">
                  Please select
                </option>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
            </div>
          </div>
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Status</div>
            <div className="col-12 col-sm-6">
              <select name="status" id="updatestatus" className="dropdowns">
                <option value="Noselect" selected="selected">
                  Please select
                </option>
                <option value="Rejected">Reject</option>
                <option value="Deactive">Deactive</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-sm-12 labels">Disable Reason</div>
          <div className="col-12 col-sm-12">
            {/* <input
              type="text"
              id="disablereason"
              className="updateInputField"
              style={{
                backgroundColor: "#474747",
                color: "white",
                padding: "0.5rem",
                borderRadius: "1rem",
                width: "100%",
                margin: "0.5rem",
              }}
            ></input> */}
            <textarea
              id="disablereason"
              className="updateInputField"
              rows="4"
              cols="50"
            ></textarea>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-sm-6 col-6">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                No
              </button>
            </div>
            <div className="col-sm-6 col-6">
              <button
                className="modalauthorizationbutton SimpleButton btnHoverEffectOutline"
                onClick={() => {
                  updateFunction(editButtonStatus);
                }}
              >
                {updateButton}
              </button>
            </div>
          </div>
        </div>
      );
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
      console.log("Failed to edit transaction ", e);
    }
  };
  //
  const createTableData = async (tableData) => {
    try {
      if (tableData.data.length < 1) {
        setRequestedNFTLicenseList(
          <tr>
            <td className="text-center" colSpan={12}>
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

        //setClaimmedNetworkRewardsList();
        for (let index in loopDate) {
          outputData.push(
            <tr key={loopDate[index]?.UserID}>
              <td>{index + 1}</td>
              <td>
                {loopDate[index]?.UserID?.emailid
                  ? loopDate[index]?.UserID?.emailid
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.NftLicense?.Name
                  ? loopDate[index]?.NftLicense?.Name
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.NftLicense?.Price
                  ? loopDate[index]?.NftLicense?.Price
                  : "N/A"}{" "}
              </td>
              <td>
                {loopDate[index]?.TotalAmountInMatic
                  ? convertToEuro(loopDate[index].TotalAmountInMatic)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.CorrectTotalMatic
                  ? convertToEuro(loopDate[index].CorrectTotalMatic)
                  : "N/A"}
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
                      reducedWalletAddress(loopDate[index]?.TxHash)}
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
                {loopDate[index]?.IssuewithTransaction
                  ? loopDate[index]?.IssuewithTransaction
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.TransactionValid
                  ? loopDate[index]?.TransactionValid
                  : "N/A"}
              </td>
              <td>
                <button
                  class="actionBtn SimpleButton btnHoverEffectOutline"
                  onClick={(e) => {
                    handleEditStatus({ ...loopDate[index] });
                  }}
                >
                  {editIcon}
                </button>
              </td>
            </tr>
          );
        }

        setRequestedNFTLicenseList(outputData);
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
      console.log(e?.message);

      setRequestedNFTLicenseList(
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
      setRequestedNFTLicenseList(<TableLoader colSpan={12} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchRequestedNFTLicense({
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
  const fetchRequestedNFTLicense = async (data) => {
    try {
      setRequestedNFTLicenseList(<TableLoader colSpan={12} />);
      setLoadingState(true);

      const data1=await SanitizeRequestObject(data)

      if (!data1.offset) {
        data1.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/userpurchased/requested`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      let nftRequested = result?.data;
      nftRequested=await SanitizeRequestObject(nftRequested)
      nftRequested.activePageNo = data?.activePageNo;
      await setTotalRequested(nftRequested?.total);
      await createTableData(nftRequested);
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
      setRequestedNFTLicenseList(
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
    await fetchRequestedNFTLicense({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

  return (
    <div className="PurchasedNftLicensetableContainer">
      <div className="tableContainer">
        <p>Requested NFT License Table</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th>SL.No</th>
                <th>User Email ID</th>
                <th>License Name</th>
                <th>License Price (USD)</th>
                <th>License Price (Matic)</th>
                <th>Corrected Price (Matic)</th>
                <th>Txhash</th>
                <th>Txhash Details</th>
                <th>Requested On</th>
                <th>Issue with transaction</th>
                <th>Transaction valid</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{requestedNFTLicenseList}</tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalRequested ? totalRequested : "N/A"}</p>
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
            <p>Total Items : {totalRequested ? totalRequested : "N/A"}</p>
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
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
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

export default RequestedNFTLicenseTable;
