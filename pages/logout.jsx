import axios from "@/utils/common/axios";
import Router from "next/router";
import { useEffect } from "react";
import { clearLoginData } from "../utils/auth/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWalletValues } from "../utils/common/localstorage";
import { LandingpageLayout } from "@/layout/landingpage.layout";
import PageLoader from "@/components/reusables/loader/PageLoader";

function Logout() {
  useEffect(() => {
    void (async () => {
      const logoutUser = async () => {
        try {
          await clearLoginData();
          await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/logout`,
            {},
            {
              withCredentials: true,
              headers: {
                "security-set": false,
              },
            }
          );
          await setWalletValues("metamask", false);
          setTimeout(() => {
            Router.push("/");
          }, 3000);
        } catch (error) {
          console.log("Error ", error);
          await setWalletValues("metamask", false);
          setTimeout(() => {
            Router.push("/");
          }, 3000);
        }
      };
      await logoutUser();
    })();
  }, []);
  return (
    <>
      <PageLoader overlay={false} showLogo title="Logging Out" />
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
    </>
  );
}
export default Logout;
Logout.PageLayout = LandingpageLayout;
