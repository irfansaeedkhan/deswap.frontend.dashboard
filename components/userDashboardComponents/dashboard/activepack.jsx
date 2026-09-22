import React, { useState, useEffect } from "react";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import moment from "moment";
import { claimmedDate } from "../../../utils/common/date";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {SanitizeRequestString,SanitizeRequestObject} from "@/utils/common/sanitize"


function ActivePack() {
  const tableLimit = 100;
  const [tableContent, settableContent] = useState(
    <tr>
      <td className="text-center" colSpan={3}>
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
              {data[index].TotalAmount && data[index].PackID.Bonous
                ? data[index].TotalAmount +
                  (data[index].TotalAmount * data[index].PackID.Bonous) / 100
                : "N/A"}
            </td>
            <td>
              {" "}
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
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     });
      console.log(e);
      console.log("Failed to create table content");
      settableContent(
        <tr>
          <td className="text-center" colSpan={3}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
  };
  const fetchData = async (currentpage = 0) => {
    try {
      settableContent(<TableLoader colSpan={3} />);
      let currentOffset = (await currentpage) * tableLimit;
      currentOffset=await SanitizeRequestString(currentOffset)
      let encryptionData = await encryptRequestBody({
        skip: currentOffset,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/purchasedpack/fetch/active`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let data = result.data;
      if (data.data.length < 1) {
        settableContent(
          <tr>
            <td className="text-center" colSpan={3}>
              <NodataCard></NodataCard>
            </td>
          </tr>
        );
        return;
      }
      await createTableContent(data.data, data.totaldata, currentpage);
    } catch (e) {
      // toast.error(e.message, {
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     });
      console.log("Failed to fetch data");
      settableContent(
        <tr>
          <td className="text-center" colSpan={3}>
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
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     });
      settableContent(
        <tr>
          <td className="text-center" colSpan={3}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
      })();
  }, []);

  return (
    <div className="DSwapLocked">
      <h3>Your Deswap Locked</h3>
      <div className="DSwapLockedTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Amount(DAW)</th>
              <th>Unclock Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
            {/* <tr>
                    <td>6,250</td>
                    <td>In 12 Months</td>
                    <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                    </td>
                    </tr>
                    <tr>
                    <td>30,250</td>
                    <td>In 12 Months</td>
                    <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                    </td>
                    </tr>
                    <tr>
                    <td>80,250</td>
                    <td>10 Months Ago</td>
                    <td>
                        <button className="locked btnHoverEffectOutline">Locked</button>
                    </td>
                    </tr> */}
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
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}
export default ActivePack;
