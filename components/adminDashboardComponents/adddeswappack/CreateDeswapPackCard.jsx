import React, { useState, useEffect } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "@/utils/common/axios";
import {requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
/*
import {encryptRequestBody } from "@/utils/common/jwtToken";
import {requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import {requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
*/
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
const percentIcon = <FontAwesomeIcon icon={faPercent} />;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"



// form validations
const schema = Joi.object({
  PackName: Joi.string().required().max(150).label("PackName").messages({
    "string.empty": `Deswapstack Name Required`,
    "any.required": `Required Field`,
  }),
  Amount: Joi.number().required().max(111111150).label("Amount").messages({
    "string.empty": `Amount Required`,
    "any.required": `Required Field`,
  }),
  LockedPeriod: Joi.number().required().max(250).label("LockedPeriod").messages({
    "string.empty": `Locked Period Required`,
    "any.required": `Required Field`,
  }),
  LockedPeriodType: Joi.string().required().max(150).label("LockedPeriodType").messages({
    "string.empty": `Locked Period Type Required`,
    "any.required": `Required Field`,
  }),
  Bonous: Joi.number().required().max(7750).label("Bonous").messages({
    "string.empty": `Bonus Required`,
    "any.required": `Required Field`,
  }),
});

function CreateDeswapPackCard({ closeModal }) {
  const [loadingState, setLoadingState] = useState(false);
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const onSubmit = (data) => {
    if (data) {
      creatingClaimmingPackFunc(data);
    }
  };

  // api call
const creatingClaimmingPackFunc = async (data) => {
  try {
    setLoadingState(true);
    const data1=await SanitizeRequestObject(data)
    let encryptionData = await requestBodyEncryptionAdmin(data1)
    let result = await axios.post(
      `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/pack/insert`,
      {data:encryptionData},
      { withCredentials: true,
        headers:{
          'security-set':true
        }
       }
    );
    setLoadingState(result && false);
    if(result && result.status == 200){
      setLoadingState(result && false);
      closeModal();
    }
    else{
        console.log("error getting api response")
    }
    setLoadingState(false);
    const sanData=await SanitizeRequestObject(result.data.data)
     return sanData;

  } catch (e) {
    console.log(e);
    toast.error(e.message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
    setLoadingState(false);
    return 0;
  }
};

const closeModalFunction = () =>{
  closeModal();
  reset({
    PackName: "",
    Amount: "",
    LockedPeriod: "",
    LockedPeriodType: "",
    Bonous: "",
  });
}
  return (
    <div className={` deswapstackCard`}>
      <div className="deswapstackCardInner">
        <div className="formList">
          <div className="inputListContainer">
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="PackName"
                name="PackName"
                autoComplete="off"
                {...register("PackName")}
                error={formState.errors.PackName && true}
              />
              {formState.errors.PackName && (
                <p>{formState.errors.PackName.message}</p>
              )}
            </div>
          </div>
          <div className={`inputListContainer`}>
            <h6>Price</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Amount"
                name="Amount"
                autoComplete="off"
                {...register("Amount")}
                error={formState.errors.Amount && true}
              />
              {formState.errors.Amount && (
                <p>{formState.errors.Amount.message}</p>
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
              />
              {formState.errors.LockedPeriod && (
                <p>{formState.errors.LockedPeriod.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Locked Period Type</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="LockedPeriodType"
                name="LockedPeriodType"
                autoComplete="off"
                {...register("LockedPeriodType")}
                error={formState.errors.LockedPeriodType && true}
              />
              {formState.errors.LockedPeriodType && (
                <p>{formState.errors.LockedPeriodType.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Bonus</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Bonous"
                name="Bonous"
                autoComplete="off"
                {...register("Bonous")}
                error={formState.errors.Bonous && true}
              />
              {formState.errors.Bonous && (
                <p>{formState.errors.Bonous.message}</p>
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
      {loadingState && <Loader />}
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
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
/>
    </div>
  );
}

export default CreateDeswapPackCard;
