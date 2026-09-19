import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";

import FilterSearch from "./Filter/FilterSearch";
import FilterSideBox from "./Filter/FilterSideBox";
import NFTMarketPlaceContractABI from "../../../abi/nft-marketplace.json";
import axios from "../../../utils/common/axios";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import NFTCardv1 from "../NFTCardv1";
import SimpleButton from "@/components/reusables/SimpleButton";
import Image from "next/image";
function Staked({ metamaskConn }) {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [stakedNFTs, setstakedNFTs] = useState(
    <div className="collectionBox">
      <div className="nodataDetail created">
        <h4>Stake NFTs</h4>
        <p>No staked NFTs</p>
      </div>
    </div>
  );
  let MarketPlaceContract = null;

  const unStake = async (event, NFTDetails) => {
    try {
      console.log("Events : ", event);
      console.log("NFTDetails : ", NFTDetails);
      console.log("Market place : ", MarketPlaceContract);
      await MarketPlaceContract.methods
        .unstake(3)
        .send({
          gasLimit: await metamaskConn.metaconn.web3.utils.toHex(2100000),
        })
        .on("transactionHash", function (hash) {
          console.log("Transaction hash : ", hash);
        });
    } catch (error) {
      console.log("Unstake error : ", error);
    }
  };
  const createNFTUI = async (nftsDetails) => {
    try {
      //Checking if their is any staking NFTs
      if (nftsDetails.lenght == 0) {
        //
        setstakedNFTs(
          <div className="nodataDetail created">
            <h4>Stake NFTs</h4>
            <p>No staked NFTs</p>
          </div>
        );
        return;
      }
      let NFTUI = [];
      for (let index = 0; index < nftsDetails.length; index++) {
        console.log("Index ", nftsDetails[index]);
        NFTUI.push(
          <NFTCardv1
            cardDetails={nftsDetails[index]}
            dataType="unstaked"
            buttonContent={
              <button
                onClick={(event) => {
                  unStake(event, nftsDetails[index]);
                }}
              >
                Unstake
              </button>
            }
          />
        );
      }
      setstakedNFTs(NFTUI);
      //setstakedNFTs(NFTUI);
      //setstakedNFTs.push(NFTUI);
      /*setstakedNFTs(
        <div className="nodataDetail created">
          <h4>Stake NFTs</h4>
          <p>No staked NFTs</p>
        </div>
      );
      */
    } catch (error) {
      console.log("Created NFTS ", error);
    }
  };

  const fetchNFTDetails = async (NFTsList) => {
    try {
      let NFTList = [];
      for (let index = 0; index < NFTsList.length; index++) {
        let tokenURI = await MarketPlaceContract.methods
          .tokenURI(NFTsList[index].tokenId)
          .call();
        let meta = await axios.get(tokenURI);
        console.log({ ...meta.data, ...NFTsList[index] });
        NFTList.push({ ...meta.data, ...NFTsList[index] });
      }
      return NFTList;
    } catch (error) {
      console.log("Error ", error);
      return [];
    }
  };

  const fetchStakedNFTs = async () => {
    try {
      if (!metamaskConn.metamaskconnected) {
        console.log("Not connected to the metamask wallet");
        return;
      }

      MarketPlaceContract = new metamaskConn.metaconn.web3.eth.Contract(
        NFTMarketPlaceContractABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: metamaskConn.metamaskaccount,
        }
      );

      console.log(
        "Connected to market place contract : ",
        await MarketPlaceContract.methods
      );

      const NFTsList = await MarketPlaceContract.methods.fetchMyNFTs().call();

      let NFTListWithDetails = await fetchNFTDetails(NFTsList);
      console.log("NFTS details : ", NFTListWithDetails);
      await createNFTUI(NFTListWithDetails);
    } catch (error) {
      console.log("Failed to get rewards : ", error);
    }
  };

  const fetchCreatedNFTs = async () => {
    try {
      if (!metamaskConn.metamaskconnected) {
        console.log("Not connected to the metamask wallet");
        return;
      }

      MarketPlaceContract = new metamaskConn.metaconn.web3.eth.Contract(
        NFTMarketPlaceContractABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: metamaskConn.metamaskaccount,
        }
      );

      console.log(
        "Connected to market place contract : ",
        await MarketPlaceContract.methods
      );

      const NFTsList = await MarketPlaceContract.methods.fetchMyNFTs().call();

      let NFTListWithDetails = await fetchNFTDetails(NFTsList);
      console.log("NFTS details : ", NFTListWithDetails);
      await createNFTUI(NFTListWithDetails);
    } catch (error) {
      console.log("Failed to get rewards : ", error);
    }
  };
  /*
  //Checking if metamask wallet is connected
  if (metamaskConn.metamaskconnected) {
    //Call function fetch NFTs from blockchain
    fetchCreatedNFTs();
  }
  */
  const closeButton = () => {
    setShow(false);
  };
  useEffect(async () => {
    fetchCreatedNFTs();
    fetchStakedNFTs();
    return () => {};
  }, [metamaskConn]);

  let cardDetails = {
    id: "sdfs43rsf",
    image: "/images/nft5.png",
    like: true,
    // duration: 32,
    name: "irfan",
    by: "You",
  };
  const claimedRewardFunc = async () => {
    try {
      await setShow(true);
      await setModalHeader("Claim Rewards For Your Item");
      await setModalBody(
        <div className="stakedModal">
          <div className="modalProfile">
            <Image
              width={120}
              height={120}
              src={"/images/claimedModalPic.png"}
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h2>Quantum Unlocked</h2>
          <h3>Small city token-55c345C3UV</h3>

          <div className="token">
            <h4>Token ID</h4>
            <h5>2</h5>
          </div>
          <div className="details">
            <div className="item">
              <h4>Total Staking time</h4>
              <h5>4 days</h5>
            </div>
            <div className="item">
              <h4>Rewards</h4>
              <h5>100 DAW</h5>
            </div>
            <div className="item">
              <h4>Total Fee</h4>
              <h5>0.01 Matic</h5>
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainerStaked">
          <SimpleButton
            text={"Go Back"}
            backgroundColor={"#372426"}
            color={"#e44757"}
            onClick={closeButton}
          />
          <SimpleButton
            text={"Proceed"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
          />
        </div>
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  const unstakeNFTFunc = async () => {
    try {
      await setShow(true);
      await setModalHeader("Are You Sure  You Want To Unstake Your NFT?");
      await setModalBody(
        <div className="stakedModal">
          <div className="modalProfile">
            <Image
              width={120}
              height={120}
              src={"/images/claimedModalPic.png"}
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h2>Quantum Unlocked</h2>
          <h3>Small city token-55c345C3UV</h3>

          <div className="token">
            <h4>Token ID</h4>
            <h5>2</h5>
          </div>
          <div className="details">
            <div className="item">
              <h4>Total Claimed Rewards</h4>
              <h5>300 DAW</h5>
            </div>
            <div className="item">
              <h4>Total Fee</h4>
              <h5>0.01 Matic</h5>
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainerStaked">
          <SimpleButton
            text={"Go Back"}
            backgroundColor={"#372426"}
            color={"#e44757"}
            onClick={closeButton}
          />
          <SimpleButton
            text={"Proceed"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={unstakeFunc}
          />
        </div>
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  const unstakeFunc = async () => {
    try {
      await setShow(true);
      await setModalHeader("Warning");
      await setModalBody(
        <div className="stakedModal">
          <p>Please Claim All Your Rewards Before Un-Staking</p>
        </div>
      );
      await setModalFooter(null);
    } catch (e) {
      console.log("error", e);
    }
  };
  const [filterState, setFilterState] = useState(true);
  const filterToggle = () => {
    setFilterState((prev) => !prev);
  };
  return (
    <div className="ItemsContainer">
      <FilterSearch filterToggle={filterToggle} filterState={filterState} />
      <div className="filterBottomContainer">
        {filterState && <FilterSideBox />}
        {/* {stakedNFTs} */}
        <div className="collectionBox">
          <NFTCardv1
            cardDetails={cardDetails}
            dataType="unstaked"
            buttonContent={
              <div className="priceContainer bottomSetting">
                <p>Price</p>
                <div className="pricelist">
                  <div className="maticicon">
                    <Image
                      width={14}
                      height={14}
                      src={"/images/maticicon.png"}
                      alt={"matic icon"}
                      loading="lazy"
                    />
                  </div>
                  <h6>19.65 MATIC</h6>
                </div>
                <div className="bottomBtn ">
                  <div className="buttonContainer staked">
                    <button
                      className="SimpleButton btnHoverEffectOutline"
                      onClick={() => {
                        claimedRewardFunc();
                      }}
                    >
                      Claim Reward
                    </button>
                    <button
                      className="SimpleButton btnHoverEffectOutline"
                      onClick={() => {
                        unstakeNFTFunc();
                      }}
                    >
                      Un-stake
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Staked);
