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

const nftLicenseStatusdata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Deactive" },
];
// form validations
const schema = Joi.object({
  nftLicensename: Joi.string().required().label("nftLicensename").messages({
    "string.empty": `NftLicense Name Required`,
    "any.required": `Required Field`,
  }),
  price: Joi.number().required().max(5000000).label("price").messages({
    "string.empty": `Price Required`,
    "any.required": `Required Field`,
  }),
  currency: Joi.string().required().max(50).label("currency").messages({
    "string.empty": `Currency Required`,
    "any.required": `Required Field`,
  }),
  licenseImageLink: Joi.string()
    .required()
    .max(250)
    .label("licenseImageLink")
    .messages({
      "string.empty": `License Image Link Required`,
      "any.required": `Required Field`,
    }),
  Description: Joi.string().required().max(150).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  LookUp: Joi.number().required().max(100).label("LookUp").messages({
    "string.empty": `LookUp Required`,
    "any.required": `Required Field`,
  }),
  LookUpInterval: Joi.string()
    .required()
    .max(50)
    .label("LookUpInterval")
    .messages({
      "string.empty": `LookUpInterval Required`,
      "any.required": `Required Field`,
    }),
  // level1: Joi.number().required().label("level1").messages({
  //   "string.empty": `Level1 Required`,
  //   "any.required": `Required Field`,
  // }),
});

function NFTLicenseCard({ cardInfo, handleDelete, handleUpdate }) {
  const [getStatus, setGetStatus] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const getDropdownValue = (value) => {
    setGetStatus(value);
  };
  const onSubmit = (data) => {
    // data = { ...data, status: getStatus };
    data = {
      _id: cardInfo?._id,
      name: data.nftLicensename,
      discription: data.Description,
      price: data.price,
      currency: data.currency,
      lookup: data.LookUp,
      lookUpInterval: data.LookUpInterval,
      image: data.licenseImageLink,
    };
    if (getStatus) {
      setStatusError(false);
      if (data) {
        // data
        handleUpdate(data);
      }
    } else {
      setStatusError(true);
    }
  };
  return (
    <div
      className={`nftLicenseCard ${
        cardInfo.status == "Active" ? "ActiveCard" : "DeactivateCard"
      }`}
    >
      <div className="nftLicenseCardInner">
        <div className="formList">
          <div className="inputListContainer">
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="nftLicensename"
                name="nftLicensename"
                autoComplete="off"
                {...register("nftLicensename")}
                error={formState.errors.nftLicensename && true}
                defaultValue={cardInfo?.Name ? cardInfo.Name : "N/A"}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.nftLicensename && (
                <p>{formState.errors.nftLicensename.message}</p>
              )}
            </div>
          </div>
          <div
            className={`inputListContainer ${
              cardInfo.nftLicensetype == "User Custom" ? "disabled" : ""
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
                defaultValue={cardInfo?.Price ? cardInfo.Price : "N/A"}
                disabled={
                  cardInfo.status == "Deactive" ||
                  cardInfo.nftLicensetype == "User Custom"
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
                defaultValue={cardInfo?.Currency ? cardInfo.Currency : "N/A"}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.currency && (
                <p>{formState.errors.currency.message}</p>
              )}
            </div>
          </div>
          {cardInfo?.Image.includes("/") ? (
            <div className="imgboxContainer">
              <h6>License Image</h6>
              <div className="licenseimgBox">
                <Image
                  src={cardInfo?.Image}
                  width={800}
                  height={600}
                  alt="stable coins"
                  loading="lazy"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} />
              </div>
            </div>
          ) : (
            <div className="imgboxContainer">
              <h6 style={{ color: "#e44757", fontWeight: "600" }}>
                License Image Not Found
              </h6>

              <div className="licenseimgBox">
                <Image
                  src={"/nodata.png"}
                  width={800}
                  height={600}
                  alt="stable coins"
                  loading="lazy"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} />
              </div>
            </div>
          )}

          <div className="inputListContainer">
            <h6>Image Link</h6>
            <div className="formInputs">
              <input
                type="text"
                id="licenseImageLink"
                name="licenseImageLink"
                autoComplete="off"
                {...register("licenseImageLink")}
                error={formState.errors.licenseImageLink && "true"}
                defaultValue={cardInfo?.Image ? cardInfo.Image : "N/A"}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.licenseImageLink && (
                <p>{formState.errors.licenseImageLink.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Description</h6>
            <div className="formInputs">
              <textarea
                name="Description"
                id="Description"
                {...register("Description")}
                defaultValue={
                  cardInfo?.Description ? cardInfo.Description : "N/A"
                }
                error={formState.errors.Description && true}
                rows="4"
                cols="50"
                disabled={cardInfo.status == "Deactive"}
              ></textarea>
              {formState.errors.Description && (
                <p>{formState.errors.Description.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>LookUp</h6>
            <div className="formInputs">
              <input
                type="text"
                id="LookUp"
                name="LookUp"
                autoComplete="off"
                {...register("LookUp")}
                error={formState.errors.LookUp && true}
                defaultValue={cardInfo?.LookUp ? cardInfo.LookUp : "N/A"}
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.LookUp && (
                <p>{formState.errors.LookUp.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>LookUp Interval</h6>
            <div className="formInputs">
              <input
                type="text"
                id="LookUpInterval"
                name="LookUpInterval"
                autoComplete="off"
                {...register("LookUpInterval")}
                error={formState.errors.LookUpInterval && true}
                defaultValue={
                  cardInfo?.LookUpInterval ? cardInfo.LookUpInterval : "N/A"
                }
                disabled={cardInfo.status == "Deactive"}
              />
              {formState.errors.LookUpInterval && (
                <p>{formState.errors.LookUpInterval.message}</p>
              )}
            </div>
          </div>

          {/*  levels */}
          {/* <div className="inputListContainer">
            <h6>Level 1</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level1"
                name="level1"
                {...register("level1")}
                error={formState.errors.level1 && true}
                defaultValue={cardInfo.level1}
                disabled={cardInfo.status == "Deactive"}
              />
              <i>{percentIcon}</i>
              {formState.errors.level1 && (
                <p>{formState.errors.level1.message}</p>
              )}
            </div>
          </div> */}
          {/* <div className={`inputListContainer ${
              cardInfo.status == "Active" ? "Active" : "Deactivate"
            }`}
          >
           <h6>Status</h6>
           <div className="formInputDropDown">
           <Dropdown data={nftLicenseStatusdata} getDropdownValue={getDropdownValue} placeholder={cardInfo.status} />
            {statusError && (
                <p>{"kindly select the status"}</p>
              )}
             </div>
          </div> */}
        </div>

        <div className="footerCard">
          <button
            className="deletebtn btnHoverEffectOutline"
            onClick={() => {
              handleDelete(cardInfo?._id);
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

export default NFTLicenseCard;
