//  imports packages
import React, { useState, useEffect, useReducer } from "react";
import { checkUserAuth } from "@/utils/auth/userauth";
import Image from "next/image";
import Collected from "@/components/marketPlace/profile/Collected";
import Created from "@/components/marketPlace/profile/Created";
import Staked from "@/components/marketPlace/profile/Staked";
import FavoritedNFTs from "@/components/marketPlace/profile/FavoritedNFTs";
import FavoritedCollections from "@/components/marketPlace/profile/FavoritedCollections";
import Activity from "@/components/marketPlace/profile/Activity";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../redux/actions/metamask";
import axios from "../utils/common/axios";
import { useRouter } from "next/router";
import { wrapper } from "../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { PagesLayout } from "@/components/reusables/layout/allpages";
var metaMaskValues;

// imports components
import { User, MarketPlace } from "../constants/frontend";
import SocialIcon from "@/components/marketPlace/profile/SocialIcon";

export function ProfileLayout({ children }) {
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
  const [userDetails, dispatchUserDetail] = useReducer(userDetailsReducer, {
    walletaddress: "",
    profilePic: User.defaultPorfilePic,
    joinedDate: null,
    bio: "",
    username: "",
    fblink: "",
    twitter: "",
  });
  useEffect(async () => {
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
  }, []);
  return (
    <main className="marketMain">
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
              <SocialIcon SocialList={MarketPlace.userProfile.displaySocial} />
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
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
