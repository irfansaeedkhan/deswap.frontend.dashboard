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
//import FilterSearch from "./Filter/FilterSearch";
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
//Not in user
//import NFTCardv1 from "../NFTCardv1";
//Not in use
//import SimpleButton from "@/components/reusables/SimpleButton";
//import { useInView } from "react-intersection-observer";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { likedCollections } from "../../../subgraph/query";
//Not in use
//import Link from "next/link";
//import MainContent from "../resuable/MainContent";
const MainContent = dynamic(() => import("../resuable/MainContent"), {
  ssr: false,
});
//import CreatedCollection from "../resuable/CreatedCollection";
const CreatedCollection = dynamic(
  () => import("../resuable/CreatedCollection"),
  {
    ssr: false,
  }
);

function FavoritedCollections({ metamaskConn }) {
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
        console.log("NFT Details ", value._uri);
        const { data } = await axios.get(
          process.env.NEXT_PUBLIC_IPFS_URL +
            "/ipfs/" +
            value._uri.split("/")[value._uri.split("/").length - 1]
        );
        data.coverImage =
          process.env.NEXT_PUBLIC_IPFS_URL +
          "/ipfs/" +
          data.coverImage.split("/")[data.coverImage.split("/").length - 1];
        data.image =
          process.env.NEXT_PUBLIC_IPFS_URL +
          "/ipfs/" +
          data.image.split("/")[data.image.split("/").length - 1];
        console.log("NFT Details ", data, value);
        return <CreatedCollection cardDetails={{ ...data, ...value }} />;
      });
      var NFTDetailsCollection = await Promise.all(NFTDetaisPromise);
      console.log("NFT Details Collection : ", NFTDetailsCollection);
      setCreatedNFTs(NFTDetailsCollection);
    } catch (error) {
      console.log("Fetchig ");
    }
  };

  const FetchDetailsFromGraph = async (likedCollectionList) => {
    try {
      let filtered = await likedCollectionList.map((value, index) => {
        console.log("Value : ", value);
        console.log("Index : ", index);
        return value.likeCollectionID;
      });
      console.log("Filtered : ", filtered);
      //Fetching NFTS Purchased by user
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(likedCollections),
        variables: {
          id: filtered,
        },
        fetchPolicy: "cache-first",
      });
      await FetchDataFromIPFS(data.createCollections);
    } catch (error) {
      console.log("Failed to fetch ", error);
    }
  };
  const FetchLikedInCollections = async () => {
    try {
      let { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/collection/fetchlikev1`,
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
    FetchLikedInCollections();
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritedCollections);
