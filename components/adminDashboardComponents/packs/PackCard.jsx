import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";

const PackTypedata = [
  { id: 0, label: "Default" },
  { id: 1, label: "User Custom" },
];
const PackStatusdata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Deactive" },
];
// form validations
const schema = Joi.object({
  packname: Joi.string().required().min(4).max(20).label("packname").messages({
    "string.empty": `Pack Name Required`,
    "any.required": `Required Field`,
  }),
  price: Joi.number().required().label("price").messages({
    "string.empty": `Price Required`,
    "any.required": `Required Field`,
  }),
  currency: Joi.string().required().max(20).label("currency").messages({
    "string.empty": `Currency Required`,
    "any.required": `Required Field`,
  }),
  bonus: Joi.number().required().max(20).label("bonus").messages({
    "string.empty": `Bonus Required`,
    "any.required": `Required Field`,
  }),
  locked: Joi.number().required().max(5).label("locked").messages({
    "string.empty": `Locked Required`,
    "any.required": `Required Field`,
  }),
});

function PackCard({ cardInfo, key }) {
  const [getDropDownStatus, setGetDropDownStatus] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const [packTypeValue, setPackTypeValue] = useState("Default");
  const [packTypestatusError, setPackTypeStatusError] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const getDropdownValue = (value) => {
    setGetDropDownStatus(value);
  };
  const getPackTypeValue = (value) => {
    setPackTypeValue(value);
  };

  const onSubmit = async (data) => {
    data = { ...data, status: getDropDownStatus };
    data = { ...data, packtype: packTypeValue };
    if (getDropDownStatus) {
      setStatusError(false);
      if (packTypeValue) {
        setPackTypeStatusError(false);
        if (data) {
          try {
            const sanData = await SanitizeRequestObject(data);
            let encryptionData = await requestBodyEncryptionAdmin(sanData);
            let result = await axios.post(
              `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/update`,
              { data: encryptionData },
              {
                withCredentials: true,
                headers: {
                  "security-set": true,
                },
              }
            );
            await SanitizeRequestString(result.data.data);
            if (result && result.status == 200) {
              toast.success("Pack Successfully Updated", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              console.log("error getting api response");
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          setPackTypeStatusError(true);
        }
      }
    } else {
      setStatusError(true);
    }
  };
  return (
    <div
      key={key}
      className={`packCard ${
        cardInfo.status == "Active" ? "ActiveCard" : "DeactivateCard"
      }`}
    >
      <div className="packCardInner">
        <div className="formList">
          <div className="inputListContainer packtype">
            <h6>Pack Type</h6>
            <div className="formInputDropDown text-white">
              <Dropdown
                data={PackTypedata}
                getDropdownValue={getPackTypeValue}
                placeholder={cardInfo.LockedPeriodType}
              />
              {packTypestatusError && <p>{"Kindly Select The Pack Type"}</p>}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Pack Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="packname"
                name="packname"
                autoComplete="off"
                {...register("packname")}
                error={formState.errors.packname && true}
                defaultValue={cardInfo.PackName}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.packname && (
                <p>{formState.errors.packname.message}</p>
              )}
            </div>
          </div>

          <div
            className={`inputListContainer ${
              cardInfo.packtype == "User Custom" ? "disabled" : ""
            }`}
          >
            <h6>Price</h6>
            <div className="formInputs">
              <input
                type="text"
                id="price"
                name="price"
                autoComplete="off"
                {...register("price")}
                error={formState.errors.price && true}
                placeholder="0"
                defaultValue={cardInfo.Amount}
                disabled={
                  cardInfo.status == "Deactive" ||
                  cardInfo.packtype == "User Custom"
                }
              />
              {formState.errors.price && (
                <p>{formState.errors.price.message}</p>
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
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.currency && (
                <p>{formState.errors.currency.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Bonus(%)</h6>
            <div className="formInputs">
              <input
                type="text"
                id="bonus"
                name="bonus"
                autoComplete="off"
                {...register("bonus")}
                error={formState.errors.bonus && true}
                defaultValue={cardInfo.Bonous}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.bonus && (
                <p>{formState.errors.bonus.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Locked(Months)</h6>
            <div className="formInputs">
              <input
                type="text"
                id="locked"
                name="locked"
                autoComplete="off"
                {...register("locked")}
                error={formState.errors.locked && true}
                defaultValue={cardInfo.LockedPeriod}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.locked && (
                <p>{formState.errors.locked.message}</p>
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
                data={PackStatusdata}
                placeholder={cardInfo.Status}
                getDropdownValue={getDropdownValue}
              />
              {statusError && <p>{"kindly select the status"}</p>}
            </div>
          </div>
        </div>

        <div className="footerCard">
          <button className="deletebtn btnHoverEffectOutline">
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

export default PackCard;
