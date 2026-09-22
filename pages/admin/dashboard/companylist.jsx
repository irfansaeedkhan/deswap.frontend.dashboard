import React from "react";
import CompanyListTable from "@/components/adminDashboardComponents/companyList/CompanyListTable";
import { useEffect, useState } from "react";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

function CompanyList() {
  const [totalCompany, setTotalCompany] = useState();
  const [totalActiveCompany, setTotalActiveCompany] = useState();

  useEffect(() => {
    companyData();
  }, []);

  const companyData = async () => {
    try {
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/fetch/total`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const totalComp = await SanitizeRequestString(result.data.totalCompany);
      const totalActiveComp = await SanitizeRequestString(
        result.data.totalActiveCompany
      );
      setTotalCompany(totalComp);
      setTotalActiveCompany(totalActiveComp);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="CompanyListTabContainer">
      <div className="CompanyListTabInner">
        <div className="title">
          <h1>User Account</h1>
        </div>
        <div className="topCards">
          <div className="CardContainer">
            <div className="CardInner">
              <div className="content">
                <p>Total Registered Companies</p>
                <h5>{totalCompany ? totalCompany : "N/A"}</h5>
              </div>
            </div>
          </div>
          <div className="CardContainer">
            <div className="CardInner">
              <div className="content">
                <p>Total Active Companies</p>
                <h5>{totalActiveCompany ? totalActiveCompany : "N/A"}</h5>
              </div>
            </div>
          </div>
        </div>
        <CompanyListTable></CompanyListTable>
      </div>
    </div>
  );
}

export default CompanyList;
CompanyList.PageLayout = AdminDashboardLayout;


