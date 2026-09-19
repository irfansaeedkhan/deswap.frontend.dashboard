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
import DropDownCollection from "@/components/global/DropDownCollection";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  listCollectionBySymbol,
  listAllCollections,
} from "../../subgraph/query";

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
  Price: Joi.number().required().max(999999999999).label("Price").messages({
    "string.empty": `Price Required`,
    "any.required": `Required Field`,
  }),
  ExternalLink: Joi.string().required().max(50).label("ExternalLink").messages({
    "string.empty": `External Link Required`,
    "any.required": `Required Field`,
  }),
  Supply: Joi.number().required().max(50).label("Supply").messages({
    "string.empty": `Supply Required`,
    "any.required": `Required Field`,
  }),
  Purchased: Joi.string().optional().max(300).label("Purchased").messages({}),
  SpecificBuyer: Joi.string()
    .optional()
    .max(300)
    .label("SpecificBuyer")
    .messages({}),
});

const CreateNFTForm = ({
  createNFTData,
  ImageUpload,
  uploadImage,
  changeServiceFee,
  closeConnectButtonClick,
  serviceFee,
}) => {
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const [marketplace, setMarketplace] = useState("fix");
  const [unlock, setUnlock] = useState(true);
  const [reserve, setReserve] = useState(true);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);
  const [dropDownValue, setDropDownValue] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    //loadNFTs();
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listAllCollections),
        variables: {
          first: 100,
          skip: 0,
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
      setCollection(data.createCollections);
    } catch (error) {
      console.log("testing ", error);
    }
  };
  const getDropdownValue = (value) => {
    setDropDownValue(value);
  };
  // const deswapstackStatusdata = [
  //   { id: 0, label: "Robbie Trevino on Twitter" },
  //   { id: 1, label: "Robbie Trevino on FB" },
  // ];

  const onSubmit = async (data) => {
    data = { ...data, collection: dropDownValue };
    setStatusError(false);
    createNFTData(data);
  };

  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };

  return (
    <div className="marketMain">
      <MarketNavbar />
      <div className="createNFTContainer">
        <div className="createNFTInner">
          <h2>Create New Item</h2>
          <div className="uploadContainer">
            <h6>Upload file</h6>
            <div className="uploadBox">
              <input
                type="file"
                id="file"
                accept={"image"}
                onChange={(e) => {
                  ImageUpload(e);
                }}
              />
              {uploadImage ? (
                <div className="uploadiconpic">
                  <Image
                    width={380}
                    height={300}
                    src={uploadImage}
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
            <p>
              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
              OGG, GLB, GLTF. Max size: 100 MB
            </p>
          </div>

          <div className="blockchainContainer">
            <h6>Blockchain</h6>
            <div className="blockchainbox">
              <div className="maticicon">
                <Image
                  width={14}
                  height={14}
                  src={"/images/maticicon.png"}
                  alt={"matic icon"}
                  loading="lazy"
                />
              </div>
              <h6>Polygon</h6>
            </div>
          </div>

          <h6>Put to marketplace</h6>
          <div className="putmarketplace">
            <div
              className={`marketBox ${marketplace == "fix" && "active"}`}
              onClick={() => {
                setMarketplace("fix");
              }}
            >
              <div className="iconbox">
                <Image
                  width={24}
                  height={24}
                  src="/images/Fix.png"
                  alt={"icon"}
                  loading="lazy"
                />
              </div>
              <h3>Fix Price</h3>
            </div>
            <div
              className={`marketBox ${marketplace == "timed" && "active"}`}
              onClick={() => {
                setMarketplace("timed");
              }}
            >
              <div className="iconbox">
                <Image
                  width={24}
                  height={24}
                  src="/images/hourglass.png"
                  alt={"icon"}
                  loading="lazy"
                />
              </div>
              <h3>Timed Auction</h3>
            </div>
          </div>

          <div className="createnftForm">
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
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="External link"
                  id="ExternalLink"
                  name="ExternalLink"
                  autoComplete="off"
                  {...register("ExternalLink")}
                  error={formState.errors.ExternalLink && "true"}
                />
                {formState.errors.ExternalLink && (
                  <p>{formState.errors.ExternalLink.message}</p>
                )}
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Description"
                  id="Description"
                  name="Description"
                  autoComplete="off"
                  {...register("Description")}
                  error={formState.errors.Description && "true"}
                />
                {formState.errors.Description && (
                  <p>{formState.errors.Description.message}</p>
                )}
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

            {/* toggle boxes */}
            <div className="toggleBoxContainer unlock">
              <div className="Head">
                <div className="lefthead">
                  <UnlockIcon />
                  <div className="detail">
                    <h3>Unlock once purchased</h3>
                    <p>
                      Include unlockable content that can only be revealed by
                      the owner of the item.
                    </p>
                  </div>
                </div>
                <div className="toggleinput">
                  <div className="toggle-button-cover">
                    <div className="button-cover">
                      <div className="button r" id="button-3">
                        <input
                          defaultChecked
                          type="checkbox"
                          className="checkbox"
                          onClick={() => {
                            setUnlock((prev) => !prev);
                          }}
                        />
                        <div className="knobs"></div>
                        <div className="layer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {unlock && (
                <div className="contentContainer">
                  <textarea
                    cols="20"
                    rows="6"
                    placeholder="Degital Key, code to redeem file or link"
                    id="Purchased"
                    name="Purchased"
                    autoComplete="off"
                    {...register("Purchased")}
                  ></textarea>
                </div>
              )}
            </div>
            <div className="toggleBoxContainer reserve">
              <div className="Head">
                <div className="lefthead">
                  <ClipCheckIcon />
                  <div className="detail">
                    <h3>Reserve for specific buyer</h3>
                    <p>
                      This item can be purchsed as soon as it&apos;s listed.
                    </p>
                  </div>
                </div>
                <div className="toggleinput">
                  <div className="toggle-button-cover">
                    <div className="button-cover">
                      <div className="button r" id="button-3">
                        <input
                          defaultChecked
                          type="checkbox"
                          className="checkbox"
                          onClick={() => {
                            setReserve((prev) => !prev);
                          }}
                        />
                        <div className="knobs"></div>
                        <div className="layer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {reserve && (
                <div className="contentContainer">
                  <div className="copyData">
                    <input
                      type="text"
                      id="SpecificBuyer"
                      {...register("SpecificBuyer")}
                    />
                    <button className="copyBtn" onClick={copy}>
                      <div className="copyImgIcon">
                        <CopyIcon />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="inputFormContainer priceContainer">
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Price"
                  id="Price"
                  name="Price"
                  autoComplete="off"
                  {...register("Price")}
                  error={formState.errors.Price && "true"}
                  onChange={(e) => {
                    changeServiceFee(e.target.value);
                  }}
                />
                {formState.errors.Price && (
                  <p>{formState.errors.Price.message}</p>
                )}
              </div>
            </div>
            <div className="feeBox">
              <div className="fee">
                <p>
                  Service fee <span>{serviceFee}</span>
                </p>
              </div>
              <div className="fee">
                <p>
                  You will receive <span>--</span>
                </p>
              </div>
            </div>
            <div className="keepcollectionbox">
              <h3>Keep in collection</h3>
              <div className="formInputDropDown">
                <DropDownCollection
                  data={collection}
                  getDropdownValue={getDropdownValue}
                  placeholder={"choose collection"}
                />
                {statusError && <p>{"kindly select the status"}</p>}
              </div>
            </div>

            <div className="FooterbtnContainer">
              <SimpleButton
                text={"Create Item"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                //onClick = {listNFTForSale}
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

export default CreateNFTForm;
