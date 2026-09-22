import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from "react";
import { checkUserAuth } from "@/utils/auth/userauth";
import Image from "next/image";
import { EditCircleIcon } from "@/components/marketPlace/MarketIcons";
import SimpleButton from "@/components/reusables/SimpleButton";
import { wrapper } from "../../redux/store/store";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "../../utils/common/axios";
import { User, MarketPlace } from "../../constants/frontend";
//import { CoverUploadButton } from "./cover.upload.button";
import ImageCropper from "@/components/marketPlace/settings/ImageCropper";
import { useDragCoverImage } from "@/components/marketPlace/settings/dragCoverImage";
//
const userDetailsReducer = (userDetailsReducer, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE_IMAGE":
      return {
        ...userDetailsReducer,
        profilePic: action.profilepic,
      };
    case "UPDATE_WALLET_ADDRESS":
      return {
        ...userDetailsReducer,
        walletaddress: action.walletaddress,
      };
    case "UPDATE_JOINED_DATE":
      return {
        ...userDetailsReducer,
        joinedDate: action.date,
      };
    case "UPDATE_BIO":
      return { ...userDetailsReducer, bio: action.bio };
    case "UPDATE_USERNAME":
      return { ...userDetailsReducer, username: action.username };
    case "UPDATE_FACEBOOK_LINK":
      return { ...userDetailsReducer, fblink: action.fblink };
    case "UPDATE_TWITTER_LINK":
      return { ...userDetailsReducer, twitter: action.twitter };
    case "UPDATE_EMAIL_ID":
      return { ...userDetailsReducer, emailid: action.emailid };
    default:
      return state;
  }
};

