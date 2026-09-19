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
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Web3 from "web3";
import { bindActionCreators } from "redux";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import BootstrapModal from "../../reusables/BootstrapModal";
import {
  ConnectToWeb3,
  formatWei,
} from "../../.././utils/wallet/fetchtransactiondetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
const editIcon = <FontAwesomeIcon icon={faPen} />;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


var metaMaskValues = null;
const PacksPurchasedRequest = () => {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Edit");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [updateButton, setUpdateButton] = useState("Update");

  const [loadingState, setLoadingState] = useState(true);
  const [claimmedPackList, setClaimmedPackList] = useState([]);
  const [totalRewards, setTotalRewards] = useState("");

  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });

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
      await fetchClaimmedSwapMD({
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

  const handleEditStatus = async (editButtonStatus) => {
    try {
      await setShow(true);
      await setModalBody(
        <div className="row packsPurchaseRequestEditModal">
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
            <div className="col-12 col-sm-6">
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
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to edit transaction ", e);
    }
  };
  //
  const etherumTransaction = async (data) => {
    try {
      //
      //
      let params;
      data.amount = await metaMaskValues.metaconn.web3.utils.toWei(data.amount);

      //
      let gasPrice = await metaMaskValues.metaconn.web3.eth.getGasPrice();

      let transactionHash;
      if (data.contractAddress) {
        transactionHash = await sendContractTransaction(
          metaMaskValues.web3contract,
          {
            sender: data.sender,
            amount: data.amount,
            receiver: data.receiver,
            //gas:"0x76c0",
            gasPrice: gasPrice,
            //count:"0x" + count.toString(16)
          }
        );
      } else {
        params = {
          from: data.sender,
          to: data.receiver,
          //"nonce":  "0x" + count.toString(16),
          //"gas": "0x76c0",
          value: "0x" + Number(data.amount).toString(16),
          gasPrice: gasPrice,
          data: "0x",
        };
        transactionHash = await sendMetaMaskTransaction(
          metaMaskValues.metaconn.web3,
          params
        );
      }
      return transactionHash;
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
      return null;
    }
  };

  const updateSuccesFullStatus = async (updateData) => {
    try {
      const sanData=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(sanData);

      //pages
      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/purchasedpack/updated/requested`,
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
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      throw new Error(e.message);
    }
  };
  //
  const handleClickOnSendButton = async (requestedTransactionData) => {
    try {
      //Check here
      if (!metaMaskValues.metamaskconnected) {
        await setShow(true);
        await setModalHeader(<div>Connect to wallet</div>);
        await setModalBody(
          <div className="cointainer-fluid">
            <div className="row">
              <div className="col-sm-12">Please connect to wallet</div>
            </div>
          </div>
        );
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
        return;
      }

      let idObject = document.getElementById(
        "packclaim_" + requestedTransactionData._id
      );
      if (!idObject) {
        return;
      }
      let dawToSendInEuroFormat = idObject.value;
      let converToUSD = await convertToUSD(dawToSendInEuroFormat);
      if (isNaN(converToUSD)) {
        return;
      }
      let messageObject = document.getElementById(
        "error_message_packclaim_" + requestedTransactionData._id
      );
      if (!messageObject) {
        return;
      }

      let result = await etherumTransaction({
        sender: metaMaskValues.metamaskaccount,
        amount: converToUSD.toString(),
        receiver:
          requestedTransactionData.UserID.walletaddress[
            requestedTransactionData.UserID.walletaddress.length - 1
          ],
        contractAddress: `${process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON}`,
      });
      if (result && result.transactionHash != undefined) {
        //
        let updateResult = await updateSuccesFullStatus({
          txhash: result.transactionHash,
          amountSent: Number(converToUSD),
          claimid: requestedTransactionData._id,
        });

        if (updateResult) {
          //Refresh or show pop message
          await fetchClaimmedPackListFunc({
            offset: 0,
            limit: 10,
            activePageNo: 1,
          });
        }
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
      console.log("Failed to send connect ", e);
      await setShow(true);
      await setModalHeader(<div>Failed transaction</div>);
      await setModalBody(
        <div className="cointainer-fluid">
          <div className="row">
            <div className="col-sm-12">Failed to send : {e.message}</div>
          </div>
        </div>
      );
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
                  ? loopDate[index].PackID.PackName
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
                {loopDate[index]?.TotalAmountInMatic
                  ? convertToEuro(loopDate[index].TotalAmountInMatic)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.TotalCorrectAmountInMatic
                  ? convertToEuro(loopDate[index].TotalCorrectAmountInMatic)
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
              <td>{loopDate[index].TransactionValid ? "Valid" : "Invalid"}</td>
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
              <td>
                <button
                  className={`actionBtn SimpleButton btnHoverEffectOutline`}
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
        await setClaimmedPackList(outputData);
        /*
                setClaimmedPackList(tableData.data.map((data, index) => {
                    return (
                        <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.PackID && reducedWalletAddress(data.PackID._id)}</td>
                            <td>{data.PackID && data.PackID && data.PackID.PackName}</td>
                            <td>{data.PurchasedPack && data.PurchasedPack.TxHash && reducedWalletAddress(data.PurchasedPack.TxHash)}</td>
                            <td>{data.UserID && data.UserID.emailid}</td>
                            <td>{data.UserID && data.UserID.walletaddress && reducedWalletAddress(data.UserID.walletaddress[data.UserID.walletaddress.length - 1])}</td>
                            <td>{data.Amount} DAW</td>
                            <td>{data?.created_at ? myRewardsDate(data.created_at) : "N/A"}</td>
                            <td>
                                <button className={`${data.Status == 'Active' || data.Status == 'Claimmed' ? 'Unlocked' : 'locked'}`}>
                                    {data.Status}
                                </button>
                            </td>
                            <td>
                                <input className="sendBoxColor" type="text" id={"packclaim_" + data._id}
                                    defaultValue={convertToEuro(data.Amount)}
                                />
                                <div id={"error_message_packclaim_" + data._id}></div>
                            </td>
                            <td>
                                <button className={`Unlocked`} onClick={(e) => { handleClickOnSendButton({ ...data }) }}>
                                    Send
                                </button>
                            </td>
                            <td>
                                <button
                                    className={`${data.Status == "Active" || data.Status == "Claimmed"
                                        ? "Unlocked"
                                        : "locked"
                                        }`}

                                    onClick={(e) => { handleEditStatus({ ...data }) }}
                                >
                                    Edit
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
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/purchasedpack/fetch/requested`,
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
        <p>Purchased Pack Request</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">#</th>
                <th>Pack Name</th>
                <th>Quantity</th>
                <th>Email ID</th>
                <th>PublicAddress</th>
                <th>Amount (Matic)</th>
                <th>Corrected Amount (Matic)</th>
                <th>TxHash</th>
                <th>TxHash Status</th>
                <th>Status</th>
                <th>Purchased Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{claimmedPackList}</tbody>
          </table>
        </div>
        <BootstrapModal
          show={show}
          handleClose={closeConnectButtonClick}
          modaltitle={modalheader}
          modalbody={modalbody}
          modalfooter={modalfooter}
        ></BootstrapModal>
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

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkUserAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

/**/
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PacksPurchasedRequest);
//export default PacksClaimRequest;
