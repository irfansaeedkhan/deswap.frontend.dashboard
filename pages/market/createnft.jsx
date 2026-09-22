import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  UnlockIcon,
  ClipCheckIcon,
} from "@/components/marketPlace/MarketIcons";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
import { checkUserAuth } from "@/utils/auth/userauth";
import Joi, { func } from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { create as ipfsCreate } from "ipfs-http-client";
import MarketPlaceABI from "../../abi/nft-marketplace.json";
import { useRouter } from "next/router";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Loader from "@/components/reusables/loader/Loader";
import CollectionABI from "../../abi/collection.json";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import CreateNFT from "@/components/marketPlace/CreateNFTForm";
import BootstrapBodyModal from "@/components/reusables/BootstrapBodyModal";


var metaMaskValues = null;

function createnft() {
  const [uploadImage, setUploadImage] = useState();
  const [filePath, setFilePath] = useState(null);
  const [serviceFee, setServiceFee] = useState("--");
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);

  const router = useRouter();

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

  const createNFTData = (data) => {
    try {
      console.log("data", data);
      if (!metaMaskValues.metamaskconnected) {
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

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(filePath);
      reader.onloadend = async () => {
        const fileBuffer = Buffer(reader.result);
        const fileAdded = await ipfs.add(fileBuffer);
        const hash = fileAdded.path;
        const imageHashURL = process.env.NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash;

        const metadata111 = {
          name: data.Name,
          description: data.Description,
          ExternalLink: data.ExternalLink,
          //Supply: data.Supply,
          image: imageHashURL,
          //collection: "0x6c010f16308E5b19F4bf44A19d26e41385C832FE",
        };

        const jsonFileAdded = await ipfs.add(JSON.stringify(metadata111));
        hash = jsonFileAdded.path;
        const hashURL = process.env.NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash;
        console.log("hash value(metadata of image): ", hashURL);

        setFilePath(hashURL);
        const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

        //creating the connection with smart contract
        const contract = new metaMaskValues.metaconn.web3.eth.Contract(
          MarketPlaceABI,
          `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`
        );
        let price = metaMaskValues.metaconn.web3.utils.toWei(
          `${data.Price}`,
          "ether"
        );
        console.log("price is: ", price);
        // const test = await contract.methods.setColfalse(data.collection).send({ from: accounts[0] });
        // console.log("test",test)
        let transaction = await contract.methods
          .createItemsInSideCollection(data.collection,hashURL, data.Supply, price)
          .send({ from: accounts[0] });
        console.log("transaction issss: ", transaction);

        let data1 = {
          Purchased: data.Purchased,
          SpecificBuyer: data.SpecificBuyer,
        };

        data1 = await encryptRequestBody(data1);

        let result = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/createnft/insert`,
          { data: data1 },
          {
            withCredentials: true,
            headers: {
              "security-set": false,
            },
          }
        );
        console.log("transaction.events.CreateItem.returnValues", transaction.events.CreateItem[0].returnValues)
        let encryptionData = await encryptRequestBody({
          nftID: transaction.events.CreateItem[0].returnValues._collection,
        });
        await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/createnft/notification`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        router.push("/market"); //push to the marketpladce page
      };
    } catch (e) {
      console.log("There is some error while uploading the file:", e);
    }

    //list nft on the marketplace
    async function listNFTForSale() {
      const url = await ImageUpload();
      console.log("image load..", url);
      const metadataURL = await uploadMetadataToIPFS();
      //i think we should use this funtion to list nft for sale..

      if (!metaMaskValues.metamaskconnected) {
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
      const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

      console.log("metaMaskValues: ", metaMaskValues);

      const contract = new metaMaskValues.metaconn.web3.eth.Contract(
        MarketPlaceABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: accounts[0],
        }
      );
      let price = metaMaskValues.metaconn.web3.utils.toWei(
        `${data.Price}`,
        "ether"
      );

      //const hashData=await contract.methods.createToken(hashURL, price);

      //function from contract
      let listingPrice = await contract.methods.serviceFeePercentage();
      listingPrice = listingPrice.toString();
      console.log("listingPrice is: ", listingPrice);
      let transaction = await contract.methods.createToken(hashURL, price);

      console.log("The hash value", hashURL);

      //await transaction.wait()
      console.log("transaction..", transaction);
      router.push("/market");

      /* create the NFT */
      //  const contract = new metaMaskValues.metaconn.web3.eth.Contract(MarketPlaceABI, `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`, {
      //    from: accounts[0]
      //  });

      // let price = metaMaskValues.metaconn.web3.utils.toWei(`${data.Price}`, 'ether');
    }
  };

  const ImageUpload = (event) => {
    const file = event.target.files[0];
    setFilePath(file);
    const previewUrl = URL.createObjectURL(event.target.files[0]);
    console.log("previewUrl", previewUrl);
    setUploadImage(previewUrl);
  };
  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };

  const changeServiceFee = async (price) => {
    console.log("metaMaskValues: ", metaMaskValues);

    if (!metaMaskValues.metamaskconnected) {
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

    const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();
    const contract = new metaMaskValues.metaconn.web3.eth.Contract(
      MarketPlaceABI,
      `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
      {
        from: accounts[0],
      }
    );
    let listingPrice = await contract.methods.serviceFeePercentage().call();
    listingPrice = listingPrice.toString();
    setServiceFee(listingPrice + " %");
  };

  return (
    <div>
      <CreateNFT
        createNFTData={createNFTData}
        ImageUpload={ImageUpload}
        uploadImage={uploadImage}
        changeServiceFee={changeServiceFee}
        serviceFee={serviceFee}
      ></CreateNFT>
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
  metaMaskValues = state.metamaskConn;
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

export default connect(mapStateToProps, mapDispatchToProps)(createnft);
