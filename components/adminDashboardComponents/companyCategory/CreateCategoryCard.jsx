import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import axios from "@/utils/common/axios";
const percentIcon = <FontAwesomeIcon icon={faPercent} />;


// form validations
const schema = Joi.object({
    name: Joi.string().required().max(150).label("Name").messages({
        "string.empty": `Name Required`,
        "any.required": `Required Field`,
    }),
    Description: Joi.string().required().max(150).label("Description").messages({
        "string.empty": `Description Required`,
        "any.required": `Required Field`,
    })
});

function CreateCategoryCard({ closeModal, creatingAddCategoryFunc }) {
    const [levelValue,setLevelValue]=useState(0)
    const { handleSubmit, register, setError, formState, reset } = useForm({
        mode: "onChange",
        resolver: joiResolver(schema),
    });

    const onSubmit = (data) => {
        let myData = {
            name: data.name,
            description: data.Description,
        };
        if (myData) {
            creatingAddCategoryFunc(myData);
            reset({
                Description: "",
                name: ""
            });
        }
    };

    const closeModalFunction = () => {
        closeModal();
        reset({
            Description: "",
            name: ""
        });
    };
    return (
        <div className={` nftLicenseCard`}>
            <div className="nftLicenseCardInner">
                <div className="formList">
                    <div className={`inputListContainer`}>
                        <h6>Name</h6>
                        <div className="formInputs">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                {...register("name")}
                                error={formState.errors.name && "true"}
                                placeholder="0"
                                autoComplete="off"
                            />
                            {formState.errors.name && (
                                <p>{formState.errors.name.message}</p>
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
                                error={formState.errors.Description && "true"}
                                rows="4"
                                cols="50"
                            ></textarea>
                            {formState.errors.Description && (
                                <p>{formState.errors.Description.message}</p>
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
        </div>
    );
}

export default CreateCategoryCard;
