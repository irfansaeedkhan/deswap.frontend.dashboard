import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Pagination from "react-js-pagination";
import {
  ConnectToWeb3,
  formatWei,
} from "../../.././utils/wallet/fetchtransactiondetails";
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
const sendIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faPen} />;
import TableLoader from "../../reusables/loader/TableLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject} from "../../../utils/common/sanitize"


var metaMaskValues = null;
function CompanyRewardsRequested() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Edit");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [updateButton, setUpdateButton] = useState("Update");
  const [companyFeeTable1List, setCompanyFeeTable1List] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [totaltable1Data, setTotaltable1Data] = useState("");
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
  /*
  const ConnectToWeb3 = async (checkPriceTransactionHash)=>{
    try{

      if(checkPriceTransactionHash.trim()==""){
        return (
          null
        );
      }
      let web3Ch = new Web3(
        new Web3.providers.HttpProvider(
          process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK
        )
      );
      let transactionInfo = await web3Ch.eth.getTransaction(
        checkPriceTransactionHash
      );

      return transactionInfo;
    } catch (e) {
      console.log("Error ", e);
      return null;
    }
  }*/

  const updateSuccesFullStatus = async (updateData) => {
    try {
      const data=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(data);

      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/companyrewards/update/details`,
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
        requestStatus: requestStatus,
      });

      //Fetch Element again
      await setShow(false);
      await fetchCompanyFee({
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
                defaultValue={editButtonStatus.FromUser.emailid}
                disabled
              ></input>
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

    const createTableData = async (tableData) => {
    try {
      //

      if (tableData.data.length < 1) {
        setCompanyFeeTable1List(
          <tr>
            <td className="text-center" colSpan={13}>
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
        if (transactionDetails != null && transactionDetails != undefined) {
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
            <tr className="swaprequestedTR" key={loopDate[index]._id}>
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
          <td className="text-center" colSpan={10}>
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
      await fetchCompanyFee({
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
  const fetchCompanyFee = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data)
      setCompanyFeeTable1List(<TableLoader colSpan={13} />);

      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/companyrewards/fetch/requested`,
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
          <td className="text-center" colSpan={10}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };
  useEffect(async () => {
    await fetchCompanyFee({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

  return (
    <div className="SwapMDtableContainer">
      <div className="tableContainer">
        <p>Company Rewards Request</p>
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
                <th>Edit</th>
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
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
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
export default connect(mapStateToProps, mapDispatchToProps)(CompanyRewardsRequested);
//export default SwapRequested;
