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
import Pagination from "@/components/reusables/Pagination";
import Joi from "joi";
import BootstrapModal from "../../reusables/BootstrapModal";
import EditIcon from "../../../assets/svgAssets/EditIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
const UsersIcon = <FontAwesomeIcon icon={faUsers} />;
const InfoIcon = <FontAwesomeIcon icon={faInfo} />;
import {
  FBicon,
  Lkicon,
  TWicon,
  WEBicon,
} from "@/assets/svgAssets/SocialIcons.js";
import Image from "next/image";
import { SanitizeRequestObject, SanitizeRequestString } from "../../../utils/common/sanitize"

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
  companyname: Joi.string().optional().allow(""),
});

function CompanyListTable() {
  const [currentActivePage, setCurrentActivePage] = useState(0);
  const [updateButton, setUpdateButton] = useState("Update");
  //Current sorting desc
  const [sorting, setsorting] = useState(-1);
  const [companyTableList, setcompanyTableList] = useState(null);
  const [usernameToSearch, setUsernameToSearch] = useState("");
  const [emailidToSearch, setEmailIDToSearch] = useState("");
  const [companyNameToSearch, setCompanyNameToSearch] = useState("");
  const [searchValue,setSearchValue]=useState();
  const [totaltable1Data, setTotaltable1Data] = useState("");
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
  const [loadingState, setLoadingState] = useState(false);

  /**
   * Function will create table body for searching
   */
  const createCompanyTable = async (tableData) => {
    try {
      if (tableData.data.length < 1) {
        setcompanyTableList(
          <tr>
            <td className="text-center" colSpan={7}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }

      if (tableData) {
        let loopDate = tableData.data;
        let outputData = [];
        //setClaimmedNetworkRewardsList();
        for (let index in loopDate) {
          outputData.push(
            <tr key={loopDate[index]._id}>
              <td>{loopDate[index]?.name ? loopDate[index].name : "N/A"}</td>
              <td>{loopDate[index]?.owner ? loopDate[index].owner : "N/A"}</td>
              <td>
                <div className="employeeContain">
                  <div className="LCicon">{UsersIcon}</div>{" "}
                  <p>
                    {loopDate[index]?.employees
                      ? loopDate[index].employees
                      : "N/A"}
                  </p>
                </div>
              </td>
              <td>
                {loopDate[index]?.business
                ? loopDate[index].business
                : "N/A"}
              </td>
              <td>
                {loopDate[index]?.catagoryName
                  ? loopDate[index].catagoryName
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.created_at
                  ? myRewardsDate(loopDate[index].created_at)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.renewalDate
                  ? myRewardsDate(loopDate[index].renewalDate)
                  : "N/A"}
              </td>
              <td>
                {loopDate[index]?.expireDate
                  ? myRewardsDate(loopDate[index].expireDate)
                  : "N/A"}
              </td>
              <td>
                <div
                  className="LCinfoicon"
                  onClick={() => ShowModalDetails(loopDate[index])}
                >
                  {InfoIcon}
                </div>
              </td>
            </tr>
          );
        }

        setcompanyTableList(outputData);
        await setPagination({
          ...pagination,
          totalData: tableData?.total,
          activePage: tableData?.activePageNo,
        });
      }
    } catch (e) {
      setcompanyTableList(
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
  const fetchCompanyInfo = async (data) => {
    try {
      const data1=await SanitizeRequestObject(data)
      setcompanyTableList(<TableLoader colSpan={9} />);
      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/fetch/list`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      let userDataTable = result?.data;
      userDataTable.activePageNo = data?.activePageNo;
      const userData = await SanitizeRequestObject(userDataTable)
      setTotaltable1Data(userData.total)
      await createCompanyTable(userData);
    } catch (e) {
      setcompanyTableList(
        <tr>
          <td className="text-center" colSpan={9}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log("Failed to fetch user info ", e);
    }
  };

  const resetSearch = async () => {
    try {
      setSearchValue("")
      setCompanyNameToSearch(null);
      setUsernameToSearch(null);
      setEmailIDToSearch(null)
      document.getElementById("companyname").value=null;
      document.getElementById("username").value=null;
      document.getElementById("email").value=null;
      await fetchCompanyInfo({
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
      console.log(e);
    }
  };

  const onSubmit = async (data) => {
    try{
    if(emailidToSearch || usernameToSearch || companyNameToSearch){
      setSearchValue(true)
    }
    const data1=await SanitizeRequestObject(data)
      setcompanyTableList(<TableLoader colSpan={9} />);
      if (!data1.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1.offset,
        email:emailidToSearch,
        username:usernameToSearch,
        name:companyNameToSearch
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/fetch/search`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const userData= await SanitizeRequestObject(result.data);
      userData.activePageNo = data?.activePageNo;
      setTotaltable1Data(userData.total)
      await createCompanyTable(userData);
    }catch(e){
      console.log(e)
    }
  };

  /**
   *
   */
  const handlePageChange = async (pageNumber) => {
    try {
      setcompanyTableList(<TableLoader colSpan={9} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      if(searchValue !=null && searchValue!=undefined){
        await onSubmit({offset: offset,
          activePageNo: pageNumber})
      }else{
      await fetchCompanyInfo({
        offset: offset,
        activePageNo: pageNumber,
      })
    }
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };

  //   show modal details
  const closeModalFunc = () => {
    setShow(false);
  };
  const ShowModalDetails = async (data) => {
    setShow(true);
    if (data) {
      setModalHeader("Company Info");
      setModalBody(
        <div className="modalcontentSuccess buydeswap modalWithImage">
          <div className="contentbox">
            <div className="CompanyModalCard">
              <div className="cardHeader">
                <div className="leftImg">
                  <div className="companyImgIcon">
                    <img
                      width={100}
                      height={100}
                      src={data.ipfSURL || "/images/companylogo1.png"}
                      alt="company logo"
                    />
                  </div>
                </div>
                <div className="rightContent">
                  <h3>{data?.name ? data?.name : "N/A"}</h3>
                  <div className="dataList">
                    <div className="leftDataList">
                      <h4>@{data?.username ? data?.username : "N/A"} </h4>
                      <div className="dot"></div>
                      <h4>
                        Owner : <span>{data?.owner ? data?.owner : "N/A"}</span>{" "}
                      </h4>
                    </div>
                    <div className="rightDataList">
                      <div className="socialIconsContainer">
                        <button>
                          <FBicon />
                        </button>
                        <button>
                          <Lkicon />
                        </button>
                        <button>
                          <TWicon />
                        </button>
                        <button>
                          <WEBicon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* table */}
              <div className="companyInfoTable">
                <div className="tableContainer">
                  <div className="tableContainerTable customScroll">
                    <div className="infoItem">
                      <h5>Business</h5>
                      <h6>{data?.business ? data?.business : "N/A"}</h6>
                    </div>
                    <div className="infoItem">
                      <h5>Company Email</h5>
                      <h6>{data?.email ? data?.email : "N/A"} </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Legal Address</h5>
                      <h6>{data?.address ? data?.address : "N/A"} </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Employees</h5>
                      <h6>{data?.employees ? data?.employees : "N/A"} </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Register Date</h5>
                      <h6>
                        {data?.created_at
                          ? myRewardsDate(data.created_at)
                          : "N/A"}{" "}
                      </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Renewal Date</h5>
                      <h6>
                        {data?.renewalDate
                          ? myRewardsDate(data.renewalDate)
                          : "N/A"}{" "}
                      </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Expire Date</h5>
                      <h6>
                        {data?.expireDate
                          ? myRewardsDate(data.expireDate)
                          : "N/A"}{" "}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  /**
   * When page loads function will send request to the server to fetch user list
   */
  useEffect(() => {
    void (async () => {
    try {
      //Making request to fetch user info
      await fetchCompanyInfo({
        offset: 0,
        limit: 10,
        activePageNo: 1,
      });
    } catch (e) {
      console.log("Failed to fetch", e);
    }
      })();
  }, []);

  return (
    <div className="CompanyListTabMain">
      <div className="filterContainer">
        <div className="inputContainer">
          <input
            type="text"
            id="companyname"
            name="companyname"
            autoComplete="off"
            {...register("companyname", { required: false })}
            error={formState.errors.companyname && true}
            placeholder="companyname"
            onChange={(e)=>setCompanyNameToSearch(e.target.value)}
          />
          {formState.errors.companyname && (
            <p>{formState.errors.companyname.message}</p>
          )}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            {...register("username", { required: false })}
            error={formState.errors.username && true}
            placeholder="Username"
            onChange={(e)=>setUsernameToSearch(e.target.value)}
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
            error={formState.errors.email && true}
            placeholder="Email ID"
            onChange={(e)=>setEmailIDToSearch(e.target.value)}
          />
          {formState.errors.email && <p>{formState.errors.email.message}</p>}
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
        </div>
      </div>
      <div className="UserListtableContainer">
        <div className="CompanyLis">
          <div className="CompanyLisTable customScroll">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Company Owner</th>
                  <th>Employees</th>
                  <th>Business</th>
                  <th>Category</th>
                  <th>Register Date</th>
                  <th>Renewal Date</th>
                  <th>Expire Date</th>
                  <th>Info</th>
                </tr>
              </thead>
              <tbody>{companyTableList}</tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="total">
              <p>Total {totaltable1Data} Item</p>
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
              <p>Total {totaltable1Data ? totaltable1Data : "N/A"} Item</p>
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
          handleClose={closeModalFunc}
          modaltitle={modalheader}
          modalbody={modalbody}
          modalfooter={modalfooter}
        ></BootstrapModal>
      </div>
      {loadingState && <Loader />}
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

export default CompanyListTable;
