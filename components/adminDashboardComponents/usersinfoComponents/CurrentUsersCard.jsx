import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import Modal from "@/components/reusables/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowDown,
  faArrowUp,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
const ArrowDown = <FontAwesomeIcon icon={faArrowDown} />;
const ArrowUp = <FontAwesomeIcon icon={faArrowUp} />;
const Info = <FontAwesomeIcon icon={faInfo} />;
import SimpleButton from "@/components/reusables/SimpleButton";

// form validations
const schema = Joi.object({
  reasonDescription: Joi.string().required().label("reasonDescription").messages({
    "string.empty": `Reason Required`,
    "any.required": `Required Field`,
  })
});

function CurrentUsersCard() {
  const router = useRouter();
  const [eyeiconShown, setEyeicon] = useState(true);
  const toggleeyeVisiblity = () => {
    setEyeicon(eyeiconShown ? false : true);
  };
  const [showReasonModal, setShowReasonModal] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const closeModal = () =>{
    setShowReasonModal(false)
  }
  const onSubmit = (data) => {
     if (data) {
      // data
      closeModal();
    }else{
    }
     
   };
  return (
    <div className="cusers">
    <div className="cusersInner">
      <div className="deviceInformationCard">
        <div className="level actionBtnCardsContainer">
          <div className="actionBtnCards">
            <h6>info@netheru.io </h6>
            <button className="viewdetailinfoBtn btnHoverEffectOutline" onClick={() => {router.push("/admin/dashboard/usersinformationpanel");}}>
              View Detail Info
            </button>
            <div className="actionBtns">
              <button onClick={() => {  router.push("/admin/dashboard/usersinfodetails");}} className=" btnHoverEffectOutline">
                <i >{Info}</i>
              </button>
              <button onClick={() => {  router.push("/admin/dashboard/upline");}} className=" btnHoverEffectOutline">
                <i >{ArrowUp}</i>
              </button>
              <button onClick={() => {  router.push("/admin/dashboard/downline");}} className=" btnHoverEffectOutline">
                <i >{ArrowDown}</i>
              </button>
              <button
                className=" btnHoverEffectOutline"
                onClick={toggleeyeVisiblity}
              >
                {/* <image src="/images/btneye.png" width={24} height={24}/> */}
                <i> {eyeiconShown ? eyeSlash : eye}</i>
              </button>
            </div>
          </div>
          <button className="btnHoverEffectOutline" onClick={() => {setShowReasonModal(true)}}>
            Deactivate
          </button>
        </div>
        {!eyeiconShown && (
          <div className="level">
            <p>Public Key</p>
            <p>34df4e...4fa</p>
          </div>
        )}
        <div className="level">
          <p>Email Verified</p>
          <p className="redtext">Unverified</p>
        </div>
        <div className="level">
          <p>Role</p>
          <p className="greentext">DeswapAdminRole</p>
        </div>
        <div className="level">
          <p>Disabled Reason</p>
          <p>N/A</p>
        </div>
        <div className="level">
          <p>Failed Login Attempts</p>
          <p className="resetBtnContainer">
            <button className="resetBtn btnHoverEffectOutline">
              Reset Attempts
            </button>
            <span
              style={{ marginLeft: "1rem" }}
              className="redtext digits"
            >
              0
            </span>
          </p>
        </div>
        <div className="level">
          <p>Created At</p>
          <p>6,December 2021 (3:15:08 pm)</p>
        </div>
      </div>
    </div>

     {/* reason modal */}
      <Modal
        show={showReasonModal}
        cross={false}
        modaltitle="User Deactivation Notification"
        onClose={() => setShowReasonModal(false)}
      >
        <div className="createreasonModalCard">
        <div className={` reasonModalCard`}>
      <div className="reasonModalCardInner">
      <div className="formList">
        <h6>Are you sure to Deactivate this user ?</h6>
        <div className="formInputs">               
              <textarea name="reasonDescription" id="reasonDescription" {...register("reasonDescription")} error={formState.errors.reasonDescription && true}  rows="4" cols="50"></textarea>
              {formState.errors.reasonDescription && (
                <p>{formState.errors.reasonDescription.message}</p>
              )}
            </div>
        </div>
        <div className="footerCard">
          <SimpleButton
            text={"Cancel"}
            backgroundColor={"#291719"}
            color={"#E44757"}
            onClick={closeModal}
          />
          <SimpleButton
            text={"Deactivate"}
            backgroundColor={!formState.isValid ? "#333333" : "#E44757"}
            color={!formState.isValid ? "#474747" : "#FFFFFF"}
            disabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
        </div>
      </Modal>
  </div>
  )
}

export default CurrentUsersCard