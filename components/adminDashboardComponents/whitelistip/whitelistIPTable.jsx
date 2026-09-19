import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Pagination from "react-js-pagination";
import Joi from "joi";
import BootstrapModal from "../../reusables/BootstrapModal";
import EditIcon from "../../../assets/svgAssets/EditIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPen } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const editIcon = <FontAwesomeIcon icon={faPen} />;
const infoIcon = <FontAwesomeIcon icon={faInfo} />;


function WhitelistIPTable() {
    
    const [iptableContent, setIPtableContent] = useState(null);
    const [pagination, setPagination] = useState({
        activePage: 1,
        totalData: 0,
        pageRange: 5,
        dataperpage: 10,
    });

    const fetchIPLists = async () => {
        try {

            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/access/fetch`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'security-set': false
                    }
                }
            );
            setLoading(result && false)
            if (result?.data?.data?.length > 0) {
                setUsersList(result.data.data);
                return result.data.data;
            } else {
                setUsersList(<tr><td className="text-center" colSpan={6}><NodataCard /></td></tr>);
            }

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
            setLoading(false)
            setUsersList(<tr><td className="text-center" colSpan={6}><FailedToFetchData /></td></tr>)
            console.log(e);
            return 0;
        }
    };

    useEffect(async () => {
        try {

        } catch (e) {
          
            console.log("White list ip ", e)
        }
    }, []);

  return (
    <div className="AdminUserAccTabMain">
      <div className="UserListtableContainer">
        <div className="UserAccContainer">
          <div className="UserAccContainerTable customScroll">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Wallet Address</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Registeration Fee</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{iptableContent}</tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="total">
              {/*<p>Total {totaltable1Data} Item</p>*/}
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
        </div>
        <BootstrapModal
          show={show}
          handleClose={closeConnectButtonClick}
          modaltitle={modalheader}
          modalbody={modalbody}
          modalfooter={modalfooter}
        ></BootstrapModal>
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

export default WhitelistIPTable;
