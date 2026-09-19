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

function ForgetPasswordForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
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

  const onSubmit = (data) => {
    if (data) {
      setShowSuccess(true);
    }
  };

  return (
    <>
      <div className="forgetPasswordForm">
        <div className="backBtn" onClick={() => router.push("/admin/login")}>
          <ArrowLeft />
        </div>
        <h2>Create Password</h2>
        <div className="inputsList">
          <form method="post" autoComplete="off">
            <div className="formInputs">
              <div className="iconinputContainer">
                <input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="off"
                  {...register("password")}
                  error={formState.errors.password && true}
                />
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? eyeSlash : eye}
                </i>
              </div>

              {/* <label htmlFor="password">Password</label> */}
              {formState.errors.password && (
                <p>{formState.errors.password.message}</p>
              )}
            </div>
            <div className="formInputs">
              <div className="iconinputContainer">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="off"
                  {...register("confirmpassword")}
                  error={formState.errors.confirmpassword && true}
                />
                <i onClick={toggleConfirmPasswordVisiblity}>
                  {confirmPasswordShown ? eyeSlash : eye}
                </i>
              </div>

              {/* <label htmlFor="confirmpassword">Confirm Password</label> */}
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
    </>
  );
}

export default ForgetPasswordForm;
