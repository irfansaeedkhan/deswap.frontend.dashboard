import React, { useState, useEffect } from "react";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
import axios from "@/utils/common/axios";
import {
  SanitizeRequestStringSync,
  SanitizeRequestObject,
} from "../../utils/common/sanitize";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { myRewardsDate } from "@/utils/common/date";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { checkUserAuth } from "@/utils/auth/userauth";
import Web3 from "web3";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../utils/wallet/index";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};

function License() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [userDetails, setUserDetails] = useState();
  const [licenseID, setLicenseID] = useState();
  const [accept, setAccept] = useState();
  const [signatureHash, setSignatureHash] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
    fetchLicenseID();
  }, []);

  const fetchLicenseID = async () => {
    try {
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLicenseID(result?.data?.data?.licenseID);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserInfo = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setUserDetails(result.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const signature = async (e) => {
    try {
      if (e.target.checked) {
        let result = await connectToWallet("metamask");

        let metamaskAccounts = await fetchMetaMaskAccount(result.web3);
        let web3 = new Web3(
          new Web3.providers.HttpProvider(
            process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK
          )
        );
        let accounts = await web3.eth.getAccounts();
        if (
          userDetails.walletaddress[
            userDetails.walletaddress.length - 1
          ].toLowerCase() !==
          metamaskAccounts[metamaskAccounts.length - 1].toLowerCase()
        ) {
          await setShow(true);
          await setModalBody(
            <div className="licenseModal">
              <p>Invalid Public Key</p>
            </div>
          );
          await setModalFooter(
            <div className="ModalFooterbtnContainer">
              <SimpleButton
                text={"Ok"}
                backgroundColor={"rgba(228, 71, 87, 0.12)"}
                color={"#e44757"}
                onClick={closeButton}
              />
            </div>
          );
          return;
        }
        result.web3.eth.sign(
          web3.utils.sha3(
            "1.Communicating with technical and non-technical team members to understand requirements clearly,2.Solving any technical issues (mostly software-related),3.Recommending better solutions to existing process,4.Researching, designing, implementing, and managing software programs,5.Working closely with other developers and the technical team,6.Perform all other duties and tasks as assigned/required"
          ),
          userDetails.walletaddress[userDetails.walletaddress.length - 1],
          function (err, result) {
            if (result) {
              setSignatureHash(result);
              setAccept(e.target.checked);
            }
          }
        );
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const backFunc = () => {
    router.push("/market/userprofile");
  };

  const submitFunc = async () => {
    try {
      let data = {
        activate: accept,
        name: userDetails.username,
        signature_hash: signatureHash,
      };
      console.log("Data : ", data);
      data = await SanitizeRequestObject(data);
      console.log("Santize Request : ", data);
      data = await encryptRequestBody(data);
      console.log("Encryption request : ", data);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/insert`,
        { data: data },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      if (result.data.data) {
        setAccept(false);
        setSignatureHash(null);
        document.getElementById("term").checked = false;
        await setShow(true);
        await setModalHeader("Success");
        await setModalBody(
          <div className="licenseModal">
            <p>
              Your application for license has been sent, we will let you know
              soon
            </p>
          </div>
        );
        await setModalFooter(
          <div className="ModalFooterbtnContainer">
            <SimpleButton
              text={"Ok"}
              backgroundColor={"rgba(228, 71, 87, 0.12)"}
              color={"#e44757"}
              onClick={closeButton}
            />
          </div>
        );
      }
      router.push("/market/userprofile");
    } catch (e) {
      console.log("Failed to apply for license ", e);
    }
  };

  const closeButton = () => {
    setShow(false);
  };
  return (
    <div className="licenseContainer">
      <div className="innerLicense">
        <div className="Lcontent">
          <div className="head">
            <div className="logoicon">
              <div className="imgbox">
                <Image
                  width={44}
                  height={44}
                  src="/images/licenseLogo.png"
                  alt={"logo icon"}
                  loading="lazy"
                />
              </div>
              <h3>Deswap_Octagon</h3>
            </div>
            <p>Date: {myRewardsDate(new Date())}</p>
            <p>
              License ID:{" "}
              {licenseID ? SanitizeRequestStringSync(licenseID) : "N/A"}
            </p>
          </div>
          <div className="details">
            <h2>License Application</h2>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet.
            </p>
            <p>
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
              ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur? Quis autem vel eum iure reprehenderit qui in ea
              voluptate velit esse quam nihil molestiae consequatur, vel illum
              qui dolorem eum fugiat quo voluptas nulla pariatur?"
            </p>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet.
            </p>

            <p>
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem
              ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur? Quis autem vel eum iure reprehenderit qui in ea
              voluptate velit esse quam nihil molestiae consequatur, vel illum
              qui dolorem eum fugiat quo voluptas nulla pariatur?"
            </p>

            <div className="terms">
              <h6>
                PLease read the following terms and condistion carefully :
              </h6>
              <ul>
                <li>
                  Communicating with technical and non-technical team members to
                  understand requirements clearly
                </li>
                <li>Solving any technical issues (mostly software-related)</li>
                <li>Recommending better solutions to existing process</li>
                <li>
                  Researching, designing, implementing, and managing software
                  programs
                </li>
                <li>
                  Working closely with other developers and the technical team
                </li>
                <li>Perform all other duties and tasks as assigned/required</li>
              </ul>
            </div>

            <div className="checklist">
              <input
                type="checkbox"
                name=""
                id="term"
                onChange={(e) => {
                  signature(e);
                }}
              />
              <h5>I Accept and agree to all terms and conditions.</h5>
            </div>
            <div className="btnContainer">
              <SimpleButton
                text={"Go Back"}
                backgroundColor={"#372426"}
                color={"#e44757"}
                onClick={backFunc}
              />
              <SimpleButton
                text={"Submit"}
                backgroundColor={!accept ? "#333333" : "#E44757"}
                color={!accept ? "#474747" : "#FFFFFF"}
                disabled={!accept}
                onClick={submitFunc}
              />
            </div>
          </div>
        </div>
        <div className="Lcard">
          <div className="LcardInner">
            <div className="profile">
              <div className="profileImg">
                <Image
                  width={50}
                  height={50}
                  src="/images/userprofilepic.png"
                  alt={"logo icon"}
                  loading="lazy"
                />
              </div>
              <div className="profileName">
                <h3>
                  {userDetails &&
                    SanitizeRequestStringSync(userDetails.username)}
                </h3>
                <h4>
                  {" "}
                  {userDetails &&
                    SanitizeRequestStringSync(
                      reducedWalletAddress(
                        userDetails.walletaddress[
                          userDetails.walletaddress.length - 1
                        ]
                      )
                    )}
                </h4>
              </div>
            </div>
            <div className="detailbox">
              <h5>Address</h5>
              <h6>
                {userDetails &&
                  SanitizeRequestStringSync(
                    reducedWalletAddress(
                      userDetails.walletaddress[
                        userDetails.walletaddress.length - 1
                      ]
                    )
                  )}
              </h6>
            </div>
            <div className="detailbox">
              <h5>License ID</h5>
              <h6>
                {licenseID ? SanitizeRequestStringSync(licenseID) : "N/A"}
              </h6>
            </div>

            <h2>Preview</h2>
            <div className="licenseCard">
              <div className="cardTop">
                <div className="cardtitle">
                  <h3>LICENSE CARD</h3>
                  <h3>OCTAGOON</h3>
                </div>
                <div className="cardImg">
                  <Image
                    width={126}
                    height={181}
                    src="/images/licensecardImg.png"
                    alt={"logo icon"}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="cardFooter">
                <div className="detailbox">
                  <h5>Address</h5>
                  <h6>
                    {userDetails &&
                      SanitizeRequestStringSync(
                        reducedWalletAddress(
                          userDetails.walletaddress[
                            userDetails.walletaddress.length - 1
                          ]
                        )
                      )}
                  </h6>
                </div>
                <div className="detailbox">
                  <h5>License ID</h5>
                  <h6>
                    {licenseID ? SanitizeRequestStringSync(licenseID) : "N/A"}
                  </h6>
                </div>
                <div className="cardBottom">
                  <Image
                    width={318}
                    height={50}
                    src="/images/footerbars.png"
                    alt={"logo icon"}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
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

export default License;
