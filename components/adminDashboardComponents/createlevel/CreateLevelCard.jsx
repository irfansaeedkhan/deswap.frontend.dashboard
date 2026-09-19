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
    Description: Joi.string().required().max(150).label("Description").messages({
        "string.empty": `Description Required`,
        "any.required": `Required Field`,
    }),
    Percentage: Joi.number().required().max(150).label("Percentage").messages({
        "string.empty": `Percentage Required`,
        "any.required": `Required Field`,
    }),
});

function CreateLevelCard({ closeModal, creatingAddLevelFunc }) {
    const [levelValue,setLevelValue]=useState(0)
    const { handleSubmit, register, setError, formState, reset } = useForm({
        mode: "onChange",
        resolver: joiResolver(schema),
    });

    useEffect(() => {
        fetchTotalData()
    }, []);

    const fetchTotalData = async() => {
        try {
            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/rewardlevel/totaldata`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "security-set": false,
                    },
                }
            );
            setLevelValue(result.data.data+1)

        } catch (e) {
            console.log(e)
        }
    }


    const onSubmit = (data) => {
        let myData = {
            Level: levelValue,
            Description: data.Description,
            Percentage: data.Percentage
        };
        if (myData) {
            creatingAddLevelFunc(myData);
            reset({
                Level: "",
                Description: "",
                Percentage: ""
            });
        }
    };

    const closeModalFunction = () => {
        closeModal();
        reset({
            Description: "",
            Percentage: ""
        });
    };
    return (
        <div className={` nftLicenseCard`}>
            <div className="nftLicenseCardInner">
                <div className="formList">
                    <div className="inputListContainer">
                        <h6>Level</h6>
                        <p style={{display:"none"}}>{levelValue}</p>
                        <div className="formInputs">
                            <input
                                type="text"
                                id="Level"
                                name="Level"
                                value={levelValue}
                                error={ "true"}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className={`inputListContainer`}>
                        <h6>Percentage</h6>
                        <div className="formInputs">
                            <input
                                type="text"
                                id="Percentage"
                                name="Percentage"
                                {...register("Percentage")}
                                error={formState.errors.Percentage && "true"}
                                placeholder="0"
                                autoComplete="off"
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

export default CreateLevelCard;
