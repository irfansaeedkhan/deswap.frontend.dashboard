import React from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import SimpleButton from "@/components/reusables/SimpleButton";


// form validations
const schema = Joi.object({
    name: Joi.string().required().label("name").messages({
        "string.empty": `Name Required`,
        "any.required": `Required Field`,
      }),
      symbol: Joi.string().required().label("symbol").messages({
        "string.empty": `Symbol Required`,
        "any.required": `Required Field`,
      }),
      tokens: Joi.string().required().label("tokens").messages({
        "string.empty": `Token Quantity Required`,
        "any.required": `Required Field`,
      }),
      decimals: Joi.number().required().label("decimals").messages({
        "string.empty": `Decimals Required`,
        "any.required": `Required Field`,
      }),
      address: Joi.string().required().label("address").messages({
        "string.empty": `Address Required`,
        "any.required": `Required Field`,
      })
});

function CreateTokenCard({ closeModal, onSubmit }) {
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  return (
    <div className={` tokenCard`}>
      <div className="tokenCardInner">
        <div className="formList">
          <div className="inputListContainer">
            <h6>Name</h6>
            <div className="formInputs">
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                {...register("name")}
                error={formState.errors.name && true}
                placeholder="--"
              />
              {formState.errors.name && (
                <p>{formState.errors.name.message}</p>
              )}
            </div>
          </div>

          <div className={`inputListContainer`}>
            <h6>Symbol</h6>
            <div className="formInputs">
              <input
                type="text"
                id="symbol"
                name="symbol"
                autoComplete="off"
                {...register("symbol")}
                error={formState.errors.symbol && true}
                placeholder="--"
              />
              {formState.errors.symbol && (
                <p>{formState.errors.symbol.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Supply (Tokens Quantity)</h6>
            <div className="formInputs">
              <input
                type="text"
                id="tokens"
                name="tokens"
                autoComplete="off"
                {...register("tokens")}
                error={formState.errors.tokens && true}
                placeholder="DESWAP"
              />
              {formState.errors.tokens && (
                <p>{formState.errors.tokens.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Decimals</h6>
            <div className="formInputs">
              <input
                type="text"
                id="decimals"
                name="decimals"
                autoComplete="off"
                {...register("decimals")}
                error={formState.errors.decimals && true}
                placeholder="0"
              />
              {formState.errors.decimals && (
                <p>{formState.errors.decimals.message}</p>
              )}
            </div>
          </div>
          <div className="inputListContainer">
            <h6>Send To Address</h6>
            <div className="formInputs">
              <input
                type="text"
                id="address"
                name="address"
                autoComplete="off"
                {...register("address")}
                error={formState.errors.address && true}
                placeholder="--"
              />
              {formState.errors.address && (
                <p>{formState.errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="footerCard">
          <div className="topButtons">
          <SimpleButton
            text={"Use BSC Mainnet"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={closeModal}
          />
          <SimpleButton
            text={"Use BSC Testnet"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={closeModal}
          />
          </div>
          <SimpleButton
            text={"Connect Wallet"}
            backgroundColor={"rgba(228, 71, 87, 0.12)"}
            color={"#E44757"}
            onClick={closeModal}
            className="connectWalletBtn"
          />
          {/* <SimpleButton
            text={"Create"}
            backgroundColor={!formState.isValid ? "#333333" : "#E44757"}
            color={!formState.isValid ? "#474747" : "#FFFFFF"}
            disabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default CreateTokenCard;
