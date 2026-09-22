import React, { useState, useEffect } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import FilterSearch from "./Filter/FilterSearch";
import FilterSideBox from "./Filter/FilterSideBox";
import MarketPlaceContractABI from "../../../abi/nft-marketplace.json";
import MYNFTABI from "../../../abi/my-nft.json";
import StakingABI from "../../../abi/staking.json";
import axios from "../../../utils/common/axios";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import NFTCardv1 from "../NFTCardv1";
import SimpleButton from "@/components/reusables/SimpleButton";
import { initialize } from "react-ga";
import { useInView } from "react-intersection-observer";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { listNFTsCollectedByUser } from "../../../subgraph/query";
import MainContent from "../resuable/MainContent";
import Link from "next/link";

function Collected({ metamaskConn }) {
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [staked, setStaked] = useState(true);
  const [collectedNFTs, setcollectedNFTs] = useState(
    <MainContent
      heading={"Nothing found"}
      subheading={"We couldn't find anything with this criteria"}
      content={<button className="exploreBtn">Explore NFTs</button>}
    />
  );
  const [skip, setSkip] = useState(0);
  let MarketPlaceContract = null;
  //TO DO : Can be removed
  //
  let MyNFTsContract = null;
  //
  let StakingContract = null;

  const StakeNFT = async (event, nftDetails, userDetails) => {
    try {
      //Add fnction to stake
      await initialize();

      await approve(userDetails.tokenId);

      console.log("XXX Stake send function ");
      await StakingContract.methods
        .stake(userDetails.tokenId)
        .send({
          gasLimit: await metamaskConn.metaconn.web3.utils.toHex(2100000),
        })
        .on("receipt", async function (receipt) {
          try {
            console.log("Receipt : ", receipt);
          } catch (error) {
            console.log("Failed : ", error);
          }
        })
        .on("error", function (error, receipt) {
          console.log("Error : ", error, "\n");
          console.log(receipt);
        });
    } catch (e) {
      console.log("Failed to stake NFT", error);
    }
  };

  const initialize = async () => {
    const initilzeData = await StakingContract.methods.initialize(process.env.NEXT_PUBLIC_MY_NFT_Contract_Address, process.env.NEXT_PUBLIC_DAW_Token_Contract_Address, 10, 5).send();
    console.log("initilzeData", initilzeData);
  }

  const approve = async (tokenID) => {
    console.log("XX Approve ", tokenID);
    await MyNFTsContract.methods
      .approve(process.env.NEXT_PUBLIC_Staking_Contract_Address, tokenID)
      .send({
        gasLimit: await metamaskConn.metaconn.web3.utils.toHex(2100000),
      })
      .on("receipt", async function (receipt) {
        try {
          console.log("Receipt : ", receipt);
          try {
            console.log("Receipt : ", receipt);
            if (!receipt.events) {
              return;
            }
            if (!receipt.events.Approval) {
              return;
            }
            let returnValues = receipt.events.Approval.returnValues;
            console.log("Return Value ", returnValues);
          } catch (error) {
            console.log("Error : ", error);
          }
        } catch (error) {
          console.log("Failed : ", error);
        }
      });
  };

  const InitialiseNFT = async (event, nftDetails, userDetails) => {
    try {
      await StakingContract.methods
      initialize(process.env.NEXT_PUBLIC_MY_NFT_Contract_Address, process.env.NEXT_PUBLIC_DAW_Token_Contract_Address, 10, 5)
        .send({
          gasLimit: await metamaskConn.metaconn.web3.utils.toHex(2100000),
        })
        .on("transactionHash", function (hash) {
          console.log("Transaction hash : ", hash);
        })
        .on("receipt", async function (receipt) {
          try {
            console.log("Receipt-- : ", receipt);
            if (!receipt.events) {
              return;
            }
            // if (!receipt.events.Transfer) {
            //   return;
            // }
            /*
            await StakeNFT(event, nftDetails, {
              ...userDetails,
              mintTokenID: mintTokenID,
            });*/
          } catch (error) {
            console.log("Error : ", error);
          }
        })
        .on("error", function (error, receipt) {
          console.log("Error : ", error, "\n");
          console.log(receipt);
        });
    } catch (error) {
      console.log("Initialize NFT : ", error);
    }
  };
  /**
   *
   * @param {Event of onClick} event
   * @param {NFT Details} nftDetails
   * @param {user Details} userDetails
   */

  const MintNFT = async (event, nftDetails, userDetails) => {
    try {
      //TO DO : Talha Check from where we can get external link.
      console.log("No External link : ", nftDetails);
      //Mint NFT function
      await MyNFTsContract.methods
        .mintNFT(userDetails.account, nftDetails.ExternalLink)
        .send({
          gasLimit: await metamaskConn.metaconn.web3.utils.toHex(2100000),
        })
        .on("transactionHash", function (hash) {
          console.log("Transaction hash : ", hash);
        })
        .on("receipt", async function (receipt) {
          try {
            console.log("Receipt : ", receipt);
            if (!receipt.events) {
              return;
            }
            if (!receipt.events.Transfer) {
              return;
            }
            let mintTokenID = receipt.events.Transfer.returnValues.tokenId;
            console.log("Token id ", mintTokenID);

            await InitialiseNFT(event, {
              ...userDetails,
              mintTokenID: mintTokenID,
            });
          } catch (error) {
            console.log("Error : ", error);
          }
        })
        .on("error", function (error, receipt) {
          console.log("Error : ", error, "\n");
          console.log(receipt);
        });
    } catch (error) {
      console.log("Fail to get NFT : ", error);
    }
  };

  /**
   * Function will be called on click of Stake function button
   * Function will check metamask connection
   * Function connect to contract and then call mint function
   */
  const StakeNFTs = async (event, nftDetails) => {
    try {
      console.log("Staked NFTs Details : ", nftDetails);
      console.log("Contract of MarketPlace ", MarketPlaceContract);
      if (!metamaskConn.metamaskconnected) {
        //TO DO : Add Code to display popup
        console.log("Not connected to metamask : ");
        return;
      }

      //Fetching my NFT
      const userAccount = await metamaskConn.metaconn.web3.eth.getAccounts();

      //If My NFT contract is null then connect to it
      if (MyNFTsContract == null) {
        //TO DO : talha check  i think we can avoid it because if we need only token id
        // then we are already getting it
        MyNFTsContract = new metamaskConn.metaconn.web3.eth.Contract(
          MYNFTABI,
          `${process.env.NEXT_PUBLIC_MY_NFT_Contract_Address}`,
          {
            from: userAccount[0],
          }
        );
      }

      if (StakingContract == null) {
        StakingContract = new metamaskConn.metaconn.web3.eth.Contract(
          StakingABI,
          `${process.env.NEXT_PUBLIC_Staking_Contract_Address}`,
          {
            from: userAccount[0],
          }
        );
      }
      // Call function to mint
      await MintNFT(event, nftDetails, {
        account: userAccount[0],
      });
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const createNFTUI = async (nftsDetails) => {
    try {
      //Checking if their is any staking NFTs
      if (nftsDetails.length == 0) {
        //
        setcollectedNFTs(
          <MainContent
            heading={"No NFT"}
            subheading={"Purchase NFT"}
            content={
              <Link href="/market">
                <button className="exploreBtn">Purchase NFTs</button>
              </Link>
            }
          />
        );
        return;
      }
      let NFTUI = [];

      //
      for (let index = 0; index < nftsDetails.length; index++) {
        console.log(nftsDetails[index]);
        NFTUI.push(
          <NFTCardv1
            cardDetails={{
              id: nftsDetails[index].id,
              description: nftsDetails[index].description,
              image: nftsDetails[index].image,
              name: nftsDetails[index].name,
              owner: nftsDetails[index].owner,
              seller: nftsDetails[index].seller,
              tokenURI: nftsDetails[index]._tokenURI,
              tokenId: nftsDetails[index].tokenId,
              colleciion: nftsDetails[index].colleciion,
              by: nftsDetails[index].seller,
              like: false,
              duration: null,
              price: nftsDetails[index].price,
            }}
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
                  <h6>
                    {metamaskConn.metaconn.web3.utils.fromWei(
                      nftsDetails[index].price,
                      "ether"
                    )}{" "}
                    MATIC
                  </h6>
                </div>
                <div className="bottomBtn ">
                  <div className="buttonContainer staked">
                    <button
                      className="SimpleButton btnHoverEffectOutline"
                      onClick={(event) => {
                        StakeNFTs(event, nftsDetails[index]);
                      }}
                    >
                      Stake
                    </button>
                    <button
                      className="SimpleButton btnHoverEffectOutline"
                      onClick={() => {
                        completeCheckout();
                      }}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        );
      }
      setcollectedNFTs(NFTUI);
    } catch (error) {
      console.log("Created NFTS ", error);
    }
  };

  const fetchNFTDetails = async (NFTsList) => {
    try {
      console.log("NFT List : ", NFTsList);
      let NFTList = [];
      for (let index = 0; index < NFTsList.length; index++) {
        let meta = await axios.get(NFTsList[index]._tokenURI);
        NFTList.push({ ...meta.data, ...NFTsList[index] });
      }
      return NFTList;
    } catch (error) {
      console.log("Error ", error);
      return [];
    }
  };

  //Function will fetch NFTs From the graphql
  const fetchCreatedNFTs = async () => {
    try {
      //Checking if metamask wallet is connected or not
      if (!metamaskConn.metamaskconnected) {
        setcollectedNFTs(
          <MainContent
            heading={"Not connected to wallet"}
            subheading={"Please connect metamask wallet"}
            content={null}
          />
        );
        return;
      }

      //Creating instance of the contract
      MarketPlaceContract = new metamaskConn.metaconn.web3.eth.Contract(
        MarketPlaceContractABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: metamaskConn.metamaskaccount,
        }
      );

      //Fetching NFTS Purchased by user
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listNFTsCollectedByUser),
        variables: {
          first: 5,
          skip: skip,
          ownerAddress: metamaskConn.metamaskaccount,
        },
        fetchPolicy: "cache-first",
      });

      //Fetching NFTS details from IPFS
      let NFTListWithDetails = await fetchNFTDetails(data.marketItemCreateds);

      //Creating NFT cards
      await createNFTUI(NFTListWithDetails);
    } catch (error) {
      console.log("Failed to get rewards : ", error);
    }
  };

  //TO DO : Remove
  const completeCheckout = async () => {
    await setShow(true);
    await setModalHeader("Sell NFT");
    await setModalBody(
      <div className="stacknftModal">
        <div className="nftImgIcon">
          <Image
            width={120}
            height={120}
            //src={nft.image}   //to show the image here
            src="/images/king.png"
            alt={"icon"}
            loading="lazy"
          />
        </div>
        <h4>King darker</h4>
        <h5>
          Octagon_Deswap-<span>55c345C3UV</span>
        </h5>
        <div className="priceBox">
          <label htmlFor="">Set Price</label>
          <div className="maticicon">
            <Image
              width={14}
              height={14}
              src={"/images/maticicon.png"}
              alt={"matic icon"}
              loading="lazy"
            />
          </div>
          <input type="text" placeholder="Price" />
        </div>
      </div>
    );
    await setModalFooter(
      <div className="FooterbtnContainer">
        <SimpleButton
          text={"Sell"}
          backgroundColor={"#E44757"}
          color={"#FFFFFF"}
          onClick={() => {
            CheckoutSuccess();
          }}
        />
      </div>
    );

    // setTimeout(CheckoutSuccess, 3000);
  };

  //TO DO : Remove
  const CheckoutSuccess = () => {
    setShow(true);
    setModalHeader("Congratulations, Your item sold!");
    setModalBody(
      <div className="stacknftModal">
        <div
          className="nftImgIcon"
          style={{
            borderRadius: "16px",
            width: "120px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Image
            width={120}
            height={120}
            src="/images/king.png"
            alt={"icon"}
            loading="lazy"
          />
        </div>
        <h4>king darker</h4>

        <h5 style={{ color: "#858585", lineHeight: "20px" }}>
          You have successfully sold{" "}
          <span style={{ color: "#ffffff" }}>King darker</span> for{" "}
          <span style={{ color: "#E44757" }}>123.00 Poligon</span> on Nether NFT
          platform.
        </h5>
      </div>
    );
    setModalFooter(
      <div className="FooterbtnContainer">
        <SimpleButton
          text={"View Item"}
          backgroundColor={"rgba(228, 71, 87, 0.12)"}
          color={"#E44757"}
        />
      </div>
    );
  };

  //TO DO : Remove
  async function stacknft() {
    try {
      await setShow(true);
      await setModalHeader("Stake NFT");
      await setModalBody(
        <div className="stacknftModal">
          <div
            className="nftImgIcon"
            style={{
              borderRadius: "16px",
              width: "120px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <Image
              width={120}
              height={120}
              src="/images/king.png"
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h4>king darker</h4>
          <h5 style={{ color: "#858585" }}>
            Do you want to Stake Small world By{" "}
            <span style={{ color: "#ffffff" }}>king darker NFT?</span>
          </h5>
        </div>
      );
      await setModalFooter(
        <div
          className="FooterbtnContainer"
          style={{ display: "flex", gap: "7px" }}
        >
          <SimpleButton
            text={"Go Back"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              setShow(false);
            }}
          />
          <SimpleButton
            text={"Yes"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              Processstacknft();
            }}
          />
        </div>
      );
    } catch (e) {
      console.log("Failed to edit transaction ", e);
    }
  }

  //TO DO : Remove
  async function Processstacknft() {
    try {
      await setShow(true);
      await setModalHeader("Stake NFT");
      await setModalBody(
        <div className="stacknftModal">
          <div
            className="nftImgIcon"
            style={{
              borderRadius: "16px",
              width: "120px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <Image
              width={120}
              height={120}
              src="/images/king.png"
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h4>king darker</h4>
          <h5>
            Octagon_Deswap-<span>55c345C3UV</span>
          </h5>
          <div className="statusBox">
            <div className="status">
              <h5>Status</h5>
              <h6>{staked ? "Completed" : "Processing"}</h6>
            </div>
            <div className="status">
              <h5>Transaction Hash</h5>
              <h6 style={{ color: "#E44757" }}>0x1204...23b350</h6>
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainer">
          <SimpleButton
            text={"Ok"}
            disabled={!staked}
            backgroundColor={staked ? "#E44757" : "#333333"}
            color={staked ? "#FFFFFF" : "#474747"}
            onClick={() => {
              setShow(false);
            }}
          />
        </div>
      );
    } catch (e) {
      console.log("Failed to edit transaction ", e);
    }
  }

  const closeButton = () => {
    setShow(false);
  };

  useEffect(() => {
    void (async () => {
    fetchCreatedNFTs();
    if (lastPostEntry?.isIntersecting) {
      setSkip(skip + 6);
    }
    return () => {};
      })();
  }, [metamaskConn, lastPostRef, lastPostEntry, setSkip]);

  let cardDetails = {
    id: "sdfs43rsf",
    image: "/images/nft3.png",
    like: true,
    duration: 32,
    name: "irfan",
    by: "Octagon_Deswap",
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
        <div className="collectionBox">{collectedNFTs}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Collected);
