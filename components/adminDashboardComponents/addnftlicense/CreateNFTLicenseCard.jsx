import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
const percentIcon = <FontAwesomeIcon icon={faPercent} />;

const nftLicenseTypedata = [
  { id: 0, label: "Default" },
  { id: 1, label: "User Custom" },
];
const nftLicenseStatusdata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Deactive" },
];
// form validations
const schema = Joi.object({
  Name: Joi.string().required().max(150).label("Name").messages({
    "string.empty": `NftLicense Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(150).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  Price: Joi.number().required().max(999999999999).label("Price").messages({
    "string.empty": `Price Required`,
    "any.required": `Required Field`,
  }),
  Currency: Joi.string().required().max(50).label("Currency").messages({
    "string.empty": `Currency Required`,
    "any.required": `Required Field`,
  }),
  LookUp: Joi.number().required().max(650).label("LookUp").messages({
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
  Image: Joi.string().required().max(250).label("Image").messages({
    "string.empty": `License Image Link Required`,
    "any.required": `Required Field`,
  }),
  // index: Joi.string().required().max(50).label("Image").messages({
  //   "string.empty": `License Image Link Required`,
  //   "any.required": `Required Field`,
  // }),
});

function CreateNFTLicenseCard({ closeModal, creatingNFTLicenseFunc }) {
  const [getDropDownStatus, setGetDropDownStatus] = useState("Active");

  const [statusError, setStatusError] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    // document.getElementById("readUrl").addEventListener("change", function () {
    //   if (this?.files[0]) {
    //     setImgSrc(this?.files[0]?.name);
    //     var picture = new FileReader();
    //     picture.readAsDataURL(this.files[0]);
    //     picture.addEventListener("load", function (event) {
    //       document
    //         .getElementById("uploadedImage")
    //         .setAttribute("srcset", event.target.result);
    //     });
    //   }
    // });
  }, [setImgSrc]);

  const getDropdownValue = (value) => {
    setGetDropDownStatus(value);
  };

  const onSubmit = (data) => {
    let myData = {
      name: data.Name,
      description: data.Description,
      price: data.Price,
      currency: data.Currency,
      lookup: data.LookUp,
      lookupinterval: data.LookUpInterval,
      image: data.Image
    };
    if (myData) {
      creatingNFTLicenseFunc(myData);
      reset({
        Name: "",
        Description: "",
        Price: "",
        Currency: "",
        LookUp: "",
        LookUpInterval: "",
        Image: "",
      });
    }
  };

  const closeModalFunction = () => {
    closeModal();
    reset({
      Name: "",
      Description: "",
      Price: "",
      Currency: "",
      LookUp: "",
      LookUpInterval: "",
      Image: "",
    });
  };
  return (
    <div className={` nftLicenseCard`}>
      <div className="nftLicenseCardInner">
        <div className="formList">
          <div className="inputListContainer">
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Name"
                name="Name"
                autoComplete="off"
                {...register("Name")}
                error={formState.errors.Name && "true"}
              />
              {formState.errors.Name && <p>{formState.errors.Name.message}</p>}
            </div>
          </div>
          <div className={`inputListContainer`}>
            <h6>Price</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Price"
                name="Price"
                {...register("Price")}
                error={formState.errors.Price && "true"}
                placeholder="0"
                autoComplete="off"
              />
              {formState.errors.Price && (
                <p>{formState.errors.Price.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Currency</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Currency"
                name="Currency"
                autoComplete="off"
                {...register("Currency")}
                error={formState.errors.Currency && "true"}
              />
              {formState.errors.Currency && (
                <p>{formState.errors.Currency.message}</p>
              )}
            </div>
          </div>
          {/* <div className="imgboxContainer">
            <div className="chooseLicenseImgContainer">
              <h6>License Image</h6>
              <div className="choosefileContainer">
                <input
                  className={`custom-file-uploadInput SimpleButton btnHoverEffectOutline`}
                  type="file"
                  id="readUrl"
                  autoComplete="off"
                />
              </div>
            </div>
            {imgSrc && (
              <div className="licenseimgBox">
                <Image
                  src={"/images/avatar.png"}
                  width={88}
                  height={88}
                  alt="Uploaded Image"
                  id="uploadedImage"
                />
              </div>
            )}
          </div> */}
          <div className="inputListContainer">
            <h6>Image Link</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Image"
                name="Image"
                autoComplete="off"
                {...register("Image")}
                error={formState.errors.Image && "true"}
              />
              {formState.errors.Image && (
                <p>{formState.errors.Image.message}</p>
              )}
            </div>
          </div>
          {/* <div className="inputListContainer">
            <h6>index</h6>
            <div className="formInputs">
              <input
                type="text"
                id="index"
                name="index"
                {...register("index")}
                error={formState.errors.index && true}
              />
              {formState.errors.index && (
                <p>{formState.errors.index.message}</p>
              )}
            </div>
          </div>   */}
          <div className="inputListContainer">
            <h6>Description</h6>
            <div className="formInputs">
              <textarea
                name="Description"
                id="Description"
                {...register("Description")}
                error={formState.errors.Description && "true"}
                rows="4"
                cols="50"
              ></textarea>
              {formState.errors.Description && (
                <p>{formState.errors.Description.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Lookup</h6>
            <div className="formInputs">
              <input
                type="text"
                id="LookUp"
                name="LookUp"
                autoComplete="off"
                {...register("LookUp")}
                error={formState.errors.LookUp && "true"}
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
                error={formState.errors.LookUpInterval && "true"}
              />
              {formState.errors.LookUpInterval && (
                <p>{formState.errors.LookUpInterval.message}</p>
              )}
            </div>
          </div>
          {/* <div className="inputListContainer">
            <h6>Level 1</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level1"
                name="level1"
                {...register("level1")}
                error={formState.errors.level1 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level1 && (
                <p>{formState.errors.level1.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 2</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level2"
                name="level2"
                {...register("level2")}
                error={formState.errors.level2 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level2 && (
                <p>{formState.errors.level2.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 3</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level3"
                name="level3"
                {...register("level3")}
                error={formState.errors.level3 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level3 && (
                <p>{formState.errors.level3.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 4</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level4"
                name="level4"
                {...register("level4")}
                error={formState.errors.level4 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level4 && (
                <p>{formState.errors.level4.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 5</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level5"
                name="level5"
                {...register("level5")}
                error={formState.errors.level5 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level5 && (
                <p>{formState.errors.level5.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 6</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level6"
                name="level6"
                {...register("level6")}
                error={formState.errors.level6 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level6 && (
                <p>{formState.errors.level6.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Level 7</h6>
            <div className="formInputs levelsinput">
              <input
                type="text"
                id="level7"
                name="level7"
                {...register("level7")}
                error={formState.errors.level7 && true}
              />
              <i>{percentIcon}</i>
              {formState.errors.level7 && (
                <p>{formState.errors.level7.message}</p>
              )}
            </div>
          </div> */}
          {/* <div className={`inputListContainer Active`}
          >
           <h6>Status</h6>
           <div className="formInputDropDown">
           <Dropdown data={nftLicenseStatusdata} getDropdownValue={getDropdownValue} placeholder="Active"  />
            {statusError && (
                <p>{"kindly select the status"}</p>
              )}
             </div>
          </div> */}
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
    </div>
  );
}

export default CreateNFTLicenseCard;
