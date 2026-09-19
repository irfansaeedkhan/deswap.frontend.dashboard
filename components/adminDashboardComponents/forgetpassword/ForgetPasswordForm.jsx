import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import Image from "next/image";
import Modal from "@/components/reusables/Modal";
import { useRouter } from "next/router";
import ArrowLeft from "@/assets/svgAssets/ArrowLeft";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestString } from "../../../utils/common/sanitize";

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

// form validations
const schema = Joi.object({
  password: Joi.string().required().min(4).label("password").messages({
    "string.empty": `Password Required`,
    "any.required": `Required Field`,
  }),
  confirmpassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": `Password Does Not Match`,
      "string.empty": `Confirm Password Required`,
      "any.required": `Required Field`,
    }),
});

function ForgetPasswordForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [buttonText, setbuttonText] = useState("Send Mail");
  var buttonClicked = false;
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  // const { handleSubmit, register, setError, formState } = useForm({
  //   mode: "onChange",
  //   resolver: joiResolver(schema),
  // });

  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(true);
  const [error, setErr] = useState("");

  const resetter = () => {
    setTimeout(() => {
      setErr("");
    }, 3000);
  };
  const handleFormSubmit = async () => {
    await SanitizeRequestString(email);
    if (buttonClicked) {
      return;
    }
    setErr(``);
    buttonClicked = true;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (email === "" || regex.test(email) === false) {
      return setErr("please provide Email");
    }
    try {
      setbuttonText("Sending...");
      let encryptionData = await requestBodyEncryptionUnprotected({
        email: email,
      });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/verifyemail`,
        { data: encryptionData },
        {
          headers: {
            "security-set": true,
          },
        }
      );
      buttonClicked = false;
      setbuttonText("Send Mail");
      setShowSuccess(true);
      return;
      //return setErr(`A password reset link has been shared on ${email} `);
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      setbuttonText("Send Mail");
      setErr("Failed to send password recovery link");
      resetter();
      buttonClicked = false;
    }
  };

  return (
    <>
      <div className="forgetPasswordForm">
        <div className="backBtn" onClick={() => router.push("/admin/login")}>
          <ArrowLeft />
        </div>
        <h2>Provide Email</h2>
        <div className="inputsList">
          <p
            className="text-danger fw-bold"
            style={{
              color: "rgb(228, 71, 87)",
              marginBottom: "3px",
              fontSize: "16px",
            }}
          >
            {error}
          </p>

          <form method="post" autoComplete="off">
            <div className="formInputs">
              <input
                type="email"
                id="password"
                name="password"
                placeholder="Email"
                autoComplete="off"
                onChange={(e) => {
                  setDisable(false);
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="buttonContainer">
              <div className="formInputs submit">
                <button
                  className="btnHoverEffectOutline"
                  type="button"
                  style={{
                    background: disable ? "#333333" : "#e44757",
                    color: disable ? "#474747" : "#FFF",
                  }}
                  disabled={disable ? true : false}
                  onClick={() => {
                    handleFormSubmit();
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* success modal */}
      <Modal
        modaltitle={"Successfully Submitted"}
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>You Have Successfully Submitted</h5>
            <p>Kindly Check Your Email For Verification</p>
          </div>
        </div>
      </Modal>
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

export default ForgetPasswordForm;
