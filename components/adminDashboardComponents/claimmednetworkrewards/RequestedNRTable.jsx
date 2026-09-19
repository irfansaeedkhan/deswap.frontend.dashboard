import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Pagination from "react-js-pagination";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { wrapper } from "../../../redux/store/store";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import BootstrapModal from "../../reusables/BootstrapModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "../../../utils/common/sanitize";
import Image from "next/image";

const sendIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faPen} />;

var metaMaskValues = null;
function RequestedNRTable() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Edit");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [updateButton, setUpdateButton] = useState("Update");
  const [rewardsNetworkRewardsList, setRewardsNetworkRewardsList] = useState(
    []
  );
  const [loadingState, setLoadingState] = useState(false);
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
    }
  };

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
      return null;
    }
  };

  const updateSuccesFullStatus = async (updateData) => {
    try {
      let SanData = await SanitizeRequestObject(updateData);
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(SanData);

      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/network/rewards/update/successfullysent`,
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

  const updateSuccesStatus = async (updateData) => {
    try {
      const sanData = await SanitizeRequestObject(updateData);
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(sanData);

      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/network/rewards/update/rejected`,
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

      let updateOutgoingTx = document.getElementById("updateOutgoingTx");
      if (!updateOutgoingTx) {
        return;
      }
      let outgoingtxhash = updateOutgoingTx.value;

      let disabledReasonobj = document.getElementById("disablereason");
      if (!disabledReasonobj) {
        return;
      }
      let disabledReason = disabledReasonobj.value;

      setUpdateButton("Updating...");
      await updateSuccesStatus({
        claimid: dataToUpdate._id,
        rejectReason: disabledReason,
        outgoingtransaction: outgoingtxhash,
        transactionStatus: transactionStatus,
        requestStatus: requestStatus,
      });

      //Fetch Element again
      await setShow(false);
      await fetchRewardsNetworkRewards({
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
        <div className="row swapMDEditModal">
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Request ID</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                defaultValue={editButtonStatus?._id}
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
                defaultValue={editButtonStatus?.UserID?.emailid}
                disabled
              ></input>
            </div>
          </div>

          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Outgoing txhash</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                id="updateOutgoingTx"
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

  const handleClickOnSendButton = async (requestedTransactionData) => {
    try {
      //Check here

      if (!metaMaskValues.metamaskconnected) {
        await setShow(true);
        await setModalHeader(<div>Connect to wallet</div>);
        setModalBody(
          <div className="modalcontentSuccess buydeswap modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Connectwallet.png"
                  alt={"deswap image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="contentbox">
              <h5>Wallet Not Connected</h5>
              <p>Please Connect To Wallet Using Connect Button</p>
            </div>
          </div>
        );
        setModalFooter(
          <div className="buydeswapbuttonCotainer">
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Ok
            </button>
          </div>
        );
        return;
      }

      let idObject = document.getElementById(
        "network_reward_" + requestedTransactionData.requestid
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
        "error_message_request_" + requestedTransactionData.requestid
      );
      if (!messageObject) {
        return;
      }

      let result = await etherumTransaction({
        sender: metaMaskValues.metamaskaccount,
        amount: converToUSD.toString(),
        receiver: requestedTransactionData.publickey,
        //contractAddress: `${process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON}`,
      });
      if (result && result.transactionHash != undefined) {
        //
        let updateResult = await updateSuccesFullStatus({
          txhash: result.transactionHash,
          amountSent: Number(converToUSD),
          rewardid: requestedTransactionData.requestid,
        });

        if (updateResult) {
          //Refresh or show pop message
          await fetchRewardsNetworkRewards({
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
      if (tableData.data.length < 1) {
        setRewardsNetworkRewardsList(
          <tr>
            <td className="text-center" colSpan={11}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }

      /**
      for (let index in tableData.data) {
        let transactionDetails = await ConnectToWeb3(tableData.data[index].TxHash);
        transactionDetails.convertedAmount = await formatWei(transactionDetails.value);
        tableData.data[index].transactionDetails = transactionDetails;
      }
       */
      if (tableData) {
        let loopDate = tableData.data;
        let outputData = [];

        for (let index in loopDate) {
          outputData.push(
            <tr>
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
                {loopDate[index].UserID.walletaddress[
                  loopDate[index].UserID.walletaddress
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
                {loopDate[index]?.Amount
                  ? convertToEuro(loopDate[index].Amount)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.created_at
                  ? myRewardsDate(loopDate[index].created_at)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.Status ? loopDate[index]?.Status : "N/A"}
              </td>
              <td>
                <input
                  className="sendBoxColor"
                  type="text"
                  id={"network_reward_" + loopDate[index]._id}
                  defaultValue={
                    loopDate[index]?.Amount
                      ? convertToEuro(loopDate[index].Amount)
                      : "N/A"
                  }
                />
                <div id={"error_message_request_" + loopDate[index]._id}></div>
              </td>
              <td>
                <button
                  className={`actionBtn SimpleButton btnHoverEffectOutline`}
                  onClick={(e) => {
                    handleClickOnSendButton({
                      target: e,
                      requestid: loopDate[index]._id,
                      publickey:
                        loopDate[index].UserID.walletaddress[
                          loopDate[index].UserID.walletaddress.length - 1
                        ],
                    });
                  }}
                >
                  {sendIcon}
                </button>
              </td>
              <td>
                <button
                  // className={`${
                  //   loopDate[index].Status == "Active" ||
                  //   loopDate[index].Status == "Claimmed"
                  //     ? "Unlocked"
                  //     : "locked"
                  // }`}
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
        //
        setRewardsNetworkRewardsList(outputData);

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
      setRewardsNetworkRewardsList(
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
      setRewardsNetworkRewardsList(<TableLoader colSpan={11} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchRewardsNetworkRewards({
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
  const fetchRewardsNetworkRewards = async (data) => {
    try {
      let data1 = await SanitizeRequestObject(data);
      setRewardsNetworkRewardsList(<TableLoader colSpan={11} />);

      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/clammied/networkclaimmedrequested`,
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
      networkRewards = await SanitizeRequestObject(networkRewards);
      //setNetworkData(result?.data);
      networkRewards.activePageNo = data?.activePageNo;
      await setTotalRewards(networkRewards?.total);
      await createTableData(networkRewards);
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
      setRewardsNetworkRewardsList(
        <tr>
          <td className="text-center" colSpan={11}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  useEffect(async () => {
    await fetchRewardsNetworkRewards({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

  return (
    <div className="ClaimmednetworkrewardstableContainer">
      <div className="tableContainer">
        <p>Requested Network Rewards Table</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">SL.No</th>
                <th>Rewards From</th>
                <th>Rewards To</th>
                <th>Public key</th>
                <th>Requested Amount</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Matic to send</th>
                <th>Send</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{rewardsNetworkRewardsList}</tbody>
          </table>
        </div>
        <div className="pagination">
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
        <div className="pagination mobile">
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
      </div>
      {/* {loadingState && <Loader />} */}
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
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

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkAdminAuth(ctx);
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
export default connect(mapStateToProps, mapDispatchToProps)(RequestedNRTable);
