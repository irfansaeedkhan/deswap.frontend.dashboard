import React, { useState, useEffect, Fragment } from "react";
import ArrowLeft from "@/assets/svgAssets/ArrowLeft";
import { useRouter } from "next/router";
import Head from "next/head";
import GeneralSettings from "@/components/userDashboardComponents/editProfile/GeneralSettings";
import PasswordSettings from "@/components/userDashboardComponents/editProfile/PasswordSettings";
import { checkUserAuth } from "../../../utils/auth/userauth";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";
export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};

//
function EditProfile({ users }) {
  const [displayGeneralTab, setdisplayGeneralTab] = useState(true);
  const router = useRouter();
  return (
    <Fragment>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <div className="editProfileContainer">
        <div className="editProfileInner">
          <div className="editProfileMain">
            <div className="tabsContainer">
              <ul className="mb-3 nav nav-tabs">
                <li
                  className="nav-item backbtn  btnHoverEffectOutline"
                  onClick={() => {
                    router.push("/user/dashboard/profile");
                    setdisplayGeneralTab(true);
                  }}
                >
                  <ArrowLeft />
                  <button type="button" className={`nav-link `}>
                    Back
                  </button>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setdisplayGeneralTab(true);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${displayGeneralTab && "active"}`}
                  >
                    General
                  </button>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setdisplayGeneralTab(false);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${!displayGeneralTab && "active"}`}
                  >
                    Password
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                {displayGeneralTab ? (
                  <div className="epTabContainer">
                    <GeneralSettings users={users} />
                  </div>
                ) : (
                  <div className="epTabContainer">
                    <PasswordSettings users={users} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default EditProfile;
EditProfile.PageLayout = UserDashboardLayout;
