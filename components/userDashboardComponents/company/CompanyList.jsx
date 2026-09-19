import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import Pagination from "react-js-pagination";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

const UsersIcon = <FontAwesomeIcon icon={faUsers} />;
const InfoIcon = <FontAwesomeIcon icon={faInfo} />;
import Searchicon from "@/assets/svgAssets/SearchIcon";
import {
  FBicon,
  Lkicon,
  TWicon,
  WEBicon,
} from "@/assets/svgAssets/SocialIcons.js";
import Image from "next/image";

function CompanyList() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [companyModalData, setCompanyModalData] = useState([]);
  const [searchValue, setSearchValue] = useState();
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
        setCompanyList(
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
            <tr>
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
                {loopDate[index]?.business ? loopDate[index].business : "N/A"}
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

        setCompanyList(outputData);
        await setPagination({
          ...pagination,
          totalData: tableData?.total,
          activePage: tableData?.activePageNo,
        });
      }
    } catch (e) {
      console.log(e);
      setCompanyList(
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
      setCompanyList(<TableLoader colSpan={8} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      if (searchValue != null && searchValue != undefined) {
        await fetchCompanyInfo(searchValue, {
          offset: offset,
          activePageNo: pageNumber,
        });
      } else {
        await fetchCompanyList({
          offset: offset,
          activePageNo: pageNumber,
        });
      }
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };
  const fetchCompanyList = async (data) => {
    try {
      setCompanyList(<TableLoader colSpan={9} />);
      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await encryptRequestBody({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/fetch`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let companyTableData = result?.data;
      companyTableData = await SanitizeRequestObject(companyTableData);
      companyTableData.activePageNo = data?.activePageNo;
      await setCompanyModalData(result?.data?.data);
      await setTotalCompanies(companyTableData?.total);
      await createTableData(companyTableData);
    } catch (e) {
      setCompanyList(
        <tr>
          <td className="text-center" colSpan={9}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
    }
  };

  const fetchCompanyInfo = async (value, data) => {
    try {
      setSearchValue(value);
      let sanData = await SanitizeRequestString(value);
      //setuserstableList(<TableLoader colSpan={7} />);
      let offset;
      if (!data) {
        offset = 0;
      } else {
        offset = data.offset;
      }

      let encryptionData = await encryptRequestBody({
        name: sanData,
        offset: offset,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/search`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      let userDataTable = result?.data;
      userDataTable = await SanitizeRequestObject(result.data);
      if (data) {
        userDataTable.activePageNo = data?.activePageNo;
      }
      await createTableData(userDataTable);

      //TO DO : Add loader
      //setLoadingState(result && false);
      //
      // await SanitizeRequestObject(userDataTable)
      // await createUserTable(userDataTable);
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
                      src={data.ipfSURL}
                      alt="del icon"
                    />
                  </div>
                </div>
                <div className="rightContent">
                  <h3> {data?.name ? data?.name : "N/A"} </h3>
                  <div className="dataList">
                    <div className="leftDataList">
                      <h4>@{data?.username ? data?.username : "N/A"} </h4>
                      <div className="dot"></div>
                      <h4>
                        Owner : <span>{data.owner}</span>{" "}
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
                      <h6>{data.business}</h6>
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
                          : "N/A"}
                      </h6>
                    </div>
                    <div className="infoItem">
                      <h5>Expire Date</h5>
                      <h6>
                        {data?.expireDate
                          ? myRewardsDate(data.expireDate)
                          : "N/A"}
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
  useEffect(async () => {
    await fetchCompanyList({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

  return (
    <div className="CL">
      <div className="filterContainer">
        <div className="searchContainer">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search By Company Name Or Business Name"
            onKeyUp={(e) => {
              fetchCompanyInfo(e.target.value);
            }}
          />
          <div className="searchIcon">
            <Searchicon />
          </div>
        </div>
        <div className="sortBtn">
          <button className="SimpleButton btnHoverEffectOutline">
            Sort By Date
          </button>
        </div>
      </div>
      <div className="CLtableContainer">
        <div className="tableContainer">
          <div className="tableContainerTable customScroll">
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
              <tbody>{companyList}</tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="total">
              <p>Total Items : {totalCompanies ? totalCompanies : "N/A"}</p>
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
              <p>Total Items : {totalCompanies ? totalCompanies : "N/A"}</p>
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
      <BootstrapModal
        show={show}
        handleClose={closeModalFunc}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </div>
  );
}

export default CompanyList;
