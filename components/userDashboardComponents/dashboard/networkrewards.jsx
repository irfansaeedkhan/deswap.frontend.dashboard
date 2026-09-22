import React, { useState, useEffect } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import TableLoader from "@/components/reusables/loader/TableLoader";
import moment from "moment";
import { claimmedDate, myRewardsDate } from "../../../utils/common/date";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestString,SanitizeRequestObject} from "@/utils/common/sanitize"


function NetworkRewards() {
  const tableLimit = 100;
  const [tableContent, settableContent] = useState(
    <tr>
      <td className="text-center" colSpan={4}>
        Loading...
      </td>
    </tr>
  );

  const createTableContent = async (data, totalRecords, currentPage) => {
    try {
      let tableDataArray = [];
      for (let index in data) {
        const wallets = data[index]?.UserFrom?.walletaddress;
        const holder = Array.isArray(wallets)
          ? wallets[wallets.length - 1]
          : wallets || "N/A";
        const holderDisplay =
          typeof holder === "string" && holder.length > 12
            ? `${holder.slice(0, 6)}...${holder.slice(-4)}`
            : holder;
        tableDataArray.push(
          <tr>
            <td>{holderDisplay}</td>
            <td>
              {data[index]?.Amount && data[index]?.RewardsPercentage
                ? data[index].Amount * data[index].RewardsPercentage
                : "N/A"}
            </td>
            <td>
              {data[index]?.created_at
                ? myRewardsDate(data[index].created_at)
                : "N/A"}
            </td>

            <td>
              {data[index]?.Status == "Claimmed" ? (
                <button className="locked">Claimmed</button>
              ) : (
                <button className="locked btnHoverEffectOutline">Locked</button>
              )}
            </td>
          </tr>
        );
      }
      settableContent(tableDataArray);
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log(e);
      console.log("Failed to create table content");
      settableContent(
        <tr>
          <td className="text-center" colSpan={4}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };
  const fetchData = async (currentpage = 0) => {
    try {
      settableContent(<TableLoader colSpan={4} />);
      let currentOffset = currentpage * tableLimit;
      currentOffset=await SanitizeRequestString(currentOffset)
      let encryptionData = await encryptRequestBody({
        skip: currentOffset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/fetch/all`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let data = result.data;
      data=await SanitizeRequestObject(data);
      if (data.data.length < 1) {
        settableContent(
          <tr>
            <td className="text-center" colSpan={4}>
              <NodataCard></NodataCard>
            </td>
          </tr>
        );
        return;
      }
      await createTableContent(data.data, data.totaldata, currentpage);
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to fetch data");
      settableContent(
        <tr>
          <td className="text-center" colSpan={4}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };

  useEffect(() => {
    void (async () => {
    try {
      await fetchData();
      //
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      settableContent(
        <tr>
          <td className="text-center" colSpan={4}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
      })();
  }, []);

  return (
    <div className="DistributionContainer">
      <h3>Distribution</h3>
      <div className="DistributionContainerTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Holders</th>
              <th>Amount(DAW)</th>
              <th>Unclock Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
            {/*
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="locked btnHoverEffectOutline">Locked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="Unlocked">Unlocked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="Unlocked">Unlocked</button>
                </td>
            </tr>
            <tr>
                <td>0x7c73...fd49</td>
                <td>6,250</td>
                <td>In 12 Months</td>
                <td>
                <button className="Unlocked">Unlocked</button>
                </td>
            </tr>*/}
          </tbody>
        </table>
      </div>
      {/* <div className="viewAll">
        <button>View All</button>
        </div> */}
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
export default NetworkRewards;
