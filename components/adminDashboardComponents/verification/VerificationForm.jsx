import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ArrowLeft from "@/assets/svgAssets/ArrowLeft";
import axios from "axios";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


function VerificationForm({ userData }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const form = document.querySelector('[name="verify"]');
    const inputs = form.querySelectorAll(".inputs input");
    const inputsArr = [...inputs];

    const selectIfNotEmpty = function (e) {
      if (e.target.value) {
        e.target.select();
      }
    };
    let valuesOFInput = [];
    const handleInput = async function (e) {
      setErrorMessage("");
      if (e.target && e.target.value) {
        valuesOFInput=await SanitizeRequestString(valuesOFInput)
        if (typeof valuesOFInput == "number") {
          valuesOFInput = [];
        } else {
          if (valuesOFInput.length > Number(e.target.dataset.fieldposition)) {
            //
            while (
              valuesOFInput.length > Number(e.target.dataset.fieldposition)
            ) {
              valuesOFInput.pop();
            }
          }
        }

        if (valuesOFInput) {
          if (Number(e.target.dataset.fieldposition) >= valuesOFInput.length) {
            //
            valuesOFInput[e.target.dataset.fieldposition - 1] = e.target.value;
          } else {
            valuesOFInput?.push(e?.target?.value);
          }
          //valuesOFInput?.push(e?.target?.value);
        }
      }

      if (
        e?.target?.value &&
        e?.target?.parentElement?.nextElementSibling?.children[0]
      ) {
        e?.target?.parentElement?.nextElementSibling?.children[0]?.focus();
      }
      if (
        !e?.target?.parentElement?.nextElementSibling?.children[0] &&
        inputsArr.every((input) => input.value)
      ) {
        if (typeof valuesOFInput != "number") {
          //

          if (valuesOFInput.length === 6) {
            //
            valuesOFInput = parseInt(valuesOFInput.join(""));
            //
            try {
              setErrorMessage("Verifying...");
              let encryptionData = await requestBodyEncryptionUnprotected({
                verificationCode: valuesOFInput,
                _id: userData.uuid,
              });
              let { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/verification`,
                { data: encryptionData },
                {
                  withCredentials: true,
                  headers: {
                    "security-set": true,
                  },
                }
              );
              if (data.success) {
                setErrorMessage("Success");
                switch (data.isMatch.role) {
                  case "User":
                    return router.push("/user/dashboard");
                  case "DeswapAdminRole":
                    return router.push("/admin/dashboard");
                  default:
                    return router.push("/user/login");
                }
              } else {
                setErrorMessage("Invalid OTP");
              }
            } catch (error) {
              // toast.error(error.message, {
              //   position: "top-center",
              //   autoClose: 3000,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   progress: undefined,
              // });
              console.log("unable to react api ");
            }
          }
        }
        /*
        if (valuesOFInput?.length === 6) {
          valuesOFInput = parseInt(valuesOFInput.join(""));

          
        }*/

        // router.push("/user/dashboard");
      }
    };

    const handleBackspace = function (e) {
      if (
        e.keyCode == 8 &&
        e.target.value == "" &&
        e?.target?.parentElement?.previousElementSibling?.children[0]
      ) {
        if (typeof valuesOFInput == "number") {
          let splittedarray = String(valuesOFInput).split("");
          splittedarray.pop();
          valuesOFInput = splittedarray;
        } else {
          if (valuesOFInput.length >= Number(e.target.dataset.fieldposition)) {
            //
            while (
              valuesOFInput.length >= Number(e.target.dataset.fieldposition)
            ) {
              valuesOFInput.pop();
            }
          }
          //if type is array pop on back press
          //valuesOFInput.pop();
        }
        e?.target?.parentElement?.previousElementSibling?.children[0].focus();
      }
    };

    const handlePaste = async function (e) {
      e.preventDefault();
      let  data1 = e?.clipboardData.getData("text");
      data1=await SanitizeRequestString(data1)
      inputs.forEach((input, i) => {
        input.value = data1[i] || input.value;
      });
      let firstvalue = e.target.value;
      if (inputsArr.every((input) => input.value)) {
        //
        try {
          setErrorMessage("Verifying...");
          let encryptionData = await requestBodyEncryptionUnprotected({
            verificationCode: Number(data1),
            _id: userData.uuid,
          });
          let { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/verification`,
            { data: encryptionData },
            {
              withCredentials: true,
              headers: {
                "security-set": true,
              },
            }
          );
          if (data.success) {
            setErrorMessage("Success");
            switch (data.isMatch.role) {
              case "User":
                return router.push("/user/dashboard");
              case "DeswapAdminRole":
                return router.push("/admin/dashboard");
              default:
                return router.push("/user/login");
            }
          } else {
            setErrorMessage("Invalid OTP");
          }
        } catch (error) {
          // toast.error(error.message, {
          //   position: "top-center",
          //   autoClose: 3000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          // });
          console.log("unable to react api ");
        }
      }
      e.target.value = firstvalue;
    };

    const handleArrows = function (e) {
      if (
        e.keyCode == 37 &&
        e?.target?.parentElement?.previousElementSibling?.children[0]
      ) {
        // izq
        e.preventDefault();
        e?.target?.parentElement?.previousElementSibling?.children[0].focus();
      }

      if (
        e.keyCode == 39 &&
        e?.target?.parentElement?.nextElementSibling?.children[0]
      ) {
        // der
        e.preventDefault();
        e?.target?.parentElement?.nextElementSibling?.children[0].focus();
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("focus", selectIfNotEmpty);
    });

    inputs.forEach((input) => {
      input.addEventListener("input", handleInput);
    });

    inputs.forEach((input) => {
      input.addEventListener("keyup", handleBackspace);
    });

    inputs.forEach((input) => {
      input.addEventListener("paste", handlePaste);
    });

    inputs.forEach((input) => {
      input.addEventListener("keydown", handleArrows);
    });
  });

  const resendTheOTP = async () => {
    try {
      const sanData=await SanitizeRequestObject(userData)
      setErrorMessage("Sending OTP on registered email id");
      let encryptionData = await requestBodyEncryptionUnprotected(sanData);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/resend`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setErrorMessage("OTP Sent");
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      setErrorMessage("Failed to send OTP");
      console.log("error making request :", error);
    }
  };

  return (
    <>
      <div className="verificationForm">
        <div className="backBtn" onClick={() => router.push("/user/login")}>
          <ArrowLeft />
        </div>
        <h2>Verification</h2>
        <p className="tagline">
          Please enter the 6-digit verification code that was sent to `
          {userData.emailid}` The code is valid for 10 minutes.
        </p>
        <div className="verificationCode">
          <h6 className="des">Verification Code</h6>
          <h6 className="timer">Code Valid For 10 Minutes</h6>
        </div>
        <div className="inputsList">
          <form name="verify" autoComplete="off">
            <div className="inputs">
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="1"
                  name="n1"
                  maxLength="1"
                />
              </div>
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="2"
                  name="n2"
                  maxLength="1"
                />
              </div>
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="3"
                  name="n3"
                  maxLength="1"
                />
              </div>
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="4"
                  name="n4"
                  maxLength="1"
                />
              </div>
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="5"
                  name="n5"
                  maxLength="1"
                />
              </div>
              <div className="box">
                <input
                  type="number"
                  autoComplete="off"
                  data-fieldposition="6"
                  name="n6"
                  maxLength="1"
                />
              </div>
            </div>
          </form>
          <div className="text-danger fw-bold">{errorMessage}</div>
          <div className="formFooter">
            <p>
              Didn&apos;t Receive The Code?{" "}
              <a
                onClick={() => {
                  resendTheOTP();
                }}
              >
                Resend Email
              </a>
            </p>
          </div>
        </div>
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
    </>
  );
}

export default VerificationForm;
