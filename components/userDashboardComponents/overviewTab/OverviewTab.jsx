import React,{useEffect,useState} from "react";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import { RWebShare } from "react-web-share";
import {convertToEuro} from "../../../utils/common/currencyconversion";
import axios from "../../../utils/common/axios";
import {encryptRequestBody } from "@/utils/common/jwtToken";
//import { checkUserAuth } from "../../../utils/auth/userauth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestString,SanitizeRequestObject} from "../../../utils/common/sanitize"



function OverviewTab({setTabRewards,setTabUpgrade,users}) {
  //
  const [sharelink, setShareLink] = useState("")
  const [totalRewardsUSD, settotalRewardsUSD] = useState("0,0");
  const [totalRewardsDeswap, settotalRewardsDeswap] = useState("0,0");
  const [userDirectNetwork, setuserDirectNetwork] = useState(0);
  const [userWalletAddress, setuserWalletAddress] = useState("");
  
  let usdtodeswap = 0;
  const fetchRewardsData = async()=>{
    try{
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/fetch/totaldata`,
        {},
        {
          withCredentials: true,
          headers:{
            'security-set':false
          }
        }
      );
      let networkRewards = result.data.data;
      networkRewards=await SanitizeRequestObject(networkRewards)

      await settotalRewardsUSD(convertToEuro(networkRewards.total[0].totalRewards))
      await settotalRewardsDeswap(convertToEuro(networkRewards.total[0].totalRewards*usdtodeswap))

    }catch(e){
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      console.log("Error  message : ",e)
    }
  }
  const networkProfileData = async()=>{
    try{
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/network`,
        {},
        {
          withCredentials: true,
          headers:{
            'security-set':false
          }
        }
      );
      let data = result.data.data;
      data=await SanitizeRequestObject(data)
      setuserDirectNetwork(data.directnetwork)
      setuserWalletAddress(data.publickey)
    }catch(e){
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Error message")
    }
  }
  const fetchUSDToDeswap = async()=>{
    try{
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartodeswap`,
        {},
        {
          withCredentials: true,
          headers:{
            'security-set':false
          }
        }
      );
      usdtodeswap = result.data.conversion
      usdtodeswap=await SanitizeRequestString(usdtodeswap)
      await fetchRewardsData();
    }catch(e){
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Fetch USD to Deswap : ",e)
    }
  }

  useEffect(()=>{
    try{
      fetchUSDToDeswap()
      networkProfileData()
      //Uncomment it
      //await fetchUSDToDeswap();
      
      let share = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid;
      setShareLink(share)
    }catch(e){
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to create link",e)
    }
  },[]);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };
  return (
    <div className="overviewContainer">
      <div className="overviewInner">
        <div className="topCards">
          <div className="walletCard">
            <div className="walletcardcontent">
              <div className="walletContainbox"><h3>Your Wallet : </h3> <h4>{userWalletAddress ? userWalletAddress : "N/A"}</h4></div>
              <div className="directnetwork">
                <h5>Direct Network</h5>
                <h6>{userDirectNetwork ? userDirectNetwork : "N/A"}</h6>
              </div>
              <div className="totalclaimed">
                <h5>Total Claimed</h5>
                <h6>DESWAP {totalRewardsDeswap ? totalRewardsDeswap : "N/A"} ~ $ {totalRewardsUSD ? totalRewardsUSD : "N/A"}</h6>
              </div>
            </div>
          </div>
          <div className="shareCard">
            <div className="sharecardcontent">
              <h3>
                Invite Your Friend & Enjoy Additional 0.03% Daily Of Your
                Friends Stacking Pack Earnings!
              </h3>
              <div className="referalcodeContainer">
                <div className="leftreferalcard">
                  <label htmlFor="" className="label">
                    Referral Code
                  </label>
                  <div className="copyCodeContainer">
                    <span className="referalcode">
                      {sharelink}
                    </span>
                    <button className="copyBtn" onClick={copy}>
                      <div className="copyImgIcon">
                        {" "}
                        <CopyIcon />
                      </div>
                    </button>
                  </div>
                </div>
                {
                  <RWebShare 
                  data={{
                    text: "Registration refer link ",
                    url: sharelink,
                    title: "link",
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <div className="rightshareBtn">
                    <button className="btnHoverEffectOutline">Share</button>
                  </div>
                </RWebShare>
                /*<div className="rightshareBtn">
                  <button className="btnHoverEffectOutline">Share</button>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bottomCard">
          <div className="LactivatedContainer">
            <h3>License Activated</h3>
            <div className="LactivatedTable customScroll">
              <table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                  <tr>
                    <th>License</th>
                    <th> Lv.1 </th>
                    <th> Lv.2 </th>
                    <th> Lv.3 </th>
                    <th> Lv.4 </th>
                    <th> Lv.5 </th>
                    <th> Lv.6 </th>
                    <th> Lv.7 </th>
                    <th> Lv.8 </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Network License 1</td>
                    <td>0.05%</td>
                    <td>0.05%</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  <tr>
                    <td>Network License 1</td>
                    <td>0.05%</td>
                    <td>0.05%</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                </tbody>
              </table>
              <div className="buttonContainer">
                <SimpleButton
                  text="View All Commissions"
                  color="#FFFFFF"
                  backgroundColor="#E44757"
                  padding="1.5rem 3rem"
                  onClick={setTabRewards}
                />
                <SimpleButton
                  text="Upgrade Network License"
                  color="#FFFFFF"
                  backgroundColor="#E44757"
                  padding="1.5rem 3rem"
                  onClick={setTabUpgrade}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <ToastContainer
position="top-center"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
/>
    </div>
  );
}

export default OverviewTab;
