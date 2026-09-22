import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
const UsersIcon = <FontAwesomeIcon icon={faUsers} />;
const InfoIcon = <FontAwesomeIcon icon={faInfo} />;
import Searchicon from "@/assets/svgAssets/SearchIcon";
import CompanyCard from "./CompanyCard";
import {
  FBicon,
  Lkicon,
  TWicon,
  WEBicon,
} from "@/assets/svgAssets/SocialIcons.js";
import Image from "next/image";
import { SanitizeRequestString, SanitizeRequestObject } from "../../../utils/common/sanitize"
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Pagination from "@/components/reusables/Pagination";


function ActiveCompany() {

  const [companyData, setCompanyData] = useState([])
  const [totalCompany, setTotalCompany] = useState()
  const [totalCompany1, setTotalCompany1] = useState()
  const [totalCompany2, setTotalCompany2] = useState()
  const [searchValue,setSearchValue]=useState();
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  const [pagination1,setPagination1]= useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  const [pagination2,setPagination2]= useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  const [level1Data, setLevel1Data] = useState([]);
  const [level2Data, setLevel2Data] = useState([]);
  const [sortByLevel, setSortByLevel] = useState(false);

  useEffect(() => {
    void (async () => {
    await fetchCompanyList({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
    await fetchCompanyLevel1List({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    })
    await fetchCompanyLevel2List({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    })
      })();
  }, []);


  const fetchCompanyList = async (data) => {
    try {
      //setCompanyList(<TableLoader colSpan={9} />);
      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await encryptRequestBody({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/fetchmycompany`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let companyTableData = result?.data;
      companyTableData=await SanitizeRequestObject(companyTableData);
      setCompanyData(companyTableData.data)
      setTotalCompany(companyTableData?.total)
      companyTableData.activePageNo = data?.activePageNo;
      await setPagination({
        ...pagination,
        totalData: companyTableData?.total,
        activePage: data?.activePageNo,
      });

    } catch (e) {
      console.log(e);
    }
  };

  const fetchCompanyLevel1List = async (data) => {
    try {
      //setCompanyList(<TableLoader colSpan={9} />);
      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await encryptRequestBody({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/fetchdownlinecompany`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let companyTableData = result?.data;
      companyTableData=await SanitizeRequestObject(companyTableData);
      setLevel1Data(companyTableData.data)
      setTotalCompany1(companyTableData?.total)
      await setPagination1({
        ...pagination,
        totalData: companyTableData?.total,
        activePage: data?.activePageNo,
      });

    } catch (e) {
      console.log(e);
    }
  };

  const fetchCompanyLevel2List = async (data) => {
    try {
      //setCompanyList(<TableLoader colSpan={9} />);
      if (!data.offset) {
        data.offset = 0;
      }
      let encryptionData = await encryptRequestBody({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/fetchdownlinelevel2`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let companyTableData = result?.data;
      companyTableData=await SanitizeRequestObject(companyTableData);
      setLevel2Data(companyTableData.data)
      setTotalCompany2(companyTableData?.total)
      await setPagination2({
        ...pagination,
        totalData: companyTableData?.total,
        activePage: data?.activePageNo,
      });

    } catch (e) {
      console.log(e);
    }
  };

  const fetchCompanyInfo = async (value,data) => {
    try {
      setSearchValue(value)
      value=await SanitizeRequestString(value);
      //setuserstableList(<TableLoader colSpan={7} />);
      let offset
      if (!data) {
        offset = 0;
      }else{
        offset=data.offset
      }

      let encryptionData = await encryptRequestBody({
        name:value,
        offset: offset,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/search/active`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      let userDataTable = result?.data;
      userDataTable=await SanitizeRequestObject(result.data)
      if(data){
      userDataTable.activePageNo = data?.activePageNo;
      }
      await setCompanyData(userDataTable.data);
      await setTotalCompany(userDataTable.total)
      await setPagination({
        ...pagination,
        totalData: userDataTable?.total,
        activePage: data?.activePageNo,
      });

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

  const handlePageChange = async (pageNumber) => {
    try {
      //setCompanyList(<TableLoader colSpan={8} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      if(searchValue !=null && searchValue!=undefined){
        await fetchCompanyInfo(searchValue,{offset: offset,
          activePageNo: pageNumber})
      }else{
      await fetchCompanyList({
        offset: offset,
        activePageNo: pageNumber,
      });
    }
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };

  const handlePageChangeLevel1 = async (pageNumber) => {
    try {
      //setCompanyList(<TableLoader colSpan={8} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination1.dataperpage;
      await fetchCompanyLevel1List({
        offset: offset,
        activePageNo: pageNumber,
      });
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };

  const handlePageChangeLevel2 = async (pageNumber) => {
    try {
      //setCompanyList(<TableLoader colSpan={8} />);
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination2.dataperpage;
      await fetchCompanyLevel2List({
        offset: offset,
        activePageNo: pageNumber,
      });
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };

  return (
    <div className="AC">
      <div className="filterContainer">
        <div className="searchContainer">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search By Company Name Or Business Name"
            onKeyUp={(e)=>{fetchCompanyInfo(e.target.value)}}
          />
          <div className="searchIcon">
            <Searchicon />
          </div>
        </div>
        <div className="sortBtn">
          <button
            type="button"
            className={`SimpleButton btnHoverEffectOutline ${
              sortByLevel ? "active" : ""
            }`}
            onClick={() => setSortByLevel((prev) => !prev)}
          >
            Sort By Level
          </button>
        </div>
      </div>
      <div className="ACListContainer">
        {(sortByLevel
          ? ["level2", "level1", "mine"]
          : ["mine", "level1", "level2"]
        ).map((section) => {
          if (section === "mine") {
            return (
              <React.Fragment key="mine">
        <div className="level">
          <h4 className="Leveltitle"> My Company</h4>
          {companyData.length>0 ? companyData.map((data) => {
            return (
              <CompanyCard key={data._id} data={data} />
            )
          }) : <NodataCard />}
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalCompany ? totalCompany : "N/A"}</p>
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
              </React.Fragment>
            );
          }
          if (section === "level1") {
            return (
              <React.Fragment key="level1">
        <div className="level">
          <h4 className="Leveltitle"> Company At (1st Level) </h4>
          {level1Data.length>0 ? level1Data.map((data) => {
            return (
              <CompanyCard key={data._id} data={data.CompanyID} />
            )
          }) : <NodataCard />}
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalCompany1 ? totalCompany1 : "N/A"}</p>
          </div>
          <Pagination
            disabledClass={pagination1.disabledClass}
            hideDisabled={true}
            activePage={pagination1.activePage}
            itemsCountPerPage={pagination1.dataperpage}
            totalItemsCount={pagination1.totalData}
            pageRangeDisplayed={pagination1.pageRange}
            innerClass={"pagination"}
            activeClass={"link"}
            onChange={handlePageChangeLevel1}
          />
        </div>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key="level2">
        <div className="level">
          <h4 className="Leveltitle"> Company At (2nd Level) </h4>
          {level2Data.length>0 ? level2Data.map((data) => {
            return (
              <CompanyCard key={data._id} data={data.CompanyID} />
            )
          }) : <NodataCard />}
        </div>
        <div className="pagination">
          <div className="total">
            <p>Total Items : {totalCompany2 ? totalCompany2 : "N/A"}</p>
          </div>
          <Pagination
          disabledClass={pagination2.disabledClass}
          hideDisabled={true}
          activePage={pagination2.activePage}
          itemsCountPerPage={pagination2.dataperpage}
          totalItemsCount={pagination2.totalData}
          pageRangeDisplayed={pagination2.pageRange}
          innerClass={"pagination"}
          activeClass={"link"}
          onChange={handlePageChangeLevel2}
        />
        </div>
            </React.Fragment>
          );
        })}
        
      </div>
    </div>
  );
}

export default ActiveCompany;
