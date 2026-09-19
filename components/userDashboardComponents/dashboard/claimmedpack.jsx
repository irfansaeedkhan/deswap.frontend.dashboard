import React, { useState, useEffect } from "react";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import moment from "moment";
import { claimmedDate } from "../../../utils/common/date";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestString,SanitizeRequestObject} from "@/utils/common/sanitize"


function ClaimmedPack() {
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
        tableDataArray.push(
          <tr>
            <td>
              {data[index]?.TotalAmount && data[index]?.PackID?.Bonous
                ? data[index].TotalAmount +
                  (data[index].TotalAmount * data[index].PackID.Bonous) / 100
                : "N/A"}
            </td>
            <td>
              {data[index]?.created_at &&
              data[index]?.PackID?.LockedPeriod &&
              data[index]?.PackID?.LockedPeriodType
                ? claimmedDate(
                    data[index].created_at,
                    data[index].PackID.LockedPeriod,
                    data[index].PackID.LockedPeriodType
                  )
                : "N/A"}
            </td>
            <td>
              <button className="locked btnHoverEffectOutline">Locked</button>
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
      currentOffset= await SanitizeRequestString(currentOffset)
      let encryptionData = await encryptRequestBody({
        skip: currentOffset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/purchasedpack/fetch/claimmed`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let data = result.data;
      data=await SanitizeRequestObject(data)
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

  useEffect(async () => {
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
  }, []);
  return (
    <div className="TransactionHistory">
      <h3>Transaction History</h3>
      <div className="TransactionHistoryTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Amount(DAW)</th>
              <th>Bonous</th>
              <th>Txhash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
            {/*<tr>
                    <td>6,250</td>
                    <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                    </td>
                    <td>0xa94e...639c</td>
                    <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                    </td>
                    </tr>
                    <tr>
                    <td>6,250</td>
                    <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                    </td>
                    <td>0xa94e...639c</td>
                    <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                    </td>
                    </tr>
                    <tr>
                    <td>6,250</td>
                    <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                    </td>
                    <td>0xa94e...639c</td>
                    <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                    </td>
                    </tr>*/}
          </tbody>
        </table>
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
export default ClaimmedPack;
