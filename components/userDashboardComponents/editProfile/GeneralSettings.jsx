import React, { useState, useEffect, Fragment } from "react";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Image from "next/image";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Modal from "@/components/reusables/Modal";
import SimpleButton from "@/components/reusables/SimpleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPen } from "@fortawesome/free-solid-svg-icons";
import { checkUserAuth } from "@/utils/auth/userauth";
import { clearAllInterval } from "@/utils/common/interval";
import { useRouter } from "next/router";
import { withRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../../utils/wallet/index";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import { firebaseDate, firebaseIDDate } from "../../../utils/common/date";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";

const editIcon = <FontAwesomeIcon icon={faPen} />;
var FormData = require("form-data");
// import fs from 'fs';
// export const getServerSideProps = async (ctx) => {
//   return await checkUserAuth(ctx);
// };

const re =
  /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;

// const editIcon = <FontAwesomeIcon icon="fa-solid fa-pen-clip" />;
const schema = Joi.object({
  oldEmail: Joi.string()
    .label("Current Email")
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .regex(re)
    .required()
    .messages({
      "string.empty": `Current Email Required`,
      "any.required": `Current Email Required`,
      "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`,
    }),
  newEmail: Joi.string()
    .label("New Email")
    .email({ minDomainSegments: 2, tlds: {} })
    .regex(re)
    .required()
    .messages({
      "string.empty": `New Email Required`,
      "any.required": `New Email Required`,
      "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`,
    }),
});
var metaMaskValues = null;

function GeneralSettings({ users }) {
  const router = useRouter();

  // Router.push({ pathname: '/user/dashboard/editprofile', state: { users:users } });
  // const {state: { users } } = router;
  // console.log("router.state",router.state)
  const [avatarState, setAvatarState] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [showUploadImg, setShowUploadImg] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessImageUpload, setShowSuccessImageUpload] = useState(false);
  const [updateErrorMessage, setupdateErrorMessage] = useState("");
  const [imgData, setImgData] = useState({});
  const [fileData, setFileData] = useState();
  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const [userCredentials, setUserCredentials] = useState({});
  const [userNetwork, setUserNetwork] = useState([]);
  const [userSession, setUserSession] = useState([]);
  const [walletConnect, setWalletConnect] = useState({
    walletStatus: false,
    web3Connection: null,
    errorWhileConnection: false,
    contract: null,
    publicKey: "",
  });
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState();

  // functions
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const showAvatarModal = () => {
    setShowAvatar(true);
  };
  const showUploadImgModal = () => {
    setShowUploadImg(true);
  };
  // handle update Email
  // show email popup

  const onSubmitEmailData = async (data) => {
    let email = { email: data.newEmail, oldemail: data.oldEmail };
    await setupdateErrorMessage("");
    try {
      email = await SanitizeRequestObject(email);
      let encryptionData = await encryptRequestBody(email);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/updateemail`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      if (result) {
        setShowSuccess(true);
      }
      await setupdateErrorMessage("");
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      await setupdateErrorMessage("Failed to update email");
      console.log("Failed to update", e);
      //setShowSuccess(false);
      setError("Failed to update email");
    }
  };

  const writeToFireBase = async () => {
    try {
      //
      if (firebaseCollection == null) {
        return;
      }

      //Reading document
      let readDocumentResult = await readDocument(
        firebaseCollection,
        data.users.uuid,
        {}
      );
      let dataInsertToDB = {};

      dataInsertToDB[currentFirebaseID] = {};

      dataInsertToDB[currentFirebaseID][messageDetails.firebasetimestamp] = {
        error: messageDetails.error,
        errordescription: messageDetails.errordescription,
        purpose: messageDetails.purpose,
      };

      if (readDocumentResult.exists()) {
        //messageDetails.
        let dataalreadyInDatabase = await readDocumentResult.data();
        if (dataInsertToDB[currentFirebaseID] !== undefined) {
          dataInsertToDB[currentFirebaseID] = {
            ...dataalreadyInDatabase[currentFirebaseID],
            ...dataInsertToDB[currentFirebaseID],
          };
        }
        let updateDocument = await updatedDocument(
          firebaseCollection,
          data.users.uuid,
          dataInsertToDB
        );
      } else {
        //
        let insertedDocument = await insertDocument(
          firebaseCollection,
          data.users.uuid,
          dataInsertToDB
        );
      }
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to write");
    }
  };

  const UploadProfileImg = async () => {
    // data.append('image', fs.createReadStream('/C:/Users/irfan/OneDrive/Desktop/irfansaeedkhan.jpg'));
    // var config = {
    //   method: 'post',
    //   url: 'http://localhost:3000/api/users/profile/upload',
    //   headers: {
    //     ...data.getHeaders()
    //   },
    //   data : data
    // };
    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

    await setupdateErrorMessage("");
    try {
      var data = new FormData();
      data.append("file", fileData);
      //let encryptionData = await encryptRequestBody({data : data})

      data = await SanitizeRequestObject(data);

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/upload`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "security-set": true,
          },
        }
      );

      await SanitizeRequestString(result.data.location[0].Location);
      setAvatarState(result.data.location[0].Location);

      if (result) {
        setShowSuccessImageUpload(true);
      }
      await setupdateErrorMessage("");
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      await setupdateErrorMessage("Failed To Upload Image");
      console.log(e);
    }
  };

  useEffect(() => {
    // choosing image for uploading
    var imageUpload = document.getElementById("imageUpload");
    var imagePreview = document.getElementById("imagePreview");
    // uploader.type = 'file';
    // uploader.accept = 'image/*';
    // imagePreview.onclick = function() {
    //   imageUpload.click();
    // }

    imageUpload.addEventListener("change", (e) => {
      var reader = new FileReader();
      reader.onload = function (evt) {
        imagePreview.classList.remove("no-image");
        imagePreview.style.backgroundImage = "url(" + evt.target.result + ")";
        var request = {
          images: [
            {
              data: evt.target.result,
            },
          ],
        };
        const previewUrl = URL.createObjectURL(e.target.files[0]);
        setImgData(previewUrl);
        setFileData(e.target.files[0]);
      };
      if (imageUpload && imageUpload?.files[0]) {
        reader.readAsDataURL(imageUpload.files[0]);

        // setImgData(imageUpload.files[0].path);
      }
    });
    fetchProfilePic();
  }, []);
  useEffect(() => {
    var avatarList = document.querySelector(".avatarList");
    var avatarIcons = avatarList.getElementsByClassName("icon");
    for (var i = 0; i < avatarIcons?.length; i++) {
      avatarIcons[i].addEventListener("click", function (element) {
        var current = document.getElementsByClassName("activeImg");
        current[0].className = current[0].className.replace(" activeImg", "");
        this.className += " activeImg";
        if (this.classList.contains("avataricon1")) {
          setAvatarState("/images/avatar/avatar1.png");
        } else if (this.classList.contains("avataricon2")) {
          setAvatarState("/images/avatar/avatar2.png");
        } else if (this.classList.contains("avataricon3")) {
          setAvatarState("/images/avatar/avatar3.png");
        } else if (this.classList.contains("avataricon4")) {
          setAvatarState("/images/avatar/avatar4.png");
        } else if (this.classList.contains("avataricon5")) {
          setAvatarState("/images/avatar/avatar5.png");
        } else if (this.classList.contains("avataricon6")) {
          setAvatarState("/images/avatar/avatar6.png");
        } else if (this.classList.contains("avataricon7")) {
          setAvatarState("/images/avatar/avatar7.png");
        } else if (this.classList.contains("avataricon8")) {
          setAvatarState("/images/avatar/avatar8.png");
        } else if (this.classList.contains("avataricon9")) {
          setAvatarState("/images/avatar/avatar9.png");
        } else if (this.classList.contains("avataricon10")) {
          setAvatarState("/images/avatar/avatar10.png");
        } else if (this.classList.contains("avataricon11")) {
          setAvatarState("/images/avatar/avatar11.png");
        } else if (this.classList.contains("avataricon12")) {
          setAvatarState("/images/avatar/avatar12.png");
        } else if (this.classList.contains("avataricon13")) {
          setAvatarState("/images/avatar/avatar13.png");
        } else if (this.classList.contains("avataricon14")) {
          setAvatarState("/images/avatar/avatar14.png");
        } else if (this.classList.contains("avataricon15")) {
          setAvatarState("/images/avatar/avatar15.png");
        } else if (this.classList.contains("avataricon16")) {
          setAvatarState("/images/avatar/avatar16.png");
        } else if (this.classList.contains("avataricon17")) {
          setAvatarState("/images/avatar/avatar17.png");
        } else if (this.classList.contains("avataricon18")) {
          setAvatarState("/images/avatar/avatar18.png");
        } else if (this.classList.contains("avataricon19")) {
          setAvatarState("/images/avatar/avatar19.png");
        }
      });
    }
  }, []);
  useEffect(() => {
    void (async () => {
    await clearAllInterval();
    let userNets = [];
    const fetchUsers = async () => {
      try {
        const sanData = await SanitizeRequestObject(users);
        let encryptionData = await encryptRequestBody(sanData);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/getUserCredentials`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        );
        const sanObj = await SanitizeRequestObject(data);
        setUserCredentials(sanObj.UserCredentails);
      } catch (error) {
        // toast.error(error.message, {
        //   position: "top-center",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   });
        console.log("error fetching user credentails :", error);
      }
    };
    await fetchUsers();
      })();
  }, []);

  const fetchProfilePic = async () => {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const sanData = await SanitizeRequestObject(result?.data?.data);
      setAvatarState(sanData.Location);
    } catch (error) {
      console.log(error);
    }
  };

  const changeWalletAddress = async () => {
    try {
      let result = await connectToWallet("metamask");

      let metamaskAccounts = await fetchMetaMaskAccount(result.web3);

      let contract = null;

      if (result.web3) {
        contract = await web3DeSwapContract(result.web3);
      }

      if (metamaskAccounts.length == 0 || metamaskAccounts == undefined) {
        metamaskAccounts = await etherumFetchAccount(result.ethereum);
      }

      let userData = await fetchProfileData();

      console.log("user data ", userData);
      if (
        userData.walletaddress[
          userData.walletaddress.length - 1
        ].toLowerCase() ==
        metamaskAccounts[metamaskAccounts.length - 1].toLowerCase()
      ) {
        await setShow(true);
        await setModalBody(
          <p>
            Public key {metamaskAccounts[metamaskAccounts.length - 1]} is
            already saved in the database.
          </p>
        );
        return;
      }

      let walletConnect = {
        walletStatus: true,
        web3Connection: result,
        errorWhileConnection: false,
        contract: contract,
        publicKey: metamaskAccounts[metamaskAccounts.length - 1],
      };

      let conversionFees = 3;
      let encryptionData = await requestBodyEncryptionUnprotected({
        amount: conversionFees,
      });
      let conversionResult = await axios.post(
        "/api/conversion/dollartomatic",
        { data: encryptionData },
        { withCredentials: true }
      );
      let buyingFees = conversionResult.data.conversion * conversionFees;

      let results = await etherumTransaction(
        {
          sender: metamaskAccounts[0],
          amount: buyingFees.toString(),
          receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
        },
        walletConnect
      );

      if (results && results.transactionHash != undefined) {
        await updateMetamask({
          TxHash: results.transactionHash,
          Amount: conversionFees,
          AmountInMatic: buyingFees,
          ConversionRate: conversionResult.data.conversionRate.toString(),
          publickey: walletConnect.publicKey,
        });
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchProfileData = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      let profileData = result.data.data;
      profileData = await SanitizeRequestObject(profileData);
      return profileData;
    } catch (e) {
      console.log(e);
    }
  };

  const updateMetamask = async (data) => {
    try {
      console.log("Update metamask : ", data);
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/updatepublickey`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const etherumTransaction = async (data, walletConnect) => {
    try {
      let params;
      data.amount = await walletConnect.web3Connection.web3.utils.toWei(
        data.amount
      );
      let count =
        await walletConnect.web3Connection.web3.eth.getTransactionCount(
          data.sender
        );
      //
      let gasPrice = await walletConnect.web3Connection.web3.eth.getGasPrice();
      let transactionHash;
      if (data.contractAddress) {
        transactionHash = await sendContractTransaction(
          walletConnect.web3Connection.web3contract,
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
          value: "0x" + Number(data.amount).toString(16),
          gasPrice: gasPrice,
          data: "0x",
        };
        transactionHash = await sendMetaMaskTransaction(
          walletConnect.web3Connection.web3,
          params
        );
      }
      return transactionHash;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Metamask transaction failed ", e);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Etherum transaction error : " + e.message,
        purpose: "Etherum transaction",
      });
      return null;
    }
  };

  const closeConnectButtonClick = async () => {
    try {
      setShow(false);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Hide",
        purpose: "Hide",
      });
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(e);
    }
  };

  // console.log("userCredentials", userCredentials)
  // useEffect(() =>{
  //   console.log(" router.query.users", router?.query.users)

  // },[router?.query])
  return (
    <div className="general">
      <h2 className="gentitle">General</h2>
      <div className="changeAvatarContainer">
        <div className="changeAvatarIconContainer">
          <div className="imgContainer">
            <div className="img">
              <Image
                id="avatarplaceholder"
                src={avatarState ? avatarState : "/images/avatar.png"}
                alt="avatar"
                width={88}
                height={88}
                loading="lazy"
              />
            </div>
            <div className="img">
              <Image
                id="cameraicon"
                src={"/cameraupload.png"}
                width={32}
                height={32}
                alt="camera icon"
                onClick={() => showUploadImgModal()}
                loading="lazy"
              />
            </div>
          </div>
          <div className="walletAddressCode">
            <h2>
              {userCredentials &&
                userCredentials.walletaddress &&
                userCredentials.walletaddress[
                  userCredentials.walletaddress.length - 1
                ]}
            </h2>
          </div>
        </div>
      </div>
      <div className="changeEmailContainer">
        <form method="post" autoComplete="off">
          <div
            style={{ color: "#e44757", fontSize: "14px", marginBottom: "8px" }}
          >
            {updateErrorMessage}
          </div>
          <div className="formInputs">
            <div className="iconinputContainer">
              <input
                id="oldEmail"
                name="oldEmail"
                type={"text"}
                placeholder="Current Email Address"
                autoComplete="off"
                {...register("oldEmail")}
                error={formState.errors.oldEmail && true}
              />
            </div>

            {formState.errors.oldEmail && (
              <p>{formState.errors.oldEmail.message}</p>
            )}
          </div>
          <div className="formInputs">
            <div className="iconinputContainer">
              <input
                id="newEmail"
                name="newEmail"
                type={"text"}
                placeholder="Add New Email Address"
                autoComplete="off"
                {...register("newEmail")}
                error={formState.errors.newEmail && true}
              />
            </div>
            {formState.errors.newEmail && (
              <p>{formState.errors.newEmail.message}</p>
            )}
          </div>
        </form>
        <form method="post" autoComplete="off" className="walletAddressForm">
          <h3>Wallet Address</h3>
          <div className="formInputs">
            <div className="iconinputContainer walletAddCon">
              <input
                id="walletAdd"
                name="walletAdd"
                type={"text"}
                value={
                  userCredentials && userCredentials.walletaddress
                    ? userCredentials.walletaddress[
                        userCredentials.walletaddress.length - 1
                      ]
                    : "N/A"
                }
                autoComplete="off"
              />
              <button
                className="unbindBtn"
                onClick={(e) => {
                  e.preventDefault();
                  //setShowWalletConnectMessage(true);
                  changeWalletAddress();
                }}
              >
                Change
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="buttonContainer">
        <div className="formInputs submit">
          <button
            className="btnHoverEffectOutline"
            style={{
              background: !formState.isValid ? "#333333" : "#e44757",
              color: !formState.isValid ? "#474747" : "#FFF",
            }}
            disabled={!formState.isValid}
            onClick={handleSubmit(onSubmitEmailData)}
          >
            Save Changes
          </button>
        </div>
      </div>
      {/* change image modal */}
      <Modal
        show={showUploadImg}
        onClose={() => setShowUploadImg(false)}
        modaltitle={"Change Profile Image"}
      >
        <div className="changeimgUploadContainer">
          <div className="containerImg">
            <h1>Upload Image</h1>
            <div
              style={{
                color: "#e44757",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {updateErrorMessage}
            </div>
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input
                  type="file"
                  id="imageUpload"
                  accept=".png, .jpg, .jpeg"
                />
                <label htmlFor="imageUpload"> {editIcon} </label>
              </div>
              <div className="avatar-preview">
                <div
                  id="imagePreview"
                  style={{ backgroundImage: " url(/images/avatar.png) " }}
                ></div>
              </div>
            </div>
          </div>
          <SimpleButton
            text="Save"
            backgroundColor="#E44757"
            maxWidth="90%"
            onClick={UploadProfileImg}
          />
        </div>
      </Modal>
      {/* modal avatar */}
      <Modal
        show={showAvatar}
        onClose={() => setShowAvatar(false)}
        modaltitle={"Change Avatar"}
      >
        <div className="avatarContainer">
          <div className="avatarList">
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar1.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon1 icon activeImg"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar2.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon2 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar3.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon3 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar4.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon4 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar5.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon5 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar6.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon6 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar7.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon7 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar8.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon8 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar9.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon9 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar10.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon10 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar11.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon11 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar12.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon12 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar13.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon13 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar14.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon14 icon"
                loading="lazy"
              />
            </div>
            <div className="avatarCard">
              <Image
                src={"/images/avatar/avatar15.png"}
                width={88}
                height={88}
                alt=" icon"
                className="avataricon15 icon"
                loading="lazy"
              />
            </div>
          </div>
          <SimpleButton
            text="Save"
            backgroundColor="#E44757"
            maxWidth="90%"
            onClick={() => {
              setShowAvatar(false);
            }}
          />
        </div>
      </Modal>
      {/* success modal */}
      <Modal show={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Email Updated Successfully</h5>
            <p></p>
          </div>
        </div>
      </Modal>
      {/* success modal for image upload */}
      <Modal
        show={showSuccessImageUpload}
        onClose={() => setShowSuccessImageUpload(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Image Updated Successfully</h5>
            <p></p>
          </div>
        </div>
      </Modal>
      {/* wallect connect message modal */}
      <Modal
        show={showWalletConnectMessage}
        onClose={() => setShowWalletConnectMessage(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>Metamask</h5>
            <p>Please Connect To Polygon Mainnet</p>
          </div>
        </div>
      </Modal>
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
export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);
//export default withRouter(GeneralSettings);
