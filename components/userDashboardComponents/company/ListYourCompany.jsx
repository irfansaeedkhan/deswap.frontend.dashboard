import React, { useState, useEffect } from "react";
import axios from "../../../utils/common/axios";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Dropdown from "@/components/global/DropDown";
import SimpleButton from "@/components/reusables/SimpleButton";
import WalletConnectButton from "@/components/reusables/walletConnectButton";
import { create as ipfsCreate } from "ipfs-http-client";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import BootstrapModal from "../../reusables/BootstrapModal";
import Loader from "@/components/reusables/loader/Loader";

var bussinessCategoryData = [];

// form validations
const schema = Joi.object({
  name: Joi.string().required().max(150).label("name").messages({
    "string.empty": `Company Name Required`,
    "any.required": `Required Field`,
  }),
  username: Joi.string().required().max(150).label("username").messages({
    "string.empty": `Username Required`,
    "any.required": `Required Field`,
  }),
  owner: Joi.string().required().max(150).label("owner").messages({
    "string.empty": `Owner Required`,
    "any.required": `Required Field`,
  }),
  email: Joi.string()
    .label("email")
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .required()
    .messages({
      "string.empty": `Company Email Required`,
      "any.required": `Company Email Required`,
    }),
  address: Joi.string().required().max(350).label("address").messages({
    "string.empty": `Address Required`,
    "any.required": `Required Field`,
  }),
  // website: Joi.string().required().max(150).label("website").messages({
  //   "string.empty": `Website Required`,
  //   "any.required": `Required Field`,
  // }),
  youraddress: Joi.string()
    .allow("", null)
    .max(150)
    .label("youraddress")
    .messages({
      "string.empty": `Personal Address Required`,
      "any.required": `Required Field`,
    }),
  youremail: Joi.string()
    .label("PersonalEmail")
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .allow("", null)
    .messages({
      "string.empty": `Personal Email Required`,
      "any.required": `Personal Email Required`,
    }),
  shareholders: Joi.number()
    .required()
    .max(150000000)
    .label("Shareholders")
    .messages({
      "string.empty": `Shareholders Required`,
      "any.required": `Required Field`,
    }),
  employees: Joi.number()
    .required()
    .max(150000000)
    .label("Employees")
    .messages({
      "string.empty": `Employees Required`,
      "any.required": `Required Field`,
    }),
  walletaddress: Joi.string()
    .allow("", null)
    .max(150)
    .label("Walletaddress")
    .messages({
      "string.empty": `Walletaddress Required`,
      "any.required": `Required Field`,
    }),
  business: Joi.string().required().max(150).label("Business").messages({
    "string.empty": `Business Required`,
    "any.required": `Required Field`,
  }),
  tagline: Joi.string().required().max(150).label("Tagline").messages({
    "string.empty": `Tagline Required`,
    "any.required": `Required Field`,
  }),
  verification: Joi.boolean().invalid(false).required().messages({
    "any.required": `Required Field`,
  }),
});
var metaMaskValues = null;
var connectToMetas = null;
function ListYourCompany() {
  const [linkList, setLinkList] = useState([{ link: "", isTrueVal: true }]);
  const [getCategoryStatus, setGetCategoryStatus] = useState(null);
  const [walletConnected, setWalletConnected] = useState(true);
  const [getCategoryStatusErr, setGetCategoryStatusErr] = useState(false);
  const [weblinksErr, setWeblinksErr] = useState(false);
  const [ipfsHash, setIpsfHash] = useState();
  const [logo, setLogo] = useState();
  const [publickey, setPublicKey] = useState();
  const [redrawDropDown, setReDrawDropDown] = useState(false);
  const [show, setShow] = useState(false);

  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [modalbody, setModalBody] = useState(
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
            alt="icon"
            className="icon activeImg"
            loading="lazy"
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
            loading="lazy"
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
            loading="lazy"
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
            loading="lazy"
          />
          <p>Trust Wallet</p>
        </div>
      </div>
    </div>
  );
  const [modalfooter, setModalFooter] = useState(null);

  const getDropdownValue = (value) => {
    setGetCategoryStatus(value);
  };
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const AddCompanyFunc = async (customData) => {
    // let customData = {
    //   name: "test35675",
    //   username: "test98989834534t3tergfdsf",
    //   owner: "test",
    //   email: "test",
    //   address: "test",
    //   website: "test",
    //   youraddress: "test",
    //   youremail: "test",
    //   shareholders: 1,
    //   employees: 1,
    //   walletaddress: "test",
    //   enterdby: "test",
    //   tagline: "test",
    //   catagoryid: "628dfa6a962f7ba6abe68e72",
    //   logo: "logo.png"
    // }
    customData.walletaddress = metaMaskValues.metamaskaccount;
    const sanData = await SanitizeRequestObject(customData);
    try {
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      if (result.status === 200) {
        reset({
          name: "",
          username: "",
          owner: "",
          email: "",
          address: "",
          // website: [],
          youraddress: "",
          youremail: "",
          shareholders: null,
          employees: null,
          walletaddress: "",
          enterdby: "",
          tagline: "",
          verification: true,
        });

        toast.success("Company Successfully Added", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setShow(true);
        setModalHeader("Company");
        await setModalBody(
          <div className="modalcontentSuccess modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/success.png"
                  alt={"success image"}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="contentbox">
              <h5>Company added</h5>
            </div>
          </div>
        );
        setModalFooter(
          <div className="row purchaseBtnContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
      } else {
        toast.error("Failed to add company", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      console.log("e", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //console.log("Username Already Exits or Something Wrong With The Server");
      setShow(true);
      setModalHeader("Company");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"Failed image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Failed to add company</h5>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="row purchaseBtnContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
  };

  const etherumTransaction = async (data) => {
    let params;
    data.amount = await metaMaskValues.metaconn.web3.utils.toWei(data.amount);
    let count = await metaMaskValues.metaconn.web3.eth.getTransactionCount(
      data.sender
    );

    let gaslimit = await metaMaskValues.metaconn.web3.eth.estimateGas({
      from: data.sender,
      to: data.receiver,
      value: "0x" + Number(data.amount).toString(16),
      data: "0x",
    });

    let gasPrice = await metaMaskValues.metaconn.web3.eth.getGasPrice();
    let transactionHash;
    if (data.contractAddress) {
      transactionHash = await sendContractTransaction(
        metaMaskValues.web3contract,
        {
          sender: data.sender,
          amount: data.amount,
          receiver: data.receiver,
          //gas:"0x76c0",
          gasPrice: gasPrice,
          //count:"0x" + count.toString(16)
        }
      );
    } else {
      params = {
        from: data.sender,
        to: data.receiver,
        //"nonce":  "0x" + count.toString(16),
        //"gas": "0x76c0",
        gasLimit: gaslimit,
        value: "0x" + Number(data.amount).toString(16),
        gasPrice: gasPrice,
        data: "0x",
      };
      console.log();
      transactionHash = await sendMetaMaskTransaction(
        metaMaskValues.metaconn.web3,
        params
      );
    }
    return transactionHash;
  };

  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };
  const handleLinkChange = (e, index) => {
    const { name, value } = e.target;
    const isTrueVal = !value || urlPatternValidation(value);
    const list = [...linkList];
    list[index]["website"] = value;
    list[index]["isTrueVal"] = isTrueVal;
    setLinkList(list);
  };
  const handleAddList = () => {
    setLinkList([...linkList, { link: "", isTrueVal: true }]);
  };
  const handleRemoveList = (index) => {
    const list = [...linkList];
    list.splice(index, 1);
    setLinkList(list);
  };

  const captureFile = async (event) => {
    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(event.target.files[0]);
    setLogo(previewUrl);
    if (!file) {
      return;
    }
    let fileType = file.type;
    let file_format = "";
    if (
      fileType != "image/png" &&
      fileType != "image/jpeg" &&
      fileType != "image/webp"
    ) {
      file_format = "image";
      return;
    }

    const auth =
      "Basic " +
      Buffer.from(
        process.env.NEXT_PUBLIC_Project_ID +
          ":" +
          process.env.NEXT_PUBLIC_API_Secret
      ).toString("base64");

    console.log("auth", auth);

    const ipfs = ipfsCreate({
      host: process.env.NEXT_PUBLIC_IPFS_HOST,
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const fileBuffer = Buffer(reader.result);
      const fileAdded = await ipfs.add(fileBuffer);
      const hash = fileAdded.path;
      setIpsfHash(process.env.NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash);
      document.getElementById("walletaddress").value =
        process.env.NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash;
    };
  };

  const convertUSDToMatic = async (amount) => {
    let encryptionData = await requestBodyEncryptionUnprotected({
      amount: amount,
    });
    let { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartomatic`,
      { data: encryptionData },
      {
        withCredentials: true,
        headers: {
          "security-set": true,
        },
      }
    );
    return data;
  };

  const onSubmit = async (data) => {
    try {
      const amount = process.env.NEXT_PUBLIC_Company_Transaction_Amount;
      //const amount = 1;
      const datas = await convertUSDToMatic(amount);
      let priceInMatic = datas.conversion;

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
                  alt={"Connectwallet image"}
                  crossOrigin=""
                  loading="lazy"
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

      //Setting showing loader before starting transaction
      setShow(true);
      setModalHeader("Transaction");
      <Loader loading={true} />;
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"failed image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>
              Please Do Not Close Windows/Refresh Page Until Transaction Is
              Complete
            </h5>
          </div>
        </div>
      );
      setModalFooter(
        <div className="row purchaseBtnContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );

      //Add condition to check metamask is connected or not
      let result = await etherumTransaction({
        sender: metaMaskValues.metamaskaccount,
        amount: priceInMatic.toString(),
        receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
        //contractAddress:`${process.env.NEXT_PUBLIC_ADMIN_USDC_CONTRACT_ADDRESS}`
      });

      if (result == null) {
        setShow(true);
        setModalHeader("Transaction");
        await setModalBody(
          <div className="modalcontentSuccess modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Failed.png"
                  alt={"failed image"}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="contentbox">
              <h5>Failed Transaction</h5>
            </div>
          </div>
        );
        setModalFooter(
          <div className="row purchaseBtnContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
        return;
      }

      if (result && result.transactionHash != undefined) {
        setShow(true);
        setModalHeader("Transaction");
        await setModalBody(
          <div className="modalcontentSuccess modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/success.png"
                  alt={"success image"}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="contentbox">
              <h5>Transaction Successful</h5>
            </div>
          </div>
        );
        setModalFooter(
          <div className="row purchaseBtnContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
      } else {
        setShow(true);
        setModalHeader("Transaction");
        await setModalBody(
          <div className="modalcontentSuccess modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Failed.png"
                  alt={"failed image"}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="contentbox">
              <h5>Failed Transaction</h5>
            </div>
          </div>
        );
        setModalFooter(
          <div className="row purchaseBtnContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
        return;
      }

      setModalFooter(
        <div className="row purchaseBtnContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );

      let weblinksArr = linkList.map((a) => a.website);
      if (weblinksArr) {
        setWeblinksErr(false);

        if (getCategoryStatus) {
          //console.log("get category status : ",getCategoryStatus)
          let date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          let customData = {
            ...data,
            catagoryName: getCategoryStatus,
            logo: "/imagelink.png",
            website: weblinksArr,
            renewalDate: date,
            expireDate: date,
            ipfSURL: ipfsHash,
            TxHash: result.transactionHash,
            Amount: amount,
            AmountInMatic: priceInMatic,
            ConversionRate: datas.ConversionRate,
          };
          setGetCategoryStatusErr(false);
          if (customData) {
            AddCompanyFunc(customData);
          }
        } else {
          setGetCategoryStatusErr(true);
        }
      } else {
        setWeblinksErr(true);
      }
    } catch (e) {
      //Transaction failed
      console.log("Failed to handle submit ", e);
      setShow(true);
      setModalHeader("Transaction");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"failed image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Failed Transaction</h5>
          </div>
        </div>
      );
      setModalFooter(
        <div className="row purchaseBtnContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
  };

  const fetchCompanyCategory = async () => {
    try {
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/company/catagory/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let data = result?.data?.data;
      data = await SanitizeRequestObject(data);
      bussinessCategoryData = [];
      for (let index in data) {
        //id: 0, label: "Jedi Knights"
        bussinessCategoryData.push({
          id: data[index]._id,
          label: data[index].Name,
        });
      }
      await getDropdownValue(bussinessCategoryData);
      await setGetCategoryStatus(bussinessCategoryData);
      //bussinessCategoryData
      await setReDrawDropDown(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    try {
      await fetchCompanyCategory();
    } catch (e) {
      console.log("Failed to fetch ", e);
    }
  }, []);

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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
  return (
    <div className="LYC">
      <h5>Fill The Form To Add Your Comany.</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="LYCForm">
          <div className="identity">
            <h4 className="formtitle">Company Identity</h4>
            {/* Form starts from here */}
            <div className="formInputs">
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                placeholder="Company Name"
                {...register("name")}
                error={formState.errors.name && true}
              />
              {formState.errors.name && <p>{formState.errors.name.message}</p>}
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                placeholder="Company Username"
                {...register("username")}
                error={formState.errors.username && true}
              />
              {formState.errors.username && (
                <p>{formState.errors.username.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="owner"
                name="owner"
                autoComplete="off"
                placeholder="Company Owner"
                {...register("owner")}
                error={formState.errors.owner && true}
              />
              {formState.errors.owner && (
                <p>{formState.errors.owner.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="address"
                name="address"
                autoComplete="off"
                placeholder="Company Legal Address"
                {...register("address")}
                error={formState.errors.address && true}
              />
              {formState.errors.address && (
                <p>{formState.errors.address.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="email"
                name="email"
                autoComplete="off"
                placeholder="Company Email"
                {...register("email")}
                error={formState.errors.email && true}
              />
              {formState.errors.email && (
                <p>{formState.errors.email.message}</p>
              )}
            </div>
            <div className="multipleinputs">
              {linkList?.map((x, i) => {
                return (
                  <div className="formInputs" key={i}>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      autoComplete="off"
                      placeholder="Begin with http:// or https:// or www."
                      onChange={(e) => handleLinkChange(e, i)}
                    />
                    {linkList?.length !== 1 && (
                      <button
                        className="SimpleButton btnHoverEffectOutline"
                        onClick={() => handleRemoveList(i)}
                      >
                        Remove
                      </button>
                    )}
                    {linkList?.length - 1 === i && (
                      <button
                        className="SimpleButton btnHoverEffectOutline"
                        onClick={handleAddList}
                      >
                        + Add
                      </button>
                    )}
                    {!linkList[i].isTrueVal && (
                      <p>Begin with http:// or https:// or www.</p>
                    )}
                    {weblinksErr && <p> *Website Links Are Required </p>}
                  </div>
                );
              })}
              <h6>You Can Also Add Socila Links Of Your Company</h6>
            </div>
          </div>
          <div className="address">
            <div className="checkboxContainer">
              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="Registering1"
                  defaultChecked={true}
                />
                <label htmlFor="Registering1">
                  <p>I&#x27;m Registering On Behalf Of Company</p>
                </label>
              </div>
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="youraddress"
                name="youraddress"
                autoComplete="off"
                placeholder="Personal Address"
                {...register("youraddress")}
                error={formState.errors.youraddress && true}
              />
              {formState.errors.youraddress && (
                <p>{formState.errors.youraddress.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                type="text"
                id="youremail"
                name="youremail"
                autoComplete="off"
                placeholder="Personal Email"
                {...register("youremail")}
                error={formState.errors.youremail && true}
              />
              {formState.errors.youremail && (
                <p>{formState.errors.youremail.message}</p>
              )}
            </div>
          </div>
          <div className="companyDetails">
            <h4 className="formtitle">Company Details</h4>
            <div className="detailsflex">
              <div className="formInputs">
                <input
                  type="text"
                  id="shareholders"
                  name="shareholders"
                  autoComplete="off"
                  placeholder="Shareholders"
                  {...register("shareholders")}
                  error={formState.errors.shareholders && true}
                />
                {formState.errors.shareholders && (
                  <p>{formState.errors.shareholders.message}</p>
                )}
              </div>
              <div className="formInputs">
                <input
                  type="text"
                  id="employees"
                  name="employees"
                  autoComplete="off"
                  placeholder="Employees"
                  {...register("employees")}
                  error={formState.errors.employees && true}
                />
                {formState.errors.employees && (
                  <p>{formState.errors.employees.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="companyProfile">
            <h4 className="formtitle">Company Profile Details</h4>
            <div className="profileBoxContainer">
              <div className="leftCard">
                <div className="icon">
                  <Image
                    width={100}
                    height={100}
                    src={logo ? logo : "/images/companyprofile.png"}
                    alt={"company profile"}
                    loading="lazy"
                  />
                </div>
                <label className=" btnHoverEffectOutlineUpload">
                  <span>Choose Files</span>
                  <input
                    id="logo"
                    type="file"
                    className="hidden"
                    accept={"image"}
                    style={{ display: "none" }}
                    onChange={captureFile}
                  />
                </label>
                {/* <button className="SimpleButton btnHoverEffectOutline" type="file"
                    accept={"image"}
                  >
                    Choose Files
                  </button> */}
                <p>Upload Logo</p>
              </div>
              <div className="rightCard">
                <div className="icon">
                  {walletConnected ? (
                    <Image
                      width={100}
                      height={100}
                      src="/images/companywallet.png"
                      alt={"company wallet"}
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      width={100}
                      height={100}
                      src="/images/ConnectwalletColoured.png"
                      alt={"company wallet"}
                      loading="lazy"
                    />
                  )}
                </div>
                {/* <button className="SimpleButton btnHoverEffectOutline">
                  Connect Wallet
                </button> */}
                {/* <WalletConnectButton></WalletConnectButton> */}
                <div className="formInputs">
                  <input
                    type="text"
                    id="walletaddress"
                    name="walletaddress"
                    placeholder="NFT Contract Address"
                    {...register("walletaddress")}
                    error={formState.errors.walletaddress && true}
                  />
                  {formState.errors.walletaddress && (
                    <p>{formState.errors.walletaddress.message}</p>
                  )}
                </div>
              </div>
            </div>
            <h6>280/280 Recommended. JPEG, JPG and PNG Supported</h6>
            <div className="bussinessinputList">
              <div className="formInputs">
                <input
                  type="text"
                  id="business"
                  name="business"
                  autoComplete="off"
                  placeholder="Bussiness"
                  {...register("business")}
                  error={formState.errors.business && true}
                />
                {formState.errors.business && (
                  <p>{formState.errors.business.message}</p>
                )}
              </div>
              <div className="formInputs">
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  autoComplete="off"
                  placeholder="Bussiness Tagline"
                  {...register("tagline")}
                  error={formState.errors.tagline && true}
                />
                {formState.errors.tagline && (
                  <p>{formState.errors.tagline.message}</p>
                )}
              </div>
              <h6>
                Use Your Tagline To Briefly Describe What Your Company Does.
              </h6>
              <div className="formInputDropDown">
                {redrawDropDown ? (
                  <Dropdown
                    data={getCategoryStatus}
                    getDropdownValue={getDropdownValue}
                    placeholder={"Business Category"}
                  />
                ) : null}

                {getCategoryStatusErr && <p>{"kindly select the status"}</p>}
              </div>

              <div className="checkboxContainer">
                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="verification"
                    name="verification"
                    defaultChecked={true}
                    {...register("verification")}
                  />
                  {/* <input type="checkbox" id="verification" name="verification" defaultChecked={true}  /> */}
                  <label htmlFor="verification">
                    <p>
                      I Verify That I Am An Authorized Representative Of This
                      Organization And Have The Right To Act On Its Behalf In
                      The Creation And Management Of This Page. The Organization
                      And I Agree To The Additional Terms For Pages.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="submitCompanyDetails">
            <input
              type="submit"
              value="Add Company"
              className="SimpleButton"
              style={{
                background: !formState.isValid ? "#333333" : "#E44757",
                color: !formState.isValid ? "#474747" : "#FFFFFF",
              }}
              disabled={!formState.isValid}
            />
            {/* <SimpleButton
              text={"Add Company"}
              backgroundColor={!formState.isValid ? "#333333" : "#E44757"}
              color={!formState.isValid ? "#474747" : "#FFFFFF"}
              disabled={!formState.isValid}
              onClick={handleSubmit(onSubmit)}
            /> */}
          </div>
        </div>
      </form>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  connectToMetas = state.connectToMeta;
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
export default connect(mapStateToProps, mapDispatchToProps)(ListYourCompany);
