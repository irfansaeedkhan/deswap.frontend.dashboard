import React, { useState, useEffect } from "react";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import Image from "next/image";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import axios from "@/utils/common/axios";
import NodataCard from "@/components/reusables/NodataCard";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { myRewardsDate } from "@/utils/common/date";
import { SanitizeRequestStringSync } from "@/utils/common/sanitize";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Pagination from "@/components/reusables/Pagination";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import OctagonLicense from "../../../abi/octagon-license";
import NFTMarketPlace from "../../../abi/nft-marketplace.json";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import Loader from "@/components/reusables/loader/Loader";
import {
  HomeIcon,
  LRIcon,
  UsersIcon,
  ExportIcon,
  CancelIcon,
  BlockIcon,
} from "@/components/marketPlace/MarketIcons";

var metaMaskValues = null;

function UserList() {
  const [licenseData, setLicenseData] = useState([]);
  const [pagination, setPagination] = useState({
    activePage: 1,
    totalData: 0,
    pageRange: 5,
    dataperpage: 10,
  });
  const [searchValue, setSearchValue] = useState();
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);

  useEffect(() => {
    fetchLicenseData({
      offset: 0,
      limit: 10,
      activePageNo: 1,
    });
  }, []);

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

  const fetchLicenseData = async (data) => {
    try {
      if (!data.offset) {
        data.offset = 0;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data.offset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/getalllicencesaccept`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLicenseData(result?.data?.data);
      await setPagination({
        ...pagination,
        totalData: result.data.total,
        activePage: data.activePageNo,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = async (pageNumber) => {
    try {
      if (isNaN(pageNumber)) {
        return;
      }
      let offset = (pageNumber - 1) * pagination.dataperpage;
      if (searchValue != null && searchValue != undefined) {
        await fetchLicenseInfo(searchValue, {
          offset: offset,
          activePageNo: pageNumber,
        });
      } else {
        await fetchLicenseData({
          offset: offset,
          activePageNo: pageNumber,
        });
      }
    } catch (e) {
      console.log("Handle page change : ", e);
    }
  };

  const cancelLicense = async (status, id, userAddress) => {
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
                  alt={"Connectwallet image"}
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

      const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

      const contract = new metaMaskValues.metaconn.web3.eth.Contract(
        OctagonLicense,
        `${process.env.NEXT_PUBLIC_Octagon_License_Contract_Address}`,
        {
          from: accounts[0],
        }
      );
      try {
        const result = await contract.methods
          .CancellLicenseCancell(userAddress)
          .send();
        console.log("result", result);
        if (result && result.transactionHash != undefined) {
          setShow(true);
          setModalHeader("Transaction");
          await setModalBody(
            <div className="modalcontentSuccess modalWithImage">
              <div className="topImage">
                <div className="wallet">
                  <Image
                    width={1221}
                    height={1221}
                    src="/images/success.png"
                    alt={"success image"}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="contentbox">
                <h5>Transaction Successful</h5>
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
          const encryptData = await requestBodyEncryptionAdmin({
            status: "cancelLicese",
            id: id,
          });
          await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/cancellicense`,
            { data: encryptData },
            {
              withCredentials: true,
              headers: {
                "security-set": true,
              },
            }
          );
          fetchLicenseData({
            offset: 0,
            limit: 10,
            activePageNo: 1,
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
                    alt={"Failed image"}
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
          return;
        }
      } catch (e) {
        console.log("e", e);
        setShow(true);
        setModalBody(
          <div className="modalcontentSuccess buydeswap modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Connectwallet.png"
                  alt={"Connectwallet image"}
                  crossorigin=""
                  loading="lazy"
                />
              </div>
            </div>

            <div className="contentbox">
              <h5>Transaction Failed</h5>
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLicenseInfo = async (value, data) => {
    try {
      setSearchValue(value);
      let offset;
      if (!data) {
        offset = 0;
      } else {
        offset = data.offset;
      }

      let encryptionData = await requestBodyEncryptionAdmin({
        licenseID: value,
        offset: offset,
      });

      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/requestlicensesearch`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      let userDataTable = result?.data;
      if (data) {
        userDataTable.activePageNo = data?.activePageNo;
      }
      await setLicenseData(userDataTable.data);
      await setPagination({
        ...pagination,
        totalData: userDataTable.totalData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="UsersContainer">
        <div className="UsersContainerInner">
          <div className="exportBox">
            <div className="searchBox">
              <Searchicon />
              <input
                type="text"
                placeholder="Search License By ID Or Customers Address "
              />
            </div>
            <div className="exportBtn">
              <button>
                <ExportIcon />
                Export
              </button>
            </div>
          </div>
          <div className="UsersTable customScroll">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th> License ID</th>
                  <th>Address</th>
                  <th>Customer</th>
                  <th>Approval Date</th>
                  <th> Status </th>
                  <th> Action </th>
                </tr>
              </thead>
              <tbody>
                {licenseData
                  ? licenseData.map((data) => {
                      return (
                        <tr key={data.licenseID}>
                          <td>{data.licenseID}</td>
                          <td>
                            {data?.UserID?.walletaddress?.[
                              data.UserID.walletaddress.length - 1
                            ].substring(0, 6) +
                              "...." +
                              data?.UserID?.walletaddress?.[
                                data.UserID.walletaddress.length - 1
                              ].substring(
                                data?.UserID?.walletaddress?.[
                                  data?.UserID?.walletaddress.length - 1
                                ].length - 4
                              )}
                          </td>
                          <td>{data?.UserID?.username}</td>
                          <td>
                            {data.updated_at
                              ? myRewardsDate(data.updated_at)
                              : "N/A"}
                          </td>
                          <td>
                            <div
                              className={`statusBadge ${
                                data.status == "Accept"
                                  ? "Approved"
                                  : "Rejected"
                              }`}
                            >
                              {data.status == "Accept"
                                ? "Approved"
                                : data.status}
                            </div>
                          </td>
                          <td>
                            <div className="action">
                              <button
                                onClick={() => {
                                  cancelLicense(
                                    data.status,
                                    data._id,
                                    data?.UserID?.walletaddress[
                                      data.UserID.walletaddress.length - 1
                                    ]
                                  );
                                }}
                              >
                                <BlockIcon />
                                <CancelIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
                <tr>
                  <td>729281</td>
                  <td>32134...83812</td>
                  <td>Dinial Rikson</td>
                  <td>27 June, 2022</td>
                  <td>
                    <div className="statusBadge Approved">Approved</div>
                  </td>
                  <td>
                    <div className="action">
                      <button>
                        <CancelIcon />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>729281</td>
                  <td>32134...83812</td>
                  <td>Dinial Rikson</td>
                  <td>27 June, 2022</td>
                  <td>
                    <div className="statusBadge Rejected">Rejected</div>
                  </td>
                  <td>
                    <div className="action">
                      <button>
                        <BlockIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
