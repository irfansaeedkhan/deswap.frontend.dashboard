import React, { useState } from "react";
import { create as ipfsCreate } from "ipfs-http-client";
import MarketPlaceABI from "../../abi/nft-marketplace.json";
import CollectionABI from "../../abi/collection.json";
import NFTMarketPlaceABI from "../../abi/nft-marketplace.json";
import { useRouter } from "next/router";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { checkUserAuth } from "@/utils/auth/userauth";
import BootstrapBodyModal from "@/components/reusables/BootstrapBodyModal";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import axios from "axios"


import Image from "next/image";
import CreateNFTCollection from "@/components/marketPlace/CreateCollectionForm";

var metaMaskValues = null;

function createcollection({ metamaskConn }) {
  //
  const [marketplace, setMarketplace] = useState("fix");
  const [unlock, setUnlock] = useState(true);
  const [reserve, setReserve] = useState(true);
  const [uploadProfileImage, setUploadProfileImage] = useState();
  const [fileProfile, setfileProfilePath] = useState(null);
  const [uploadCoverImage, setUploadCoverImage] = useState();
  const [fileCoverProfile, setfileCoverPath] = useState(null);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);

  const router = useRouter();

  const ImageProfileUpload = (event) => {
    const file = event.target.files[0];
    setfileProfilePath(file);
    const previewUrl = URL.createObjectURL(event.target.files[0]);
    console.log("previewUrl", previewUrl);
    setUploadProfileImage(previewUrl);
  };
  const ImageCoverUpload = (event) => {
    const file = event.target.files[0];
    setfileCoverPath(file);
    const previewUrl = URL.createObjectURL(event.target.files[0]);
    console.log("previewUrl", previewUrl);
    setUploadCoverImage(previewUrl);
  };

  const closeConnectButtonClick = async () => {
    try {
      await setShow(false);
      setModalBody(
        <div className="modalcontentWallet">
          <div className="iconBoxContainer">
            <div
              className="iconBox"
              onClick={async () => {
                await handleMetaConnect("metamask");
              }}
            >
              <Image
                src={"/images/metamask.png"}
                width={48}
                height={48}
                alt=" icon"
                className="icon activeImg"
              />
              <p>MetaMask</p>
            </div>
            <div
              className="iconBox disabledBox"
              onClick={async () => {
                await handleMetaConnect("coin98");
              }}
            >
              <Image
                src={"/images/coin98.png"}
                width={48}
                height={48}
                alt=" icon"
                className="icon"
              />
              <p>Coin 98</p>
            </div>
            <div
              className="iconBox disabledBox"
              onClick={async () => {
                await handleMetaConnect("walletconnect");
              }}
            >
              <Image
                src={"/images/walletconnect.png"}
                width={48}
                height={48}
                alt=" icon"
                className="icon"
              />
              <p>Wallet Connect</p>
            </div>
            <div
              className="iconBox disabledBox"
              onClick={async () => {
                await handleMetaConnect("trustwallet");
              }}
            >
              <Image
                src={"/images/trustwallet.png"}
                width={48}
                height={48}
                alt=" icon"
                className="icon"
              />
              <p>Trust Wallet</p>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      console.log("Failed to close modal");
    }
  };

  const createCollectionData = (data) => {
    try {
      let collectionID;
      if (!metamaskConn.metamaskconnected) {
        //Metamask not connected show pop
        setShow(true);
        setModalBody(
          <BootstrapBodyModal
            imageSrc="/images/Connectwallet.png"
            heading="Wallet Not Connected"
            paragraph="Please Connect To Wallet Using Connect Button"
          ></BootstrapBodyModal>
        );
        setModalFooter(
          <div className="buydeswapbuttonCotainer">
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Ok
            </button>
          </div>
        );
        return;
      }

      //this if condittion is checking the connection with metamask
      const auth =
        "Basic " +
        Buffer.from(
          process.env.NEXT_PUBLIC_Project_ID +
            ":" +
            process.env.NEXT_PUBLIC_API_Secret
        ).toString("base64");

      console.log("the auth value: ", auth);
      console.log("metamask values: ", metaMaskValue);

      //we are creating the ipfs of image here
      const ipfs = ipfsCreate({
        host: process.env.NEXT_PUBLIC_IPFS_HOST,
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const profileReader = new window.FileReader();
      profileReader.readAsArrayBuffer(fileProfile);
      console.log("data", data);
      profileReader.onloadend = async () => {
        try {
          let profileFileBuffer = Buffer.from(profileReader.result);
          const profileAdded = await ipfs.add(profileFileBuffer);
          const profileHash = profileAdded.path;
          console.log("profileHash", profileHash);
          const coverReader = new window.FileReader();
          coverReader.readAsArrayBuffer(fileCoverProfile);
          coverReader.onloadend = async () => {
            try {
              let fileBuffer = Buffer.from(coverReader.result);

              const coverfileAdded = await ipfs.add(fileBuffer);
              const accounts =
                await metamaskConn.metaconn.web3.eth.getAccounts();
              const contract = new metamaskConn.metaconn.web3.eth.Contract(
                NFTMarketPlaceABI,
                `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
                {
                  from: accounts[0],
                }
              );
              // const fetchCollection = await contract.methods
              //   .getCollectionInfo("0x6c010f16308E5b19F4bf44A19d26e41385C832FE")
              //   .call();

              // console.log("fetchCollection", fetchCollection);
              const coverHash = coverfileAdded.path;
              const metadata = {
                name: data.Name,
                description: data.Description,
                URL: data.URL,
                FBLink: data.FBLink,
                image: "ipfs://" + profileHash,
                coverImage: "ipfs://" + coverHash,
                TwitterLink: data.TwitterLink,
                ExtraLink: data.ExtraLink,
              };
              const jsonFileAdded = await ipfs.add(JSON.stringify(metadata));
              const jsonHash = jsonFileAdded.path;

              let shortName = "";
              for (let i = 0; i < data.Name.split(" ").length; i++) {
                shortName = shortName + data.Name.split(" ")[i].charAt();
              }

              await contract.methods
                .createCollection(data.Name, shortName, "ipfs://" + jsonHash, data.Supply)
                .send({
                  gasLimit: await metamaskConn.metaconn.web3.utils.toHex(
                    2100000
                  ),
                })
                .on("transactionHash", function (hash) {
                  console.log("Transaction hash : ", hash);
                })
                .on("receipt", function (receipt) {
                  console.log("Receipt : ", receipt);
                  if (!receipt.events) {
                    return;
                  }
                  collectionID = receipt.events.CreateCollection.returnValues._collection;
                })
                .on("error", function (error, receipt) {
                  console.log("Error : ", error, "\n");
                  console.log(receipt);
                });
                //api
                let encryptionData = await encryptRequestBody({
                  collectionID: collectionID,
                });
                let result = await axios.post(
                  `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/collection/notification`,
                  { data: encryptionData },
                  {
                    withCredentials: true,
                    headers: {
                      "security-set": true,
                    },
                  }
                );
            } catch (error) {
              console.error(error);
            }
          };
        } catch (error) {
          console.error(error);
        }
      };
    } catch (e) {
      console.log("There is some error while uploading the file:", e);
    }

    //list nft on the marketplace
    async function listNFTForSale() {
      const url = await ImageProfileUpload();
      console.log("image load..", url);
      const metadataURL = await uploadMetadataToIPFS();
      //i think we should use this funtion to list nft for sale..

      if (!metamaskConn.metamaskconnected) {
        //Metamask not connected show pop
        setShow(true);
        setModalBody(
          <div className="modalcontentSuccess buydeswap modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Connectwallet.png"
                  alt={"deswap image"}
                  crossOrigin=""
                />
              </div>
            </div>

            <div className="contentbox">
              <h5>Wallet Not Connected</h5>
              <p>Please Connect To Wallet Using Connect Button</p>
            </div>
          </div>
        );
        setModalFooter(
          <div className="buydeswapbuttonCotainer">
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Ok
            </button>
          </div>
        );
        return;
      }
      const accounts = await metamaskConn.metaconn.web3.eth.getAccounts();

      console.log("metaMaskValues: ", metaMaskValues);

      const contract = new metamaskConn.metaconn.web3.eth.Contract(
        MarketPlaceABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: accounts[0],
        }
      );
      let price = metamaskConn.metaconn.web3.utils.toWei(
        `${data.Price}`,
        "ether"
      );

      //const hashData=await contract.methods.createToken(hashURL, price);

      //function from contract
      let listingPrice = await contract.methods.getServiceFee();
      listingPrice = listingPrice.toString();
      console.log("listingPrice is: ", listingPrice);
      let transaction = await contract.methods.createToken(hashURL, price);

      console.log("The hash value", hashURL);

      //await transaction.wait()
      console.log("transaction..", transaction);
      router.push("/market");
    }
  };
  return (
    <div>
      <CreateNFTCollection
        createCollectionData={createCollectionData}
        ImageProfileUpload={ImageProfileUpload}
        ImageCoverUpload={ImageCoverUpload}
        uploadProfileImage={uploadProfileImage}
        uploadCoverImage={uploadCoverImage}
        closeConnectButtonClick={closeConnectButtonClick}
      ></CreateNFTCollection>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </div>
  );
}
const mapStateToProps = (state) => {
  //metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkUserAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(createcollection);
