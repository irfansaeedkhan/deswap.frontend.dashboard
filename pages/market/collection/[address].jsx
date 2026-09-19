import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import DropDownV2 from "@/components/global/DropDownV2";
import NFTCard from "@/components/marketPlace/NFTCard";
import SimpleButton from "@/components/reusables/SimpleButton";
import CollectionActivity from "../../../components/marketPlace/collection/CollectionActivity";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { listNFTsInCollection } from "../../../subgraph/query";
import axios from "axios";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

function Collection(props) {
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();
  const [filterState, setFilterState] = useState(true);
  const [activeCollection, setActiveCollection] = useState("buy");
  const [statusState, setStatusState] = useState(true);
  const [priceState, setPriceState] = useState(true);
  const [displayTab, setDisplayTab] = useState("tab1");
  const [getStatus, setGetStatus] = useState("Active");
  const [statusError, setStatusError] = useState(false);
  const [nftData, setNFTData] = useState([]);
  const [likedNFT, setLikedNFT] = useState([]);
  const [skip, setSkip] = useState(0);
  const router = useRouter();
  const getDropdownValue = (value) => {
    setGetStatus(value);
  };
  const sortData = [
    { id: 0, label: "Lowest Price" },
    { id: 1, label: "Highest Price" },
  ];

  useEffect(() => {
    console.log("hi");
    fetchNFTInCollection(router);
    if (lastPostEntry?.isIntersecting) {
      setSkip(skip + 6);
    }
  }, [router, lastPostRef, lastPostEntry, setSkip]);

  const data = [
    {
      id: 1,
      name: "Quantum Unlocked",
      by: "Octagon_Deswap",
      image: "/images/nft1.png",
      heart: false,
    },
    {
      id: 2,
      name: "king Darker",
      by: "Octagon_Deswap",
      image: "/images/nft2.png",
      heart: true,
    },
    {
      id: 3,
      name: "king Darker",
      by: "Octagon_Deswap",
      image: "/images/nft3.png",
      heart: true,
    },
    {
      id: 4,
      name: "Flyfish Club Inside",
      by: "Octagon_Deswap",
      image: "/images/nft2.png",
      heart: true,
    },
    {
      id: 5,
      name: "Flyfish Club Inside",
      by: "Octagon_Deswap",
      image: "/images/nft1.png",
      heart: true,
    },
  ];
  const auctiondata = [
    {
      id: 1,
      name: "Quantum Unlocked",
      by: "Octagon_Deswap",
      image: "/images/nft3.png",
      duration: "13 days",
      heart: false,
    },
    {
      id: 2,
      name: "king Darker",
      by: "Octagon_Deswap",
      image: "/images/nft1.png",
      duration: "6 days",
      heart: true,
    },
    {
      id: 3,
      name: "king Darker",
      by: "Octagon_Deswap",
      image: "/images/nft2.png",
      duration: "13 days",
      heart: true,
    },
    {
      id: 4,
      name: "Flyfish Club Inside",
      by: "Octagon_Deswap",
      image: "/images/nft2.png",
      duration: "13 days",
      heart: true,
    },
    {
      id: 5,
      name: "Flyfish Club Inside",
      by: "Octagon_Deswap",
      image: "/images/nft1.png",
      duration: "13 days",
      heart: true,
    },
  ];
  const fetchNFTInCollection = async (router) => {
    try {
      console.log("router.query.address", router);
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listNFTsInCollection),
        variables: {
          first: 6,
          skip: skip,
          collectionAddress: router.query.address,
        },
        fetchPolicy: "cache-first",
      });
      let nftIDs = new Array();
      data.createItems.map((datas) => {
        nftIDs.push(datas.id);
      });
      console.log("nftIDs", nftIDs);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/nfts/fetch/liked`,
        { data: nftIDs },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      console.log("Liked APIs : ", result.data.data);
      setLikedNFT(result.data.data);
      setNFTData([...nftData, ...data.createItems]);
    } catch (error) {
      console.log("testing ", error);
    }
  };
  const filterToggle = () => {
    setFilterState((prev) => !prev);
  };
  const statusToggle = () => {
    setStatusState((prev) => !prev);
    setTimeout(() => {
      let over = document.querySelector(".status .contents");
      if (over.classList.contains("active")) {
        over.style.overflow = "initial";
      } else {
        over.style.overflow = "hidden";
      }
    }, 130);
  };
  const priceToggle = () => {
    setPriceState((prev) => !prev);
  };
  return (
    <div className="colContainer">
      {/* banner */}
      <div className="banner">
        <div className="profilePhoto">
          <Image
            width={168}
            height={168}
            src="/images/col_profile.png"
            alt={"deswap image"}
            loading="lazy"
          />
        </div>
        <div className="socialLinksContainer">
          <div className="social">
            <button>
              <Image
                width={20}
                height={20}
                src="/images/fb.png"
                alt={"icon"}
                loading="lazy"
              />
            </button>
            <button>
              <Image
                width={20}
                height={20}
                src="/images/tweet.png"
                alt={"icon"}
                loading="lazy"
              />
            </button>
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
              <h4>Small city</h4>
              <div className="by">
                <h6>
                  <span>By </span> Octagon_Deswap
                  <TickIcon />
                </h6>
              </div>
            </div>
            <div className="statBox">
              <div className="statItem">
                <h6>Items</h6>
                <h5>10.2k</h5>
              </div>
              <div className="statItem">
                <h6>Owner</h6>
                <h5>2.1k</h5>
              </div>
              <div className="statItem">
                <h6>Floor Price</h6>
                <h5>$108.56</h5>
              </div>
              <div className="statItem">
                <h6>Market Price</h6>
                <h5>$1.56M</h5>
              </div>
              <div className="statItem">
                <h6>Total Volum</h6>
                <h5>10.56k</h5>
              </div>
            </div>
          </div>
          <p className="description">
            4 Years. That was how long it took to finally get recognized and
            featured by Apple. I had done everything from shooting weddings...
          </p>
          <div className="TabsMain">
            <div className="tabsContainer">
              <ul className="mb-3 nav nav-tabs">
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayTab("tab1");
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${displayTab == "tab1" && "active"}`}
                  >
                    Items
                  </button>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayTab("tab2");
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${displayTab == "tab2" && "active"}`}
                  >
                    Activity
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                {displayTab == "tab1" && (
                  <div className="ItemsContainer">
                    <div className="filterTopContainer">
                      <SimpleButton
                        text={"Filters"}
                        backgroundColor={!filterState ? "#333333" : "#ffffff"}
                        color={!filterState ? "#858585" : "#0a0a0a"}
                        onClick={filterToggle}
                      />
                      <div className="searchInput">
                        <div className="searchIcon">
                          <Searchicon />
                        </div>
                        <input type="text" placeholder="Search Here" />
                      </div>
                      <div className="dropdownInput">
                        <DropDownV2
                          title={"Sort and filters"}
                          data={sortData}
                          getDropdownValue={getDropdownValue}
                          placeholder={sortData[0].label}
                        />
                        {statusError && <p>{"kindly select the status"}</p>}
                      </div>
                    </div>
                    <div className="filterBottomContainer">
                      {filterState && (
                        <div className="filterBox">
                          <div className="filterBoxInner">
                            <div
                              className={`status ${statusState && "active"}`}
                            >
                              <div
                                className="titleArrow"
                                onClick={statusToggle}
                              >
                                <h6>Status</h6>
                                <ArrowDown />
                              </div>
                              <div
                                className={`contents ${
                                  statusState && "active"
                                }`}
                              >
                                <div className="contentsInner">
                                  <button
                                    className={`SimpleButton btnHoverEffectOutline ${
                                      activeCollection == "buy" && "active"
                                    }`}
                                    onClick={() => {
                                      setActiveCollection("buy");
                                    }}
                                  >
                                    Buy Now
                                  </button>
                                  <button
                                    className={`SimpleButton btnHoverEffectOutline ${
                                      activeCollection == "auction" && "active"
                                    }`}
                                    onClick={() => {
                                      setActiveCollection("auction");
                                    }}
                                  >
                                    Timed Auction
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className={`price ${priceState && "active"}`}>
                              <div className="titleArrow" onClick={priceToggle}>
                                <h6>Price</h6>
                                <ArrowDown />
                              </div>
                              <div className="contents">
                                <div className="contentsInner">
                                  <div className="inputBoxContainer">
                                    <p>Lowest</p>
                                    <div className="inputBox">
                                      <input type="text" placeholder="0" />
                                      <h6>Matic</h6>
                                    </div>
                                  </div>
                                  <div className="inputBoxContainer">
                                    <p>Highest</p>
                                    <div className="inputBox">
                                      <input type="text" placeholder="0" />
                                      <h6>Matic</h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="filterFooter">
                              <button className="SimpleButton btnHoverEffectOutline">
                                Apply
                              </button>
                              <button className="SimpleButton btnHoverEffectOutline">
                                Clear Filter
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {true ? (
                        <div
                          className={`collectionBox ${
                            !filterState && "Box4"
                          }  `}
                        >
                          {activeCollection == "buy" &&
                            nftData &&
                            nftData.map((cardData) => (
                              <>
                                {likedNFT.indexOf(cardData.id) >= 0 ? (
                                  <NFTCard
                                    cardData={cardData}
                                    key={cardData.id}
                                    likes={true}
                                  />
                                ) : (
                                  <NFTCard
                                    cardData={cardData}
                                    key={cardData.id}
                                    likes={false}
                                  />
                                )}
                              </>
                            ))}
                          {activeCollection == "auction" &&
                            auctiondata.map((AuctionCardData) => (
                              <NFTCard cardData={AuctionCardData} />
                            ))}
                        </div>
                      ) : (
                        <div className="collectionBox">
                          <div className="nodataDetail created">
                            <h4>Nothing found</h4>
                            <p>We couldn't find anything with this criteria</p>
                            <button className="exploreBtn">Explore NFTs</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {displayTab == "tab2" && (
                  // <div className="collectioncardContainer">No Data</div>
                  <CollectionActivity />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
