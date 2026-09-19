import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Pagination from "react-js-pagination";
import Joi from "joi";
import BootstrapModal from "../../reusables/BootstrapModal";
import EditIcon from "../../../assets/svgAssets/EditIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPen } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"
import { useRouter } from "next/router";


const editIcon = <FontAwesomeIcon icon={faPen} />;
const infoIcon = <FontAwesomeIcon icon={faInfo} />;
/*
const schema = Joi.object({
  username: Joi.string().label("Username").messages({
    "string.empty": `Username Required`,
    "any.required": `Required Field`,
  }),
  email: Joi.string().messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
    }),
  walletAddress: Joi.string().label("Wallet Address").messages({
    "string.empty": `Wallet Address Required`,
    "any.required": `Required Field`,
  }),
});*/
const schema = Joi.object({
  username: Joi.string().optional().allow(""),
  email: Joi.string().optional().allow(""),
  walletAddress: Joi.string().optional().allow(""),
});

function UserInfoData() {
  const [currentActivePage, setCurrentActivePage] = useState(0);

  const [updateButton, setUpdateButton] = useState("Update");
  const router = useRouter();
  //Current sorting desc
  const [sorting, setsorting] = useState(-1);
  const [userstableList, setuserstableList] = useState(null);
  const [usernameToSearch, setUsernameToSearch] = useState("");
  const [emailidToSearch, setEmailIDToSearch] = useState("");
  const [publicKeyToSearch, setPublicKeyToSearch] = useState("");
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });

  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Edit");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  /**
   *
   */
  const createWalletView = async (walletlist) => {
    try {
      let walletdata = [];
      for (let wallet in walletlist) {
        walletdata.push(
          <div>
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${walletlist[wallet]}`}
            >
              {reducedWalletAddress(walletlist[wallet])}
            </a>
          </div>
        );
      }
      if (walletdata.length < 1) {
        return null;
      }
      return walletdata;
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
      console.log("Failed to create view ", e);
      return null;
    }
  };

  const updateSuccesFullStatus = async (updateData) => {
    try {
      const sanData=await SanitizeRequestObject(updateData)
      //requestBodyEncryptionAdmin
      let encryptionData = await requestBodyEncryptionAdmin(sanData);

      let updateResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/update`,
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

      let disabledReasonobj = document.getElementById("disablereason");
      if (!disabledReasonobj) {
        return;
      }
      let disabledReason = disabledReasonobj.value;

      setUpdateButton("Updating...");
      await updateSuccesFullStatus({
        userid: dataToUpdate._id,
        userDisabledReason: disabledReason,
        transactionStatus: transactionStatus,
        userStatus: requestStatus,
      });

      //Fetch Element again
      await setShow(false);
      await fetchUsersInfo({
        offset: 0,
        activePageNo: 1,
        email: emailidToSearch,
        username: usernameToSearch,
        publickey: publicKeyToSearch,
        sort: sorting,
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
      console.log("Updated function error:", e);
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

  const editUserDetails = async (userdetails) => {
    try {
      await setShow(true);
      await setModalBody(
        <div className="row userAccountEditModal">
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">User id</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                defaultValue={userdetails._id}
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
                defaultValue={userdetails.emailid}
                disabled
              ></input>
            </div>
          </div>
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Username</div>
            <div className="col-12 col-sm-6 inputs">
              <input
                type="text"
                className="updateInputField"
                defaultValue={userdetails.username}
                disabled
              ></input>
            </div>
          </div>
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">Transaction valid</div>
            <div className="col-12 col-sm-6">
              <select
                name="status"
                className="dropdowns"
                id="updatetransactionvalid"
              >
                <option
                  value={true}
                  selected={userdetails.transactionVerified ? true : false}
                >
                  true
                </option>
                <option
                  value={false}
                  selected={userdetails.transactionVerified ? true : false}
                >
                  false
                </option>
              </select>
            </div>
          </div>
          <div className="inputListContainer">
            <div className="col-12 col-sm-6 labels">User status</div>
            <div className="col-12 col-sm-6">
              <select name="status" className="dropdowns" id="updatestatus">
                <option
                  value="Active"
                  selected={
                    userdetails.transactionVerified == "Active" ? true : false
                  }
                >
                  Active
                </option>
                <option
                  value="Inactive"
                  selected={
                    userdetails.transactionVerified == "Active" ? true : false
                  }
                >
                  Inactive
                </option>
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 labels">Disable Reason</div>
          <div className="col-12 col-sm-12">
            {/* <input
              type="text"
              id="disablereason"
              className="updateInputField"
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
            <div className="col-sm-6 col-6 ">
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
                  updateFunction(userdetails);
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
      console.log(e);
    }
  };

  const viewUserDetails = async (userdetails) => {
    try {
      router.push(`usersinfo/${userdetails._id}`)
      // View user details
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

  const createEditButton = async (datatoAdd) => {
    return (
      <div className="buttonActionInner">
        <button
          className="actionBtn edit SimpleButton btnHoverEffectOutline"
          onClick={(e) => {
            editUserDetails({ ...datatoAdd });
          }}
        >
          {" "}
          {editIcon}{" "}
        </button>
        <button
          className="actionBtn info SimpleButton btnHoverEffectOutline"
          onClick={(e) => {
            viewUserDetails({ ...datatoAdd });
          }}
        >
          {" "}
          {infoIcon}
        </button>
      </div>
    );
  };
  /**
   * Function will create table body for searching
   */
  const createUserTable = async (dataForTable) => {
    try {
      let tableContent = [];
      for (let index in dataForTable.data) {
        //
        tableContent.push(
          <tr>
            <td>
              {dataForTable?.data[index]?.username
                ? dataForTable.data[index].username
                : "N/A"}
            </td>
            <td>
              {dataForTable?.data[index]?.emailid
                ? dataForTable.data[index].emailid
                : "N/A"}
            </td>
            <td>
              {dataForTable?.data[index]?.walletaddress
                ? await createWalletView(dataForTable.data[index].walletaddress)
                : "N/A"}
            </td>
            <td>
              {dataForTable?.data[index]?.role
                ? dataForTable.data[index].role
                : "N/A"}
            </td>
            <td>
              {dataForTable?.data[index]?.createdAt
                ? await myRewardsDate(dataForTable.data[index].createdAt)
                : "N/A"}
            </td>
            <td>
              {dataForTable?.data[index]?.status
                ? dataForTable.data[index].status
                : "N/A"}
            </td>
            <td>
              {dataForTable.data &&
              dataForTable.data[index] &&
              dataForTable.data[index].transactionVerified ? (
                <button className="Unlocked">Verified</button>
              ) : (
                <button className="locked">Not Verified</button>
              )}
            </td>
            <td className="buttonActionContainer">
              {await createEditButton(dataForTable?.data[index])}
            </td>
          </tr>
        );
      }
      await setuserstableList(tableContent);
      await setPagination({
        ...pagination,
        totalData: dataForTable.total,
        activePage: dataForTable.activePageNo,
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
      setuserstableList(
        <tr>
          <td className="text-center" colSpan={7}>
            <NodataCard />
          </td>
        </tr>
      );
    }
  };

  /**
   * Function will fetch user info from the server using pagination value
   */
  const fetchUsersInfo = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data);
      setuserstableList(<TableLoader colSpan={7} />);
      if (!data1.offset) {
        data1.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
        emailid: data1.email,
        username: data1.username,
        publickey: data1.publickey,
        sort: data1.sort,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/list`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      //TO DO : Add loader
      //setLoadingState(result && false);
      let userDataTable = result?.data;
      userDataTable.activePageNo = data?.activePageNo;
      userDataTable=await SanitizeRequestObject(userDataTable)
      await createUserTable(userDataTable);
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
      console.log("Failed to fetch user info ", e);
    }
  };

  const resetSearch = async () => {
    try {
      await fetchUsersInfo({
        offset: 0,
        limit: 10,
        activePageNo: 1,
        email: "",
        username: "",
        publickey: "",
        sort: sorting,
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
      console.log(e);
    }
  };

  const onSubmit = async (data) => {
    try {
      await setUsernameToSearch(data.username);
      await setEmailIDToSearch(data.email);
      await setPublicKeyToSearch(data.walletAddress);
      await fetchUsersInfo({
        offset: 0,
        activePageNo: 1,
        email: data.email,
        username: data.username,
        publickey: data.walletAddress,
        sort: sorting,
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
      console.log("e", e);
    }
  };

  /**
   *
   */
  const handlePageChange = async (pageNumber) => {
    try {
      setuserstableList(<TableLoader colSpan={7} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      await fetchUsersInfo({
        offset: offset,
        activePageNo: pageNumber,
        email: emailidToSearch,
        username: usernameToSearch,
        publickey: publicKeyToSearch,
        sort: sorting,
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

  const changeSortOfData = async () => {
    try {
      let changesortTo = -1;
      if (sorting == -1) {
        await setsorting(1);
        changesortTo = 1;
      } else {
        await setsorting(-1);
        changesortTo = -1;
      }

      await fetchUsersInfo({
        offset: 0,
        activePageNo: 1,
        email: emailidToSearch,
        username: usernameToSearch,
        publickey: publicKeyToSearch,
        sort: changesortTo,
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
      console.log("Failed to set", e);
    }
  };

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

  /**
   * When page loads function will send request to the server to fetch user list
   */
  useEffect(async () => {
    try {
      //Making request to fetch user info
      await fetchUsersInfo({
        offset: 0,
        limit: 10,
        activePageNo: 1,
        email: "",
        username: "",
        publickey: "",
        sort: sorting,
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
      console.log("Failed to fetch", e);
    }
  }, []);

  return (
    <div className="AdminUserAccTabMain">
      <div className="filterContainer">
        <div className="inputContainer">
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            {...register("username", { required: false })}
            error={formState.errors.deswapstackname && true}
            placeholder="Username"
          />
          {formState.errors.username && (
            <p>{formState.errors.username.message}</p>
          )}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="off"
            {...register("email", { required: false })}
            error={formState.errors.deswapstackname && true}
            placeholder="Email ID"
          />
          {formState.errors.email && <p>{formState.errors.email.message}</p>}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            id="walletAddress"
            name="walletAddress"
            autoComplete="off"
            {...register("walletAddress", { required: false })}
            error={formState.errors.deswapstackname && true}
            placeholder="Wallet Address"
          />
          {formState.errors.walletAddress && (
            <p>{formState.errors.walletAddress.message}</p>
          )}
        </div>
        <div className="actionBtns">
          <div className="buttonContainer">
            <button
              onClick={handleSubmit(onSubmit)}
              className="SimpleButton btnHoverEffectOutline"
            >
              Search
            </button>
          </div>
          <div className="buttonContainer">
            <button
              onClick={resetSearch}
              className="SimpleButton btnHoverEffectOutline"
            >
              Reset
            </button>
          </div>
          <div className="buttonContainer">
            <button
              onClick={changeSortOfData}
              className="SimpleButton btnHoverEffectOutline"
            >
              {sorting == "-1" ? "Desc" : "Asc"}
            </button>
          </div>
        </div>
      </div>
      <div className="UserListtableContainer">
        <div className="UserAccContainer">
          <div className="UserAccContainerTable customScroll">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Wallet Address</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Registeration Fee</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{userstableList}</tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="total">
              {/*<p>Total {totaltable1Data} Item</p>*/}
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

export default UserInfoData;
