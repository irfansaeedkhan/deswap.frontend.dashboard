import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
const percentIcon = <FontAwesomeIcon icon={faPercent} />;


// form validations
const schema = Joi.object({
  Percentage: Joi.number().required().max(150).label("Percentage").messages({
    "string.empty": `Percentage Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(150).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
});

function LevelCard({ cardInfo , handleDelete , handleUpdate }) {
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
      _id : cardInfo?._id,
      Description:  data.Description,
      Percentage: data.Percentage,
    }
    if (getStatus) {
      setStatusError(false);
      if (data) {
        // data
        handleUpdate(data)
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
            <h6>Level</h6>
            <div className="formInputs">
              <input
                type="text"
                autoComplete="off"
                defaultValue={cardInfo?.Level ? cardInfo.Level : "N/A"}
                disabled={true}
              />
              {formState.errors.Level && (
                <p>{formState.errors.Level.message}</p>
              )}
            </div>
          </div>
          <div
            className={`inputListContainer`}
          >
            <h6>Percentage</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Percentage"
                name="Percentage"
                autoComplete="off"
                {...register("Percentage")}
                error={formState.errors.Percentage && true}
                placeholder="0"
                defaultValue={cardInfo?.Percentage ? cardInfo.Percentage : "N/A"}
                disabled={
                  cardInfo.status == "Deactive" 
                }
              />
              {formState.errors.Percentage && (
                <p>{formState.errors.Percentage.message}</p>
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
        </div>

        <div className="footerCards">
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

export default LevelCard;
