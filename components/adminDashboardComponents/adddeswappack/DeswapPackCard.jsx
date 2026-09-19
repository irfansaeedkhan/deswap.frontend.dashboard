import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
const percentIcon = <FontAwesomeIcon icon={faPercent} />;
import Dropdown from "@/components/global/DropDown";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/utils/common/axios";

const deswapstackStatusdata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Deactive" },
];
// form validations
const schema = Joi.object({
  deswapstackname: Joi.string()
    .required()
    .max(150)
    .label("deswapstackname")
    .messages({
      "string.empty": `Name Required`,
      "any.required": `Required Field`,
    }),
  Amount: Joi.number().required().max(111111150).label("Amount").messages({
    "string.empty": `Amount Required`,
    "any.required": `Required Field`,
  }),
  currency: Joi.string().required().max(150).label("currency").messages({
    "string.empty": `Currency Required`,
    "any.required": `Required Field`,
  }),
  Bonous: Joi.number().required().max(7750).label("Bonous").messages({
    "string.empty": `Bonus Required`,
    "any.required": `Required Field`,
  }),
  LockedPeriod: Joi.number()
    .required()
    .max(250)
    .label("LockedPeriod")
    .messages({
      "string.empty": `Locked Period Required`,
      "any.required": `Required Field`,
    }),
  LockedPeriodType: Joi.string()
    .required()
    .max(150)
    .label("LockedPeriodType")
    .messages({
      "string.empty": `Locked Period Type Required`,
      "any.required": `Required Field`,
    }),
});

function DeswapPackCard({ cardInfo, key, deleteClaimmingPack }) {
  const [loadingState, setLoadingState] = useState(false);
  const [getStatus, setGetStatus] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const getDropdownValue = (value) => {
    setGetStatus(value);
  };
  const onSubmit = async (data) => {
    data = { ...data, status: getStatus };
    setStatusError(false);
    const updateData = { id: cardInfo._id, ...data };
    const sanData = await SanitizeRequestObject(updateData);
    let encryptedData = await requestBodyEncryptionAdmin(sanData);

    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/update`,
        { data: encryptedData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      //await fetchNFTListFunc();
      setLoadingState(result && false);
      toast.success("Clamming Pack Successfully Updated", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return result;
      return result;
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
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };
  return (
    <div
      key={key}
      className={`deswapstackCard ${
        cardInfo.Status == "Active" ? "ActiveCard" : "DeactivateCard"
      }`}
    >
      <div className="deswapstackCardInner">
        <div className="formList">
          <div className="inputListContainer">
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="deswapstackname"
                name="deswapstackname"
                autoComplete="off"
                {...register("deswapstackname")}
                error={formState.errors.deswapstackname && true}
                defaultValue={cardInfo.PackName}
                disabled={cardInfo.Status == "Deactive"}
              />
              {formState.errors.deswapstackname && (
                <p>{formState.errors.deswapstackname.message}</p>
              )}
            </div>
          </div>
          <div
            className={`inputListContainer ${
              cardInfo.deswapstacktype == "User Custom" ? "disabled" : ""
            }`}
          >
            <h6>Amount</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Amount"
                name="Amount"
                autoComplete="off"
                {...register("Amount")}
                error={formState.errors.Amount && true}
                placeholder="0"
                defaultValue={cardInfo.Amount}
                disabled={
                  cardInfo.Status == "Deactive" ||
                  cardInfo.deswapstacktype == "User Custom"
                }
              />
              {formState.errors.Amount && (
                <p>{formState.errors.Amount.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Currency</h6>
            <div className="formInputs">
              <input
                type="text"
                id="currency"
                name="currency"
                autoComplete="off"
                {...register("currency")}
                error={formState.errors.currency && true}
                defaultValue={cardInfo.Currency}
                disabled={cardInfo.Status == "Deactive"}
              />
              {formState.errors.currency && (
                <p>{formState.errors.currency.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Bonus</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="Bonous"
                name="Bonous"
                autoComplete="off"
                {...register("Bonous")}
                error={formState.errors.Bonous && true}
                defaultValue={cardInfo.Bonous}
                disabled={cardInfo.Status == "Deactive"}
              />
              {/* <i>{percentIcon}</i> */}
              {formState.errors.Bonous && (
                <p>{formState.errors.Bonous.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Locked Period</h6>
            <div className="formInputs">
              <input
                type="text"
                id="LockedPeriod"
                name="LockedPeriod"
                autoComplete="off"
                {...register("LockedPeriod")}
                error={formState.errors.LockedPeriod && true}
                defaultValue={cardInfo.LockedPeriod}
                disabled={cardInfo.Status == "Deactive"}
              />
              {formState.errors.LockedPeriod && (
                <p>{formState.errors.LockedPeriod.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Locked Period Type</h6>
            <div className="formInputs">
              <input
                type="text"
                id="LockedPeriodType"
                name="LockedPeriodType"
                autoComplete="off"
                {...register("LockedPeriodType")}
                error={formState.errors.LockedPeriodType && true}
                defaultValue={cardInfo.LockedPeriodType}
                disabled={cardInfo.Status == "Deactive"}
              />
              {formState.errors.LockedPeriodType && (
                <p>{formState.errors.LockedPeriodType.message}</p>
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
                data={deswapstackStatusdata}
                getDropdownValue={getDropdownValue}
                placeholder={cardInfo.Status}
              />
              {statusError && <p>{"kindly select the status"}</p>}
            </div>
          </div>
        </div>

        <div className="footerCard">
          <button
            className="deletebtn btnHoverEffectOutline"
            onClick={() => {
              deleteClaimmingPack({ id: cardInfo._id });
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
    </div>
  );
}

export default DeswapPackCard;
