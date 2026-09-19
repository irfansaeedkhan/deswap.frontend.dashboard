import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Modal from "@/components/reusables/Modal";
import { useRouter } from "next/router";
import ArrowLeft from "@/assets/svgAssets/ArrowLeft";
import axios from "axios";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "@/utils/common/sanitize";

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
      "any.only": `Password does not match`,
      "string.empty": `Confirm Password Required`,
      "any.required": `Required Field`,
    }),
});

function ResetPasswordForm() {
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [err, setErr] = useState("");
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setconfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const onSubmit = async (submitData) => {
    try {
      const sanData = await SanitizeRequestObject(submitData);
      if (sanData != null && sanData != undefined) {
        let alldata = await { ...sanData, token: router.query.token };
        let encryptionData = await requestBodyEncryptionUnprotected(alldata);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/newPassword`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        try {
          if (data.success) {
            setShowSuccess(true);
            return router.push("/user/login");
          }

          setErr("Failed to reset password");
          //router.push("/user/login");
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
          setErr("Failed to reset password");
          //router.push("/user/login");
        }
      } else {
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
      console.log("Error message ", e);
    }
  };

  return (
    <>
      <div className="forgetPasswordForm">
        <div className="backBtn" onClick={() => router.push("/user/login")}>
          <ArrowLeft />
        </div>
        <h2>Create Password</h2>
        <div className="inputsList">
          <p
            className="text-danger fw-bold"
            style={{
              color: "rgb(228, 71, 87)",
              marginBottom: "3px",
              fontSize: "16px",
            }}
          >
            {" "}
            {err}
          </p>
          <form method="post" autoComplete="off">
            <div className="formInputs">
              <div className="iconinputContainer">
                <input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder={"Password"}
                  autoComplete="off"
                  {...register("password")}
                  error={formState.errors.password && true}
                />
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? eyeSlash : eye}
                </i>
              </div>

              {formState.errors.password && (
                <p>{formState.errors.password.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                id="confirmpassword"
                name="confirmpassword"
                type={confirmPasswordShown ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="off"
                {...register("confirmpassword")}
                error={formState.errors.confirmpassword && true}
              />
              {formState.errors.confirmpassword && (
                <p>{formState.errors.confirmpassword.message}</p>
              )}
              <i onClick={toggleConfirmPasswordVisiblity}>
                {confirmPasswordShown ? eyeSlash : eye}
              </i>
            </div>

            <div className="buttonContainer">
              <div className="formInputs submit">
                <button
                  style={{
                    background: !formState.isValid ? "#333333" : "#e44757",
                    color: !formState.isValid ? "#474747" : "#FFF",
                  }}
                  disabled={!formState.isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
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

export default ResetPasswordForm;
