import axios from "axios";
import Router from "next/router";
import { Component, useEffect } from "react";
import { clearLoginData } from "../utils/auth/login";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWalletValues } from "../utils/common/localstorage";
import { LandingpageLayout } from "@/layout/landingpage.layout";

function Logout() {
  useEffect(async () => {
    const logoutUser = async () => {
      try {
        await clearLoginData();
        let result = await axios.post(
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
  }, []);
  return (
    <div className="logoutpageContainer">
      <div className="logoContainer">
        <Image
          src={"/images/logo.png"}
          width={152}
          height={34}
          alt="logo"
          loading="lazy"
        />
      </div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="logoutContent">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              ></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo"></feBlend>
            </filter>
          </defs>
        </svg>
        <div className="blob blob-0"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>

        <h2>Logging Out</h2>
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
export default Logout;
Logout.PageLayout = LandingpageLayout;
