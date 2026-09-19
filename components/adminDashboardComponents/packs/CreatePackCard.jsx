import React, { useEffect, useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { SanitizeRequestObject, SanitizeRequestString } from "../../../utils/common/sanitize"
import axios from "@/utils/common/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  name: Joi.string().required().min(2).max(20).label("packname").messages({
    "string.empty": `Pack Name Required`,
    "any.required": `Required Field`,
  }),
  amount: Joi.number().required().label("price").messages({
    "string.empty": `Price Required`,
    "any.required": `Required Field`,
  }),
  currency: Joi.string().required().max(20).label("currency").messages({
    "string.empty": `Currency Required`,
    "any.required": `Required Field`,
  }),
  bonous: Joi.number().required().max(5555).label("bonus").messages({
    "string.empty": `Bonus Required`,
    "any.required": `Required Field`,
  }),
  period: Joi.number().required().max(5555).label("locked").messages({
    "string.empty": `Locked Required`,
    "any.required": `Required Field`,
  }),
});

function CreatePackCard({ closeModal }) {
  const [getDropDownStatus, setGetDropDownStatus] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const [packTypeValue, setPackTypeValue] = useState("Default");
  const [packTypestatusError, setPackTypeStatusError] = useState(false);
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const getDropdownValue = (value) => {
    setGetDropDownStatus(value)
  }
  const getPackTypeValue = (value) => {
    setPackTypeValue(value)
  }

  const onSubmit = async (data) => {
    data = { ...data, "status": getDropDownStatus }
    data = { ...data, "periodtype": packTypeValue }
    if (getDropDownStatus) {
      setStatusError(false)
      if (packTypeValue) {
        setPackTypeStatusError(false)
        if (data) {
          try{
          const sanData = await SanitizeRequestObject(data)
          let encryptionData = await requestBodyEncryptionAdmin(sanData);
          let result = await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/insert`,
            { data: encryptionData },
            {
              withCredentials: true,
              headers: {
                "security-set": true,
              },
            }
          );
          await SanitizeRequestString(result.data.data)
          if (result && result.status == 200) {
            toast.success("Pack Successfully Added", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            closeModalFunction();
          } else {
            console.log("error getting api response");
          }
          closeModal();
        }catch(e){
          console.log(e)
        }
        }
        else {
          setPackTypeStatusError(true)
        }
      }
    } else {
      setStatusError(true)
    }

  };

  const closeModalFunction = async () => {
    closeModal();
    await setGetDropDownStatus("Active");

    await setPackTypeValue("Default");
    reset({
      packname: "",
      price: "",
      currency: "",
      bonus: "",
      locked: "",
    });
  }

  return (
    <div className={` packCard`}>
      <div className="packCardInner">
        <div className="formList">
          <div className="inputListContainer packtype">
            <h6>Pack Type</h6>
            <div className="formInputDropDown">
              <Dropdown data={PackTypedata} getDropdownValue={getPackTypeValue} placeholder="Default" />
              {packTypestatusError && (
                <p>{"kindly select the status"}</p>
              )}
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
                {...register("name")}
                error={formState.errors.packname && true}
                placeholder="Enter Pack Name"
              />
              {formState.errors.packname && (
                <p>{formState.errors.packname.message}</p>
              )}
            </div>
          </div>

          <div className={`inputListContainer`}>
            <h6>Price</h6>
            <div className="formInputs">
              <input
                type="text"
                id="price"
                name="price"
                autoComplete="off"
                {...register("amount")}
                error={formState.errors.price && true}
                placeholder="Enter Amount"
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
                placeholder="Enter Currency"
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
                {...register("bonous")}
                error={formState.errors.bonus && true}
                placeholder="0"
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
                {...register("period")}
                error={formState.errors.locked && true}
                placeholder="0"
              />
              {formState.errors.locked && (
                <p>{formState.errors.locked.message}</p>
              )}
            </div>
          </div>
          <div className={`inputListContainer `}
          >
            <h6>Status</h6>
            <div className="formInputDropDown">
              <Dropdown data={PackStatusdata} getDropdownValue={getDropdownValue} placeholder="Active" />
              {statusError && (
                <p>{"kindly select the status"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="footerCard">
          <SimpleButton
            text={"Cancel"}
            backgroundColor={"#291719"}
            color={"#E44757"}
            onClick={closeModalFunction}
          />
          <SimpleButton
            text={"Create"}
            backgroundColor={!formState.isValid ? "#333333" : "#E44757"}
            color={!formState.isValid ? "#474747" : "#FFFFFF"}
            disabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
          />
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
      />
    </div>
  );
}

export default CreatePackCard;
