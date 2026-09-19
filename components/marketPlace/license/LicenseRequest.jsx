import React, { useState, useEffect } from "react";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import Image from "next/image";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import axios from "axios";
import NodataCard from "@/components/reusables/NodataCard";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { myRewardsDate } from "@/utils/common/date";
import { SanitizeRequestStringSync } from "@/utils/common/sanitize";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Pagination from "react-js-pagination";
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

var metaMaskValues = null;

function LicenseRequest() {
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
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/getalllicencesrequest`,
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

  const changeStatusApprove = async (status, id, userAddress) => {
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
                  crossOrigin=""
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
      try {
        const result = await contract.methods
          .approveRequest(userAddress)
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
                    alt={"deswap image"}
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
            status: status,
            id: id,
          });
          await axios.post(
            `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/approve`,
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
                    alt={"deswap image"}
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
                  alt={"deswap image"}
                  crossOrigin=""
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

  const changeStatusReject = async (status, id) => {
    try {
      const encryptData = await requestBodyEncryptionAdmin({
        status: status,
        id: id,
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/approve`,
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
      <div className="searchBox">
        <Searchicon />
        <input
          type="text"
          placeholder="Search License By ID Or Customers Address "
          onKeyUp={(e) => {
            fetchLicenseInfo(e.target.value);
          }}
        />
      </div>
      <div className="lincenseTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>License ID</th>
              <th>Address</th>
              <th>Customer</th>
              <th>Application Date</th>
              <th colSpan={2}>Requests</th>
            </tr>
          </thead>
          <tbody>
            {licenseData.length > 0 ? (
              licenseData.map((data) => {
                return (
                  <tr key={SanitizeRequestStringSync(data._id)}>
                    <td>{SanitizeRequestStringSync(data.licenseID)}</td>
                    <td>
                      {SanitizeRequestStringSync(
                        reducedWalletAddress(data.creatorAddress)
                      )}
                    </td>
                    <td>{SanitizeRequestStringSync(data.name)}</td>
                    <td>
                      {SanitizeRequestStringSync(
                        myRewardsDate(data.submitedAt)
                      )}
                    </td>
                    <td>
                      <div className="btnCOntainer">
                        <SimpleButton
                          text={"Approve"}
                          backgroundColor={"#40DD3E"}
                          color={"#0A0A0A"}
                          onClick={() => {
                            changeStatusApprove(
                              "Accept",
                              data._id,
                              data.creatorAddress
                            );
                          }}
                        />
                        <SimpleButton
                          text={"Reject"}
                          backgroundColor={"rgba(226, 60, 76, 0.05)"}
                          color={"#E23C4C"}
                          onClick={() => {
                            changeStatusReject("Reject", data._id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="text-center" colSpan={13}>
                  <NodataCard />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div className="total">{/*<p>Total {totaltable1Data} Item</p>*/}</div>
        <Pagination
          disabledClass={pagination.disabledClass}
          hideDisabled={true}
          activePage={pagination.activePage}
          itemsCountPerPage={pagination.dataperpage}
          totalItemsCount={pagination.totalData}
          pageRangeDisplayed={pagination.pageRange}
          innerClass={"pagination"}
          activeClass={"link"}
          onChange={handlePageChange}
        />
      </div>
      <div className="pagination mobile">
        <div className="total">
          {/*<p>Total {totaltable1Data ? totaltable1Data : "N/A"} Item</p>*/}
        </div>
        <Pagination
          disabledClass={pagination.disabledClass}
          hideDisabled={true}
          activePage={pagination.activePage}
          itemsCountPerPage={pagination.dataperpage}
          totalItemsCount={pagination.totalData}
          pageRangeDisplayed={pagination.pageRange}
          innerClass={"pagination"}
          activeClass={"link"}
          onChange={handlePageChange}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(LicenseRequest);
