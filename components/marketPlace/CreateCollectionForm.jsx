// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
  UnlockIcon,
  ClipCheckIcon,
} from "@/components/marketPlace/MarketIcons";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
import Image from "next/image";

// form validations
const schema = Joi.object({
  Name: Joi.string().required().max(150).label("Name").messages({
    "string.empty": `Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(350).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  URL: Joi.string().uri().required().max(50).label("URL").messages({
    "string.empty": `External Link Required`,
    "any.required": `Required Field`,
  }),
  Supply: Joi.number().required().label("Supply").messages({
    "string.empty": `Supply Required`,
    "any.required": `Required Field`,
  }),
  FBLink: Joi.string().uri().required().max(50).label("FBLink").messages({
    "string.empty": `FBLink Required`,
    "any.required": `Required Field`,
  }),
  TwitterLink: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("TwitterLink")
    .messages({
      "string.empty": `TwitterLink Required`,
      "any.required": `Required Field`,
    }),
  ExtraLink: Joi.string().uri().required().max(50).label("ExtraLink").messages({
    "string.empty": `ExtraLink Required`,
    "any.required": `Required Field`,
  }),
});

const CreateNFTCollectionForm = ({
  createCollectionData,
  ImageProfileUpload,
  ImageCoverUpload,
  uploadProfileImage,
  uploadCoverImage,
  closeConnectButtonClick,
}) => {
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);

  // const closeConnectButtonClick = async () => {
  //   try {
  //     await setShow(false);
  //     setModalBody(
  //       <div className="modalcontentWallet">
  //         <div className="iconBoxContainer">
  //           <div
  //             className="iconBox"
  //             onClick={async () => {
  //               await handleMetaConnect("metamask");
  //             }}
  //           >
  //             <Image
  //               src={"/images/metamask.png"}
  //               width={48}
  //               height={48}
  //               alt=" icon"
  //               className="icon activeImg"
  //             />
  //             <p>MetaMask</p>
  //           </div>
  //           <div
  //             className="iconBox disabledBox"
  //             onClick={async () => {
  //               await handleMetaConnect("coin98");
  //             }}
  //           >
  //             <Image
  //               src={"/images/coin98.png"}
  //               width={48}
  //               height={48}
  //               alt=" icon"
  //               className="icon"
  //             />
  //             <p>Coin 98</p>
  //           </div>
  //           <div
  //             className="iconBox disabledBox"
  //             onClick={async () => {
  //               await handleMetaConnect("walletconnect");
  //             }}
  //           >
  //             <Image
  //               src={"/images/walletconnect.png"}
  //               width={48}
  //               height={48}
  //               alt=" icon"
  //               className="icon"
  //             />
  //             <p>Wallet Connect</p>
  //           </div>
  //           <div
  //             className="iconBox disabledBox"
  //             onClick={async () => {
  //               await handleMetaConnect("trustwallet");
  //             }}
  //           >
  //             <Image
  //               src={"/images/trustwallet.png"}
  //               width={48}
  //               height={48}
  //               alt=" icon"
  //               className="icon"
  //             />
  //             <p>Trust Wallet</p>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } catch (e) {
  //     console.log("Failed to close modal");
  //   }
  // };

  const onSubmit = async (data) => {
    createCollectionData(data);
  };

  return (
    <div className="marketMain">
      <MarketNavbar />
      <div className="createNFTCollectionContainer">
        <div className="createNFTCollectionInner">
          <h2>Create a Collection</h2>
          {/* upload profile image */}
          <div className="uploadLogoImgContainer">
            <h6>Upload logo image</h6>
            <p>
              This image will also be used for navigation. 350 x 350
              recommended.
            </p>
            <div className="uploadBox">
              <input
                type="file"
                id="file"
                accept={"image"}
                onChange={(e) => {
                  ImageProfileUpload(e);
                }}
              />
              {uploadProfileImage ? (
                <div className="uploadiconpic">
                  <Image
                    width={140}
                    height={140}
                    src={uploadProfileImage}
                    alt={"profile pic"}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="uploadicon">
                  <Image
                    width={80}
                    height={80}
                    src="/images/uploadicon.png"
                    alt={"profile pic"}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
          {/* upload cover image */}
          <div className="uploadCoverContainer">
            <h6>Upload banner image</h6>
            <p>
              This image will appear at the top of your collection page. Avoid
              including too much text in this banner image, 1400 x 350
              recommended.
            </p>
            <div className="uploadBox">
              <input
                type="file"
                id="file"
                accept={"image"}
                onChange={(e) => {
                  ImageCoverUpload(e);
                }}
              />
              {uploadCoverImage ? (
                <div className="uploadiconpic">
                  <Image
                    width={380}
                    height={300}
                    src={uploadCoverImage}
                    alt={"icon"}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="uploadicon">
                  <Image
                    width={140}
                    height={140}
                    src="/images/uploadicon.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
          {/* collection detail form */}
          <div className="createNFTCollectionForm">
            <h6>Collection details</h6>
            <div className="inputFormContainer">
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Name"
                  id="Name"
                  name="Name"
                  autoComplete="off"
                  {...register("Name")}
                  error={formState.errors.Name && "true"}
                />
                {formState.errors.Name && (
                  <p>{formState.errors.Name.message}</p>
                )}
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox" style={{ height: "auto" }}>
                <textarea
                  placeholder="Description"
                  id="Description"
                  name="Description"
                  autoComplete="off"
                  {...register("Description")}
                  error={formState.errors.Description && "true"}
                  cols="30"
                  rows="3"
                ></textarea>
                {formState.errors.Description && (
                  <p>{formState.errors.Description.message}</p>
                )}
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Url eg: https://deswap.io/collection/treasures-of-the-sea"
                  id="URL"
                  name="URL"
                  autoComplete="off"
                  {...register("URL")}
                  error={formState.errors.URL && "true"}
                />
                {formState.errors.URL && <p>{formState.errors.URL.message}</p>}
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Supply"
                  id="Supply"
                  name="Supply"
                  autoComplete="off"
                  {...register("Supply")}
                  error={formState.errors.Supply && "true"}
                />
                {formState.errors.Supply && (
                  <p>{formState.errors.Supply.message}</p>
                )}
              </div>
            </div>
            <h6>Add Links</h6>
            <div className="inputFormContainer inputWithIcon">
              <div className="inputBox">
                <div className="iconBox">
                  <Image
                    width={24}
                    height={24}
                    src="/images/iconfacebook.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </div>
                <input
                  type="text"
                  placeholder="https://"
                  id="FBLink"
                  name="FBLink"
                  autoComplete="off"
                  {...register("FBLink")}
                  error={formState.errors.Description && "true"}
                />
                {formState.errors.FBLink && (
                  <p>{formState.errors.FBLink.message}</p>
                )}
              </div>
            </div>
            <div className="inputFormContainer inputWithIcon">
              <div className="inputBox">
                <div className="iconBox">
                  {" "}
                  <Image
                    width={24}
                    height={24}
                    src="/images/icontwitter.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </div>
                <input
                  type="text"
                  placeholder="https://"
                  id="TwitterLink"
                  name="TwitterLink"
                  autoComplete="off"
                  {...register("TwitterLink")}
                  error={formState.errors.Description && "true"}
                />
                {formState.errors.TwitterLink && (
                  <p>{formState.errors.TwitterLink.message}</p>
                )}
              </div>
            </div>
            <div className="inputFormContainer inputWithIcon">
              <div className="inputBox">
                <div className="iconBox">
                  <Image
                    width={24}
                    height={24}
                    src="/images/iconworld.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </div>
                <input
                  type="text"
                  placeholder="https://"
                  id="ExtraLink"
                  name="ExtraLink"
                  autoComplete="off"
                  {...register("ExtraLink")}
                  error={formState.errors.Description && "true"}
                />
                {formState.errors.ExtraLink && (
                  <p>{formState.errors.ExtraLink.message}</p>
                )}
              </div>
            </div>

            <div className="FooterbtnContainer">
              <SimpleButton
                text={"Create Item"}
                backgroundColor={formState.isValid ? "#E44757" : "#333333"}
                color={formState.isValid ? "#FFFFFF" : "#474747"}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </div>
  );
};

export default CreateNFTCollectionForm;
