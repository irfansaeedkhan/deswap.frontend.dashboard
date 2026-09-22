import React, { useState, useEffect } from "react";
import Image from "next/image";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import axios from "../../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import DisplayUserInfoTable from "@/components/adminDashboardComponents/userinfo/DisplayUserInfoTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../../utils/common/sanitize";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";



const DropDowndata = [
  { id: 0, label: "30/page" },
  { id: 1, label: "50/page" },
];
// form validations
const schema = Joi.object({
  username: Joi.string().label("Username").messages({
    "string.empty": `Username Required`,
    "any.required": `Required Field`,
  }),
  email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .required()
    .messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
    }),
  walletAddress: Joi.string().label("Wallet Address").messages({
    "string.empty": `Wallet Address Required`,
    "any.required": `Required Field`,
  }),
});

function UserAccount() {
  const router = useRouter();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState();
  const [totalUserPurchased, setTotalUserPurchased] = useState();
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const fetchTotalUsers = async () => {
    try {
      setLoading(true);
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/total`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const data = await SanitizeRequestString(result.data.data.totalUsers);
      const purchasedData = await SanitizeRequestString(
        result.data.data.totaPackPurchased
      );
      setTotalUserPurchased(purchasedData);
      setTotalUsers(data);
    } catch (e) {
      setLoading(false);
      setUsersList(
        <tr>
          <td className="text-center" colSpan={6}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
      return 0;
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/list`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoading(result && false);
      if (result?.data?.data?.length > 0) {
        const sanData = await SanitizeRequestObject(result.data.data);
        setUsersList(sanData);
        return sanData;
      } else {
        setUsersList(
          <tr>
            <td className="text-center" colSpan={6}>
              <NodataCard />
            </td>
          </tr>
        );
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
      setLoading(false);
      setUsersList(
        <tr>
          <td className="text-center" colSpan={6}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      console.log(e);
      return 0;
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data) {
        const users = await fetchUsers();
        var getFilteredUser = users.filter(function (user) {
          return (
            user.username == data.username &&
            user.emailid == data.email &&
            user.walletaddress == data.walletAddress
          );
        });
        setUsersList(getFilteredUser);
      }
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
      console.log("error: ", e);
    }
  };

  const viewUserFullDetailsFunc = (userId) => {
    router.push({
      pathname: "/admin/dashboard/usersinformationpanel",
      query: { userId: userId },

      // pathname: '/admin/dashboard/usersinformationpanel/[userId]',
      // query: { userId : userId },
    });
  };

  useEffect(() => {
    void (async () => {
    await fetchTotalUsers();
      })();
  }, []);

  return (
    <div className="AdminUserAccTabContainer">
      <div className="AdminUserAccTabInner">
        <div className="title">
          <h1>User Account</h1>
        </div>
        <div className="topCards">
          <div className="CardContainer">
            <div className="CardInner">
              <div className="content">
                <p>Total Registered Users</p>
                <h5>{totalUsers ? totalUsers : "N/A"}</h5>
              </div>
            </div>
          </div>
          <div className="CardContainer">
            <div className="CardInner">
              <div className="content">
                <p>Total Users Purchases</p>
                <h5>{totalUserPurchased ? totalUserPurchased : "N/A"}</h5>
              </div>
            </div>
          </div>
        </div>
        <DisplayUserInfoTable></DisplayUserInfoTable>
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
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default UserAccount;
UserAccount.PageLayout = AdminDashboardLayout;
