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
    Name: Joi.string().required().max(150).label("Name").messages({
    "string.empty": `Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(150).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
});

function CategoryCard({ cardInfo , handleDelete , handleUpdate }) {
  const [statusError, setStatusError] = useState(false);
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });


  const onUpdate = (data) => {
    // data = { ...data, status: getStatus };
    data = {
        id : cardInfo?._id,
        name: data.Name,
        description:  data.Description,
    }
    if (data) {
        handleUpdate(data)
      }
  };

  const onDelete = (data) => {
    // data = { ...data, status: getStatus };
    data = {
      id : cardInfo?._id,
    }
    if (data) {
        // data
        handleDelete(data)
      }
  };
  return (
    <div
      className={`nftLicenseCard ${
        cardInfo.Status == "Active" ? "ActiveCard" : "DeactivateCard"
      }`}
    >
      <div className="nftLicenseCardInner">
        <div className="formList">
          <div
            className={`inputListContainer`}
          >
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="Name"
                name="Name"
                autoComplete="off"
                {...register("Name")}
                error={formState.errors.Name && true}
                placeholder="0"
                defaultValue={cardInfo?.Name ? cardInfo.Name : "N/A"}
                disabled={
                  cardInfo.Status == "Deactive" 
                }
              />
              {formState.errors.Name && (
                <p>{formState.errors.Name.message}</p>
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
                disabled={cardInfo.Status == "Deactive"}
              ></textarea>
              {formState.errors.Description && (
                <p>{formState.errors.Description.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="footerCards" style={{width: '100%',gap: '5px',display:'flex', justifyContent:'space-between'}}>
          <SimpleButton
            text={"Update"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={handleSubmit(onUpdate)}
          />
          <SimpleButton
            text={"Delete"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={handleSubmit(onDelete)}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
