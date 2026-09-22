import React, { useState, useEffect, useReducer } from "react";
import { checkUserAuth } from "@/utils/auth/userauth";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { connect, useSelector, useDispatch } from "react-redux";

import { useRouter } from "next/router";
import axios from "@/utils/common/axios";
import { wrapper } from "../../redux/store/store";
import { bindActionCreators } from "redux";

//import Collected from "@/components/marketPlace/profile/Collected";
const Collected = dynamic(
  () => import("@/components/marketPlace/profile/Collected"),
  { ssr: false }
);
//import Created from "@/components/marketPlace/profile/Created";
const Created = dynamic(
  () => import("@/components/marketPlace/profile/Created"),
  { ssr: false }
);
//import Staked from "@/components/marketPlace/profile/Staked";
const Staked = dynamic(
  () => import("@/components/marketPlace/profile/Staked"),
  { ssr: false }
);
//import FavoritedNFTs from "@/components/marketPlace/profile/FavoritedNFTs";
const FavoritedNFTs = dynamic(
  () => import("@/components/marketPlace/profile/FavoritedNFTs"),
  { ssr: false }
);
//import FavoritedCollections from "@/components/marketPlace/profile/FavoritedCollections";
const FavoritedCollections = dynamic(
  () => import("@/components/marketPlace/profile/FavoritedCollections"),
  { ssr: false }
);
//import Activity from "@/components/marketPlace/profile/Activity";
const Activity = dynamic(
  () => import("@/components/marketPlace/profile/Activity"),
  { ssr: false }
);
//import MarketNavbar from "@/components/marketPlace/MarketNavbar";
const MarketNavbar = dynamic(
  () => import("@/components/marketPlace/MarketNavbar"),
  { ssr: false }
);
import { PagesLayout } from "@/components/reusables/layout/allpages";
import { User, MarketPlace } from "../../constants/frontend";
//import SocialIcon from "@/components/marketPlace/profile/SocialIcon";
const SocialIcon = dynamic(() =>
  import("@/components/marketPlace/profile/SocialIcon")
);

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
    default:
      return state;
  }
};

let SocialImageLink = MarketPlace.userProfile.displaySocial;
//
const UserProfile = () => {
  const [collectedData, setCollectedData] = useState();
  const [userDetails, dispatchUserDetail] = useReducer(userDetailsReducer, {
    walletaddress: "",
    profilePic: User.defaultPorfilePic,
    joinedDate: null,
    bio: "",
    username: "",
    fblink: "",
    twitter: "",
  });

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
    } catch (error) {
      console.log("Error layout : ", error);
    }
      })();
  }, []);

  const router = useRouter();

  /*
  
  console.log(router.query.tab);
  useEffect(() => {
    // Always do navigations after the first render
    router.push("/market/userprofile?tab=collected", undefined, {
      shallow: true,
    });
  }, []);*/
  return (
    <PagesLayout title="Deswap User Profile">
      <div className="marketMain">
        <MarketNavbar />
        <div className="useProfileContainer">
          {/* banner */}
          <div className="banner">
            <div className="profilePhoto">
              <Image
                width={168}
                height={168}
                src={userDetails.profilePic}
                alt={"deswap image"}
                loading="lazy"
              />
            </div>
            <div className="socialLinksContainer">
              <div className="social">
                <SocialIcon
                  SocialList={MarketPlace.userProfile.displaySocial}
                />
              </div>
              <div className="dots">
                <button>
                  <Image
                    width={20}
                    height={20}
                    src="/images/dots.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="collectionContentContainer">
            {/* collection details */}
            <div className="collectionDetails">
              <div className="statsContainer">
                <div className="titleName">
                  <h4>{userDetails.username}</h4>
                  <div className="by">
                    <h6>
                      {userDetails.walletaddress}{" "}
                      <span> {userDetails.joinedDate}</span>
                    </h6>
                  </div>
                </div>
              </div>
              <p className="description">{userDetails.bio}</p>
              <div className="TabsMain">
                <div className="tabsContainer">
                  <ul className="mb-3 nav nav-tabs">
                    {MarketPlace.userProfile.tabNames.map(function (
                      tabNames,
                      index
                    ) {
                      return (
                        <li
                          className="nav-item"
                          onClick={() => {
                            router.push(
                              `/market/userprofile?tab=${tabNames.toLowerCase()}`,
                              undefined,
                              {
                                shallow: true,
                              }
                            );
                          }}
                        >
                          <button
                            type="button"
                            className={`nav-link ${
                              router.query.tab == tabNames.toLowerCase() &&
                              "active"
                            }`}
                          >
                            {tabNames}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="tab-content">
                    {router.query.tab == "collected" && (
                      <Collected collectedData={collectedData} />
                    )}
                    {router.query.tab == "created" && <Created />}
                    {router.query.tab == "staked" && <Staked />}
                    {router.query.tab == "favorited nft" && <FavoritedNFTs />}
                    {router.query.tab == "favorited collection" && (
                      <FavoritedCollections />
                    )}
                    {router.query.tab == "activity" && <Activity />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PagesLayout>
  );
};

const mapStateToProps = (state) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
//export default UserProfile;
