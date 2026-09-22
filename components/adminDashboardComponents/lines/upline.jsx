import React, { useState, useEffect } from "react";
import SmRightArrow from "@/assets/svgAssets/SmRightArrow";
import SmLeftArrow from "@/assets/svgAssets/SmLeftArrow";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import axios from "@/utils/common/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject} from "../../../utils/common/sanitize"

/*export const getServerSideProps = async (ctx) => {
  return  await checkAdminAuth(ctx);
}*/

function Upline(props) {
  const [loading, setLoading] = useState(false);
  const list=["first","second","third","fourth"]
  //const [uplineList, setUplineList] = useState([]);

  // const fetchUplineFunc = async () => {
  //   try {
  //     setLoading(true)
  //     let sanData= await SanitizeRequestObject(data)
  //     let encryptionData = await requestBodyEncryptionAdmin(sanData);
  //     let result = await axios.post(
  //       `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/network/upline`,
  //       {userid:data},
  //       { withCredentials: true }
  //     );
  //     console.log("hello")
  //     setLoading(result && false)
  //     if(result.data.data.length > 0){
  //       await SanitizeRequestObject(result.data.data)
  //       setUplineList(result.data.data);
  //       return result.data.data;
  //     }else{
  //       setUplineList(<tr><td className="text-center" colSpan={3}><NodataCard></NodataCard></td></tr>);
  //     }
      
  //     return result.data.data;
  //   } catch (e) {
  //     // toast.error(e.message, {
  //     //   position: "top-center",
  //     //   autoClose: 3000,
  //     //   hideProgressBar: false,
  //     //   closeOnClick: true,
  //     //   pauseOnHover: true,
  //     //   draggable: true,
  //     //   progress: undefined,
  //     //   });
  //     setLoading(false)
  //     setUplineList(<tr><td className="text-center" colSpan={3}><FailedToFetchData></FailedToFetchData></td></tr>);
  //     console.log(e);
  //     return 0;
  //   }
  // };
  useEffect(() => {
    void (async () => {
    //await fetchUplineFunc();
      })();
  }, []);
  return (
    <div className="adminUplineContainer">
      <div className="tableContainer">
        <p>Upline Data</p>
        <div className="tableContainerTable customScroll">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
                <th className="hashTable">#</th>
                <th>Public Key</th>
                <th>User Level</th>
              </tr>
            </thead>
            <tbody>
              {props.uplineList.length>0?props.uplineList.map((data,index)=>{
                return(
                <tr>
                <td>{index+1}</td>
                <td>{data.MetaMaskAccountPublicKey}</td>
                <td> <button className="Unlocked">{list[index]}</button></td>
              </tr>
                )
              }):
              <tr>
              <td className="text-center" colSpan={13}>
                <NodataCard />
              </td>
            </tr>
            }
            </tbody>
          </table>
        </div>
        {/* <div className="pagination">
          <div className="total">
            <p>Total Items :  221</p>
            {"  "}
          </div>

          <div className="content_detail__pagination cdp" actpage="1">
            <a href="#" className="cdp_i">
              <SmLeftArrow />
            </a>
            <a href="#" className="cdp_i">
              1
            </a>
            <a href="#" className="cdp_i">
              2
            </a>
            <a href="#" className="cdp_i">
              <SmRightArrow />
            </a>
          </div>
        </div> */}
        {/* <div className="pagination mobile">
          <div className="total">
            <p>Total Items :  221</p>
            {"  "}
          </div>

          <div className="content_detail__pagination cdp" actpage="1">
            <a href="#" className="cdp_i">
              <SmLeftArrow />
            </a>
            <a href="#" className="cdp_i">
              1
            </a>
            <a href="#" className="cdp_i">
              2
            </a>
            <a href="#" className="cdp_i">
              <SmRightArrow />
            </a>
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

export default Upline;
