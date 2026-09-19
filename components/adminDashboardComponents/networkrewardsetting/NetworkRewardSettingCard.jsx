import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";
import Modal from "@/components/reusables/Modal";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import axios from "axios";

const NetworkRewardSettingStatusdata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Deactivated" },
];
// form validations
const schema = Joi.object({
  Level: Joi.number().required().label("Level").messages({
    "string.empty": `Level Required`,
    "any.required": `Required Field`,
  }),
  Percentage: Joi.number().required().max(50).label("Percentage").messages({
    "string.empty": `Percentage Required`,
    "any.required": `Required Field`,
  }),
});

function NetworkRewardSettingCard({ cardInfo, key, deleteNRSCardFunc }) {
  const [getDropDownStatus, setGetDropDownStatus] = useState("Active");
  const [StatusError, setStatusError] = useState(false);
  const [deletePackModal, setDeletePackModal] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const getDropdownValue = (value) => {
    setGetDropDownStatus(value);
  };

  const onSubmit = async (data) => {
    data = { ...data, Status: getDropDownStatus, id: cardInfo._id };
    if (getDropDownStatus) {
      setStatusError(false);
      if (data) {
        try {
          const sanData = await SanitizeRequestObject(data);
          //requestBodyEncryptionAdmin
          let encryptionData = await requestBodyEncryptionAdmin(sanData);
          let result = await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardssetting/update`,
            { data: encryptionData },
            {
              withCredentials: true,
              headers: {
                "security-set": true,
              },
            }
          );
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      setStatusError(true);
    }
  };
  return (
    <div
      key={key}
      className={`networkRewardSettingCard ${
        cardInfo.Status == "Active" ? "ActiveCard" : "DeactivateCard"
      }`}
    >
      <div className="networkRewardSettingCardInner">
        <div className="formList">
          <div
            className={`inputListContainer ${
              cardInfo.networkRewardSettingtype == "User Custom"
                ? "disabled"
                : ""
            }`}
          >
            <h6>Level</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Level"
                name="Level"
                autoComplete="off"
                {...register("Level")}
                error={formState.errors.Level && true}
                placeholder="0"
                defaultValue={cardInfo?.Level ? cardInfo.Level : "N/A"}
                disabled={cardInfo.Status == "Deactivated"}
              />
              {formState.errors.Level && (
                <p>{formState.errors.Level.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Percentage(%)</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Percentage"
                name="Percentage"
                autoComplete="off"
                {...register("Percentage")}
                error={formState.errors.Percentage && true}
                defaultValue={
                  cardInfo?.Percentage ? cardInfo.Percentage : "N/A"
                }
                disabled={cardInfo.Status == "Deactivated"}
              />
              {formState.errors.Percentage && (
                <p>{formState.errors.Percentage.message}</p>
              )}
            </div>
          </div>

          <div
            className={`inputListContainer ${
              cardInfo.Status == "Active" ? "Active" : "Deactivate"
            }`}
          >
            <h6>Status</h6>
            <div className="formInputDropDown">
              <Dropdown
                data={NetworkRewardSettingStatusdata}
                placeholder={cardInfo?.Status}
                getDropdownValue={getDropdownValue}
              />
              {StatusError && <p>{"kindly select the Status"}</p>}
            </div>
          </div>
        </div>

        <div className="footerCard">
          <button
            className="deletebtn btnHoverEffectOutline"
            onClick={() => {
              setDeletePackModal(true);
            }}
          >
            <Image
              width={24}
              height={24}
              src="/images/btnDel.png"
              alt="del icon"
              loading="lazy"
            />
          </button>
          <SimpleButton
            text={"Update"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
      {/* delete Modal */}
      <Modal
        show={deletePackModal}
        cross={false}
        modaltitle="Delete Network Reward Level"
        onClose={() => setDeletePackModal(false)}
      >
        <div className="NRSCard modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Claimrewards.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Are You Sure You Want To Delete This Level Card ?</h5>
          </div>
          <div className="footerCard">
            <SimpleButton
              text={"Cancel"}
              backgroundColor={"#291719"}
              color={"#E44757"}
              onClick={() => {
                setDeletePackModal(false);
              }}
            />
            <SimpleButton
              text={"Delete"}
              backgroundColor={"#E44757"}
              color={"#FFFFFF"}
              onClick={() => {
                setDeletePackModal(false);
                deleteNRSCardFunc(cardInfo._id);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NetworkRewardSettingCard;