function Usersettings() {
  const [userDetails, dispatchUserDetail] = useReducer(userDetailsReducer, {
    walletaddress: "",
    profilePic: User.defaultPorfilePic,
    joinedDate: null,
    bio: "",
    username: "",
    fblink: "",
    twitter: "",
    emailid: "",
  });

  const { imagePosition } = useDragCoverImage();
  const [coverImage, setCoverImage] = useState({
    blob: null,
    newImage: false,
    preview: "",
  });
  const coverImageInputRef = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    void (async () => {
    try {
      let { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      console.log("Data : ", data);
      console.log("Data : ", data.data);
      if (data.data.profilePic) {
        dispatchUserDetail({
          type: "UPDATE_PROFILE_IMAGE",
          profilepic: data.data.profilePic,
        });
      }

      dispatchUserDetail({
        type: "UPDATE_WALLET_ADDRESS",
        walletaddress:
          data.data.walletaddress[data.data.walletaddress.length - 1],
      });
      dispatchUserDetail({
        type: "UPDATE_JOINED_DATE",
        date: data.data.createdAt,
      });
      dispatchUserDetail({ type: "UPDATE_BIO", bio: data.data.marketPlaceBio });
      dispatchUserDetail({
        type: "UPDATE_USERNAME",
        username: data.data.username,
      });
      dispatchUserDetail({
        type: "UPDATE_FACEBOOK_LINK",
        fblink: data.data.social_facebook,
      });
      dispatchUserDetail({
        type: "UPDATE_TWITTER_LINK",
        twitter: data.data.social_twitter,
      });
      dispatchUserDetail({
        type: "UPDATE_EMAIL_ID",
        emailid: data.data.emailid,
      });
    } catch (error) {
      console.log("Error layout : ", error);
    }
      })();
  }, []);

  const setInitialCoverImage = useCallback(() => {
    if (userDetails?.cover_image) {
      setCoverImage({
        ...user.cover_image,
        blob: null,
        newImage: false,
        preview: "",
      });
    }
  }, [userDetails?.cover_image]);

  useEffect(() => {
    setInitialCoverImage();
  }, [setInitialCoverImage]);

  const handleSelectCoverImage = (event) => {
    try {
      const file = event.target.files?.[0];
      event.target.value = "";
      //Checking if file is selected or not
      if (!file) {
        //If file is not selected so returning it
        return;
      }

      //Checking if image is allowed type only or
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        //Show error message that only png and jpg files are allowed
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setCoverImage((prev) => ({
          ...prev,
          object_name: file.name,
          path: reader.result,
          blob: file,
          preview: previewUrl,
          newImage: true,
        }));
        setShow(true);
      };
    } catch (error) {
      console.log("Failed to select cover image", error);
    }
  };

  const handleUploadCoverImage = async (e) => {
    try {
      if (!coverImage.blob) {
        console.log("Uplaod cover image ", coverImage);
        return;
      }
      const button = e.currentTarget;
      //button.disabled = true;
      const coverImageData = {
        ...coverImage,
      };
      console.log("Cover image data : ", coverImageData);
      // Get pre-signed URL from API
      ///api/users/media/upload/presignedurl
      const { data } = await axios.get(
        "/api/users/media/upload/presignedurl?filename=" +
          coverImageData.object_name
      );
      console.log("Data signed url : ", data);
      coverImageData.object_name = data.objectName;

      // Create form data
      const presignedPostData = data.presignedPostData;
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });
      formData.append("file", coverImage.blob);

      // Upload file to S3
      await axios.post(presignedPostData.url, formData);

      coverImageData.path = presignedPostData.url + "/" + data.objectName;

      // Update profile image in DB
      updateUserImage({
        type: "cover_image",
        object_name: coverImageData.object_name,
        path: coverImageData.path,
        y: imagePosition,
      });

      setCoverImage((prev) => ({
        ...prev,
        blob: null,
        newImage: false,
      }));

      mutateUser({
        cover_image: {
          object_name: coverImageData.object_name,
          path: coverImageData.path,
          y: imagePosition,
        },
      });

      button.disabled = false;
    } catch (error) {
      console.log("Error message ", error);
    }
  };
  return (
    <div className="settingContainer">
      {/* banner */}
      <input
        type="file"
        ref={coverImageInputRef}
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleSelectCoverImage}
      />
      <button
        onClick={handleUploadCoverImage}
        style={{ color: "white", backgroundColor: "black" }}
      >
        Upload{" "}
      </button>
      {coverImage.preview ? (
        <ImageCropper
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          show={show}
          setShow={setShow}
        />
      ) : null}
      {/* <div className="banner"> */}
      <div
        // onMouseDown={coverImage.newImage ? handleMouseDown : undefined}
        className="banner"
        style={{
          backgroundImage: `url(${coverImage.path})`,
          backgroundPosition: `center center`,
        }}
      >
        <div className="profilePhoto">
          <div className="profileImgContent">
            <Image
              width={168}
              height={168}
              // src="/images/userprofilepic.png"
              src={userDetails.profilePic}
              alt={"deswap image"}
              loading="lazy"
            />
            <div className="editBtn">
              <div className="editIcon">
                <input type="file" name="" id="" />
                <EditCircleIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="socialLinksContainer">
          <div className="dots">
            <div className="editIcon">
              <input type="file" name="" id="" />
              <EditCircleIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="settingMain">
        <div className="formCOntainer">
          <form action="" autoComplete="off">
            <div className="inputFormContainer">
              <div className="inputBox">
                <label htmlFor="Username">Username</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Name"
                  id="Username"
                  value={userDetails.username}
                />
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox">
                <label htmlFor="email">Email address</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Email"
                  id="email"
                  value={userDetails.emailid}
                />
              </div>
            </div>
            <div className="inputFormContainer ">
              <div className="inputBox txtarea">
                <label htmlFor="bio">Bio</label>
                <textarea
                  name="bio"
                  id="bio"
                  cols="30"
                  rows="2"
                  value={userDetails.bio}
                >
                  {userDetails.bio}
                </textarea>
              </div>
            </div>
            <div className="socialboxContainer">
              <h5>Social and Links</h5>

              <div className="socialbox">
                <div className="inputFormContainer bp-0">
                  <div className="inputBox nolabel">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Twitter Username"
                      id="Twitter"
                      value={userDetails.twitter}
                    />
                  </div>
                </div>
                <SimpleButton
                  text={"Connected"}
                  backgroundColor={"#E44757"}
                  color={"#FFFFFF"}
                />
              </div>
              <div className="socialbox">
                <div className="inputFormContainer bp-0">
                  <div className="inputBox nolabel">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Facebook Username"
                      id="Facebook"
                      value={userDetails.fblink}
                    />
                  </div>
                </div>
                <SimpleButton
                  text={"Connected"}
                  backgroundColor={"#E44757"}
                  color={"#FFFFFF"}
                />
              </div>
            </div>
            <div className="inputFormContainer">
              <div className="inputBox nolabel">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Your Website"
                  id="Website"
                />
              </div>
            </div>
            <h5 className="walletaddressTitle">Wallet Address</h5>
            <div className="inputFormContainer">
              <div className="inputBox">
                <label htmlFor="Address">Address</label>
                {userDetails.walletaddress && (
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Address"
                    id="Address"
                    value={userDetails.walletaddress}
                  />
                )}
              </div>
            </div>
            <div className="submitBtn">
              <SimpleButton
                text={"Save Changes"}
                backgroundColor={"rgba(228, 71, 87, 0.12)"}
                color={"#E44757"}
              />
            </div>
          </form>
        </div>
        <div className="previewCOntainer"></div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Usersettings);
