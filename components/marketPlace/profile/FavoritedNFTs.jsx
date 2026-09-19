import React, { useState, useEffect } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import dynamic from "next/dynamic";
const FilterSearch = dynamic(() => import("./Filter/FilterSearch"), {
  ssr: false,
});
//import FilterSideBox from "./Filter/FilterSideBox";
const FilterSideBox = dynamic(() => import("./Filter/FilterSideBox"), {
  ssr: false,
});
import axios from "../../../utils/common/axios";
//import BootstrapModal from "@/components/reusables/BootstrapModal";
const BootstrapModal = dynamic(
  () => import("@/components/reusables/BootstrapModal"),
  {
    ssr: false,
  }
);
const MainContent = dynamic(() => import("../resuable/MainContent"), {
  ssr: false,
});
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { likedNFTs } from "../../../subgraph/query";
import NFTCardv1 from "../NFTCardv1";

function FavoritedNFTs({ metamaskConn }) {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [createdNFTs, setCreatedNFTs] = useState(
    <MainContent
      heading={"No NFTs"}
      subheading={"Create NFTs"}
      content={<button className="exploreBtn">NFTs</button>}
    />
  );
  const [filterState, setFilterState] = useState(true);
  const filterToggle = () => {
    setFilterState((prev) => !prev);
  };
  const closeButton = () => {};

  const FetchDataFromIPFS = async (NFTsDetails) => {
    try {
      let NFTDetaisPromise = await NFTsDetails.map(async (value, index) => {
        console.log("NFT Details ", value._tokenURI);
        const { data } = await axios.get(value._tokenURI);
        console.log("Data : ", data);
        console.log("NFT Details ", data, value);
        let nftDetails = { ...data, ...value };
        return (
          <NFTCardv1
            cardDetails={{
              id: nftDetails.id,
              description: nftDetails.description,
              image: nftDetails.image,
              name: nftDetails.name,
              owner: nftDetails.owner,
              seller: nftDetails.seller,
              tokenURI: nftDetails._tokenURI,
              tokenId: nftDetails.tokenId,
              colleciion: nftDetails.colleciion,
              by: nftDetails.seller,
              like: false,
              duration: null,
              price: nftDetails.price,
            }}
          />
        );
      });
      var NFTDetailsCollection = await Promise.all(NFTDetaisPromise);
      console.log("NFT Details Collection : ", NFTDetailsCollection);
      setCreatedNFTs(NFTDetailsCollection);
    } catch (error) {
      console.log("Fetchig ");
    }
  };

  const FetchDetailsFromGraph = async (likedNFTList) => {
    try {
      let filtered = await likedNFTList.map((value, index) => {
        console.log("Value : ", value);
        console.log("Index : ", index);
        return value.likeNFTID;
      });
      console.log("Filtered list nfts : ", filtered);
      //Fetching NFTS Purchased by user
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(likedNFTs),
        variables: {
          id: filtered,
        },
        fetchPolicy: "cache-first",
      });
      console.log("NFT Details : ", data);
      await FetchDataFromIPFS(data.createItems);
    } catch (error) {
      console.log("Failed to fetch ", error);
    }
  };

  const FetchLikedInfts = async () => {
    try {
      let { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/nfts/profile/liked`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      await FetchDetailsFromGraph(data.data);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  useEffect(() => {
    FetchLikedInfts();
  }, [metamaskConn]);
  return (
    <div className="ItemsContainer">
      <FilterSearch />
      <div className="filterBottomContainer">
        {filterState && <FilterSideBox />}
        <div className="collectionBox">{createdNFTs}</div>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeButton}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  metamaskConn: state.metamaskConn,
});

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritedNFTs);
