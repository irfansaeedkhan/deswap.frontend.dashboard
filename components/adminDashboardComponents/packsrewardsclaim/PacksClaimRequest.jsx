import React, { useState, useEffect } from "react";
import Pagination from "@/components/reusables/Pagination";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


const sendIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faPen} />;

var metaMaskValues = null;
const PacksClaimRequest = () => {
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
            gasPrice: gasPrice,
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

  const updatepackStatus = async (updateData) => {
    try {
      const data1=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(data1);

      //pages
      //pages\api\admin\packrewards\update\deactivate.js
      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/packrewards/update/deactivate`,
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
  //
  const updateSuccesFullStatus = async (updateData) => {
    try {
      const sanData=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(sanData);

      //pages
      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/pages/api/admin/packrewards/update`,
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
      await updatepackStatus({
        claimid: dataToUpdate._id,
        rejectReason: disabledReason,
        outgoingtransaction: outgoingtxhash,
        transactionStatus: transactionStatus,
        requestStatus: requestStatus,
      });

      //Fetch Element again
      await setShow(false);
      await fetchClaimmedPackListFunc({
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
        <div className="row claimRewardsEditModal">
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
      if (tableData) {
        setClaimmedPackList(
          tableData.data.map((data, index) => {
            return (
              <tr key={data._id} className="rewardrequestedTR">
                <td>{index + 1}</td>
                <td>
                  {data.PackID && data.PackID._id ? data.PackID._id : "N/A"}
                </td>
                <td>
                  {data.PackID && data.PackID.PackName
                    ? data.PackID.PackName
                    : "N/A"}
                </td>
                <td>
                  {data?.PurchasedPack?.TxHash ? (
                    <a
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${
                        data.PurchasedPack && data.PurchasedPack.TxHash
                      }`}
                    >
                      {data.PurchasedPack &&
                        data.PurchasedPack.TxHash &&
                        reducedWalletAddress(data.PurchasedPack.TxHash)}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{data?.UserID?.emailid ? data?.UserID?.emailid : "N/A"}</td>
                <td>
                  {data?.UserID?.walletaddress[data?.UserID?.walletaddress] ? (
                    <a
                      target="_blank"
                      href={`${
                        process.env.NEXT_PUBLIC_POLYGON_SCANLINK
                      }address/${
                        data.UserID &&
                        data.UserID.walletaddress &&
                        data.UserID.walletaddress[
                          data.UserID.walletaddress.length - 1
                        ]
                      }`}
                    >
                      {data.UserID &&
                        data.UserID.walletaddress &&
                        reducedWalletAddress(
                          data.UserID.walletaddress[
                            data.UserID.walletaddress.length - 1
                          ]
                        )}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>

                {data?.Amount ? (
                  <td>{data.Amount && convertToEuro(data.Amount)} DAW</td>
                ) : (
                  <td> "N/A" </td>
                )}

                <td>
                  {data?.created_at ? myRewardsDate(data.created_at) : "N/A"}
                </td>
                <td>
                  <button
                    className={`${
                      data.Status == "Active" || data.Status == "Claimmed"
                        ? "Unlocked"
                        : "locked"
                    }`}
                  >
                    {data.Status}
                  </button>
                </td>
                <td>
                  <input
                    className="sendBoxColor"
                    type="text"
                    id={"packclaim_" + data._id}
                    defaultValue={
                      data?.Amount ? convertToEuro(data.Amount) : "N/A"
                    }
                  />
                  <div id={"error_message_packclaim_" + data._id}></div>
                </td>
                {/* button01 */}
                <td>
                  <button
                    className={`actionBtn SimpleButton btnHoverEffectOutline`}
                    onClick={(e) => {
                      handleClickOnSendButton({ ...data });
                    }}
                  >
                    {sendIcon}
                  </button>
                </td>
                <td>
                  <button
                    className={`actionBtn SimpleButton btnHoverEffectOutline`}
                    onClick={(e) => {
                      handleEditStatus({ ...data });
                    }}
                  >
                    {editIcon}
                  </button>
                </td>
              </tr>
            );
          })
        );
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
      const sanData=await SanitizeRequestObject(data)
      setClaimmedPackList(<TableLoader colSpan={10} />);
      if (!sanData.offset) {
        sanData.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: sanData.offset,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/clammied/packclaimmedrequest`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      let networkRewards = result.data;
      networkRewards= await SanitizeRequestObject(result.data)
      networkRewards.activePageNo = data.activePageNo;

      await setTotalRewards(result.data.total);
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
  useEffect(() => {
    void (async () => {
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
      })();
  }, []);

  return (
    <div className="stackingpackfeetableContainer">
      <div className="tableContainer">
        <p>Clamming Packs Rewards Request</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">#</th>
                <th>PackID</th>
                <th>Pack Name</th>
                <th>Purchase TxHash</th>
                <th>Email ID</th>
                <th>PublicAddress</th>
                <th>Amount</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Rewards To Send</th>
                <th>Send</th>
                <th>Edit</th>
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
export default connect(mapStateToProps, mapDispatchToProps)(PacksClaimRequest);
//export default PacksClaimRequest;
