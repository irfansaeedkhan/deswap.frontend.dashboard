import React, { useState } from "react";
import Image from "next/image";
import {
  HeartIcon,
  EmptyHeartIcon,
  TickIcon,
} from "@/components/marketPlace/MarketIcons";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import StakingABI from "../../abi/staking.json";
import MYNFTABI from "../../abi/my-nft.json";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Loader from "@/components/reusables/loader/Loader";
import { useEffect } from "react";
import axios from "../../utils/common/axios";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../utils/wallet/index";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { useRouter } from "next/router";

var metaMaskValues = null;

function NFTCard({ collectedData, cardData, purchase, dataType, likes }) {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [nftContract, setnftContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [description, setDescription] = useState();
  const [imageLink, setImageLink] = useState();
  const [like, setLike] = useState(likes);
  const [resp, setResp] = useState();
  const [price, setPrice] = useState();


  const router = useRouter();

  useEffect(() => {
    console.log("cardData", cardData);
    fetchIPFSData(cardData._tokenURI);
  }, [cardData]);

  const fetchIPFSData = async (uri) => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        uri.split("/")[uri.split("/").length - 1]
    );
    console.log("res--", response.data);
    setDescription(response?.data?.description);
    setImageLink(
      process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        response?.data?.image.split("/")[
          response?.data?.image.split("/").length - 1
        ]
    );
    setResp(response.data);
    let result = await connectToWallet("metamask");
    let price = result.web3.utils.fromWei(cardData?._price, "ether");
    setPrice(price);
    return response.data;
  };

  const likeButton = async (nftID) => {
    try {
      console.log("nftID", nftID);
      let encryptionData = await encryptRequestBody({
        nftID: nftID,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/nfts/like`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      console.log("result", result);
      if (result.data.data == "successfully like") {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (e) {
      console.log("error", e);
    }
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

  const stakeFunc = async () => {
    try {
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
                  crossorigin=""
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
      // Fetching contract address
      const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

      console.log("Connected wallet address : ", accounts);
      const contract = new metaMaskValues.metaconn.web3.eth.Contract(
        MYNFTABI,
        `${process.env.NEXT_PUBLIC_MY_NFT_Contract_Address}`,
        {
          from: accounts[0],
        }
      );

      // const contract = new metaMaskValues.metaconn.web3.eth.Contract(StakingABI, `${process.env.NEXT_PUBLIC_Staking_Contract_Address}`, {
      //   from: accounts[0]
      // });
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
                alt={"deswap image"}
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
      /*
      let chainId1 = 80001;
      let count1 = await metaMaskValues.metaconn.web3.eth.getTransactionCount(
        `${accounts[0]}`
      );
      var rawTransaction = {
        from: `${accounts[0]}`,
        nonce: "0x" + count1.toString(16),
        gasPrice: "0x00000002540BE400",
        gasLimit: await metaMaskValues.metaconn.web3.utils.toHex(2100000),
        to: `${process.env.NEXT_PUBLIC_MY_NFT_Contract_Address}`,
        // value: "0x" + Number(test).toString(16),
        value: "0x",
        data: await contract.methods
          .mintNFT(accounts[0], "www.metamaskmobileacc2sk9.com")
          .encodeABI(),
        chainId: chainId1,
      };

      console.log("Create NFT transaction : ", rawTransaction);
      const sendData = await metaMaskValues.metaconn.web3.eth.sendTransaction(
        rawTransaction
      );
      */
      //www.metamaskmobileacc2sk4.com
      //www.metamaskmobileacc2sk4.com
      //Calling contract
      await contract.methods
        .mintNFT(accounts[0], "www.metamaskmobileacc2sk1.com")
        .send()
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
            let tokenID = receipt.events.Transfer.returnValues.tokenId;
            console.log("Token id ", tokenID);

            const stakingContract =
              new metaMaskValues.metaconn.web3.eth.Contract(
                StakingABI,
                `${process.env.NEXT_PUBLIC_Staking_Contract_Address}`,
                {
                  from: accounts[0],
                }
              );

            const result = await stakingContract.methods
              .stake(tokenID)
              .send({
                gasLimit: await metaMaskValues.metaconn.web3.utils.toHex(
                  2100000
                ),
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
          } catch (error) {
            console.log("Error : ", error);
          }
        })
        .on("error", function (error, receipt) {
          console.log("Error : ", error, "\n");
          console.log(receipt);
        });

      // console.log("collection data", collectedData[0].tokenId)

      // i think it will be called one time only
      //const initilzeData = await stakingContract.methods.initialize(process.env.NEXT_PUBLIC_MY_NFT_Contract_Address, process.env.NEXT_PUBLIC_DAW_Token_Contract_Address, 10,5).send();
      //console.log("initilzeData", initilzeData);

      // const test = await metaMaskValues.metaconn.web3.utils.toWei(String(0.08));

      // let count = await metaMaskValues.metaconn.web3.eth.getTransactionCount(
      //   `${accounts[0]}`
      // );
      // let chainId = 80001;
      //  var rawTransaction = {
      //     from: `${accounts[0]}`,
      //     nonce: '0x' + count.toString(16),
      //     gasPrice: '0x00000002540BE400',
      //     gasLimit: await metaMaskValues.metaconn.web3.utils.toHex(2100000),
      //     to: `${process.env.NEXT_PUBLIC_Staking_Contract_Address}`,
      //     // value: "0x" + Number(test).toString(16),
      //     value: "0x",
      //     data: await contract.methods.approve(process.env.NEXT_PUBLIC_Staking_Contract_Address,tokenID).encodeABI(),
      //     chainId: chainId
      //   };

      //   console.log("Raw transaction ",rawTransaction)
      //   const approveData = await metaMaskValues.metaconn.web3.eth.sendTransaction(rawTransaction);

      /*
      const approveData = await contract.methods
        .approve(process.env.NEXT_PUBLIC_Staking_Contract_Address, tokenID)
        .send({
          gasLimit: await metaMaskValues.metaconn.web3.utils.toHex(2100000),
          // from: accounts[0],
          // value:"0x" + Number(test).toString(16),
          // data:"0x" + Number(test).toString(16),
        });
      console.log("approveData", approveData);*/
      // const contract1 = new metaMaskValues.metaconn.web3.eth.Contract(StakingABI, `${process.env.NEXT_PUBLIC_Staking_Contract_Address}`, {
      //   from: ""
      // });
      // const result = await stakingContract.methods.stake(tokenID).send();
      // console.log("result",result);
    } catch (e) {
      console.log("error", e);
    }
  };

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

  const closeButton = () => {
    setShow(false);
  };
  return (
    <div
      className={`collectionCard ${dataType == "staked" && "staked"}`}
      key={cardData?.id}
    >
      <div className="cardTop">
        <div className="cardImg">
          <Image
            width={296}
            height={296}
            src={imageLink}
            alt={"collection image"}
            loading="lazy"
          />
        </div>
        <div className="heartImg" onClick={() => likeButton(cardData?.id)}>
          {like ? <HeartIcon /> : <EmptyHeartIcon />}
        </div>
        {cardData?.duration && (
          <div className="timeleft">
            <div className="timeImg">
              <Image
                width={24}
                height={24}
                src={"/images/clock.png"}
                alt={"clock image"}
                loading="lazy"
              />
            </div>
            <h6>{cardData?.duration} days left</h6>
          </div>
        )}
      </div>
      <div className="cardBottom">
        <div className="topContent">
          <h5>{resp?.name}</h5>
          <div className="author">
            <h6>
              {cardData?.by}
              <TickIcon />
            </h6>
          </div>
        </div>
        <div className="bottomContent">
          {dataType == "staked" ? (
            <div className="priceContainer Staked">
              <div className="detailbox">
                <p>Reward</p>
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
                    {cardData?.stakingProfit ? cardData?.stakingProfit : "N/A"}{" "}
                    DAW
                  </h6>
                </div>
              </div>
              <div className="detailbox">
                <p>Staking time</p>
                <h6>
                  {cardData?.stakingDuration
                    ? cardData?.stakingDuration
                    : "N/A"}
                </h6>
              </div>
            </div>
          ) : (
            <div className="priceContainer">
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
                <h6>{price} MATIC</h6>
              </div>
            </div>
          )}
          {dataType == "staked" && (
            <div className="bottomBtn ">
              <div className="buttonContainer">
                <button
                  className="SimpleButton btnHoverEffectOutline"
                  onClick={claimedRewardFunc}
                >
                  Claim Reward
                </button>
                <button
                  className="SimpleButton btnHoverEffectOutline"
                  onClick={unstakeNFTFunc}
                >
                  Un-stake
                </button>
              </div>
            </div>
          )}
          {purchase !== false && (
            <div className="bottomBtn ">
              <button className="SimpleButton btnHoverEffectOutline" onClick={()=>{router.push(`/market/buynft/${cardData?.id}`)}}>
                Buy Now
              </button>
            </div>
          )}
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
const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkAdminAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NFTCard);
