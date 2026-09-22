import React, { useState } from "react";
import ListYourCompany from "@/components/userDashboardComponents/company/ListYourCompany";
import CompanyList from "@/components/userDashboardComponents/company/CompanyList";
import ActiveCompany from "@/components/userDashboardComponents/company/ActiveCompany";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

function Company(props) {
  const [displayTab, setDisplayTab] = useState("tab1");

  return (
    <div className="companyContainer">
      <div className="companyInner">
        <div className="title">
          <h1>Company</h1>
        </div>
        <div className="companyMain">
          <div className="tabsContainer">
            <ul className="mb-3 nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab1");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab1" && "active"}`}
                >
                  List Your Company
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab2");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab2" && "active"}`}
                >
                  Company List
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab3");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab3" && "active"}`}
                >
                  Active Company
                </button>
              </li>
            </ul>
            <div className="tab-content">
              <div hidden={displayTab != "tab1"}>
                <ListYourCompany />
              </div>
              <div hidden={displayTab != "tab2"}>
                <CompanyList />
              </div>
              <div hidden={displayTab != "tab3"}>
                <ActiveCompany />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Company;
Company.PageLayout = UserDashboardLayout;
