import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Modal from "@/components/reusables/Modal";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const oneletteronenumberonechacter =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const schema = Joi.object({
  oldpassword: Joi.string()
    .regex(oneletteronenumberonechacter)
    .required()
    .min(4)
    .label("Old Password")
    .messages({
      "string.empty": `Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
    }),
  newpassword: Joi.string()
    .regex(oneletteronenumberonechacter)
    .required()
    .min(4)
    .label("New Password")
    .messages({
      "string.empty": `Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
    }),
  confirmpassword: Joi.string()
    .regex(oneletteronenumberonechacter)
    .equal(Joi.ref("newpassword"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": `Password Does Not Match`,
      "string.empty": `Confirm Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
    }),
});
function PasswordSettings({ users }) {
  // states

  const [passwordShown, setpasswordShown] = useState(false);
  const [newPasswordShown, setnewPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [updateErrorMessage, setupdateErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  // functions
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const togglepasswordVisiblity = () => {
    setpasswordShown(passwordShown ? false : true);
  };
  const toggleNewPasswordVisiblity = () => {
    setnewPasswordShown(newPasswordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setconfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const onSubmitPasswordData = async (data) => {
    try {
      let newPassword = {
        oldpassword: data.oldpassword,
        password: data.confirmpassword,
      };
      await setupdateErrorMessage("");
      let encryptionData = await encryptRequestBody(newPassword);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/updatepassword`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      if (result) {
        setShowSuccess(true);
      }
      await setupdateErrorMessage("");
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
      await setupdateErrorMessage("Failed to update password");
      console.log("Failed to update", e);
      //setShowSuccess(false);
      setError("Failed to update password");
    }
  };

  return (
    <div className="passwordsettings">
      <h2 className="gentitle">Manage Your Password</h2>
      <div className="changeEmailContainer">
        <div
          style={{ color: "#e44757", fontSize: "14px", marginBottom: "8px" }}
        >
          {updateErrorMessage}
        </div>
        <form method="post" autoComplete="off">
          <div className="formInputs">
            <div className="iconinputContainer">
              <input
                id="oldpassword"
                name="oldpassword"
                type={passwordShown ? "text" : "password"}
                placeholder="Old Password"
                autoComplete="off"
                {...register("oldpassword")}
                error={formState.errors.oldpassword && true}
              />
              {/* <i onClick={togglepasswordVisiblity}>
                {passwordShown ? eyeSlash : eye}
              </i> */}
            </div>

            {formState.errors.oldpassword && (
              <p>{formState.errors.oldpassword.message}</p>
            )}
          </div>
          <div className="formInputs">
            <div className="iconinputContainer">
              <input
                id="newpassword"
                name="newpassword"
                type={newPasswordShown ? "text" : "password"}
                placeholder="New Password"
                {...register("newpassword")}
                autoComplete="off"
                error={formState.errors.newpassword && true}
              />
              {/* <i onClick={toggleNewPasswordVisiblity}>
                {newPasswordShown ? eyeSlash : eye}
              </i> */}
            </div>

            {formState.errors.newpassword && (
              <p>{formState.errors.newpassword.message}</p>
            )}
          </div>
          <div className="formInputs">
            <div className="iconinputContainer">
              <input
                id="confirmpassword"
                name="confirmpassword"
                type={confirmPasswordShown ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmpassword")}
                autoComplete="off"
                error={formState.errors.confirmpassword && true}
              />
              {/* <i onClick={toggleConfirmPasswordVisiblity}>
                {confirmPasswordShown ? eyeSlash : eye}
              </i> */}
            </div>

            {formState.errors.confirmpassword && (
              <p>{formState.errors.confirmpassword.message}</p>
            )}
          </div>

          <div className="buttonContainer">
            <div className="formInputs submit">
              <button
                style={{
                  background: !formState.isValid ? "#333333" : "#e44757",
                  color: !formState.isValid ? "#474747" : "#FFF",
                }}
                disabled={!formState.isValid}
                onClick={handleSubmit(onSubmitPasswordData)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* show success modal */}
      {/* success modal */}
      <Modal show={showSuccess} onClose={() => setShowSuccess(false)}>
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
            <h5>Password Updated Successfully</h5>
            <p></p>
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
    </div>
  );
}

export default PasswordSettings;
